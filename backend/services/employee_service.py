from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import List, Optional, Dict, Any
import models
import schemas
from ml_model import predict_single_employee
from services.mongodb_service import sync_employee_to_mongo, delete_employee_from_mongo, clear_all_mongo_employees

def get_employees(
    db: Session,
    skip: int = 0,
    limit: int = 500,
    search: Optional[str] = None,
    department: Optional[str] = None,
    performance_group: Optional[str] = None,
    job_role: Optional[str] = None
) -> List[models.Employee]:
    query = db.query(models.Employee)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                models.Employee.name.ilike(search_fmt),
                models.Employee.employee_id.ilike(search_fmt),
                models.Employee.job_role.ilike(search_fmt),
                models.Employee.department.ilike(search_fmt)
            )
        )
    if department and department != "All":
        query = query.filter(models.Employee.department == department)
    if performance_group and performance_group != "All":
        query = query.filter(models.Employee.performance_group == performance_group)
    if job_role and job_role != "All":
        query = query.filter(models.Employee.job_role == job_role)

    return query.order_by(models.Employee.id.asc()).offset(skip).limit(limit).all()

def get_employee_by_id(db: Session, employee_id: str) -> Optional[models.Employee]:
    return db.query(models.Employee).filter(
        or_(
            models.Employee.employee_id == employee_id,
            models.Employee.id == int(employee_id) if employee_id.isdigit() else False
        )
    ).first()

def create_employee(db: Session, emp_data: schemas.EmployeeCreate, user_id: Optional[int] = None) -> models.Employee:
    # Auto-generate unique employee_id if missing or empty
    if not emp_data.employee_id or not str(emp_data.employee_id).strip():
        max_id = db.query(models.Employee).count()
        candidate_id = f"EMP-{1000 + max_id + 1}"
        while db.query(models.Employee).filter(models.Employee.employee_id == candidate_id).first():
            max_id += 1
            candidate_id = f"EMP-{1000 + max_id + 1}"
        emp_data.employee_id = candidate_id
    else:
        emp_data.employee_id = str(emp_data.employee_id).strip()

    input_dict = emp_data.model_dump()
    
    # Auto-evaluate performance group if not set
    if not input_dict.get("performance_group"):
        prediction_result = predict_single_employee(input_dict)
        auto_perf_group = prediction_result["predicted_group"]
        input_dict["performance_group"] = auto_perf_group

    db_employee = models.Employee(**input_dict)
    db.add(db_employee)
    
    # Create Notification in DB
    notification = models.Notification(
        user_id=user_id,
        title="New Employee Added",
        message=f"{db_employee.name} ({db_employee.employee_id}) was added to {db_employee.department} as {db_employee.performance_group}."
    )
    db.add(notification)

    # Check low performance notification alert
    if db_employee.performance_group == "Low Performance":
        alert_notif = models.Notification(
            user_id=user_id,
            title="Low Performance Employee Detected",
            message=f"Attention: {db_employee.name} in {db_employee.department} was classified in the Low Performance tier."
        )
        db.add(alert_notif)

    db.commit()
    db.refresh(db_employee)

    # MongoDB Atlas Sync
    mongo_payload = {
        "employee_id": db_employee.employee_id,
        "name": db_employee.name,
        "age": db_employee.age,
        "gender": db_employee.gender,
        "department": db_employee.department,
        "job_role": db_employee.job_role,
        "monthly_income": db_employee.monthly_income,
        "performance_group": db_employee.performance_group,
        "job_satisfaction": db_employee.job_satisfaction,
        "attendance_rate": db_employee.attendance_rate,
        "training_hours": db_employee.training_hours,
        "projects_completed": db_employee.projects_completed,
        "years_at_company": db_employee.years_at_company,
        "created_at": db_employee.created_at.isoformat() if db_employee.created_at else None
    }
    sync_employee_to_mongo(mongo_payload)

    return db_employee

def update_employee(db: Session, employee_id: str, emp_data: schemas.EmployeeUpdate) -> Optional[models.Employee]:
    emp = get_employee_by_id(db, employee_id)
    if not emp:
        return None

    update_dict = emp_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(emp, key, value)

    # Re-evaluate ML classification if performance_group was not explicitly overridden
    if "performance_group" not in update_dict:
        full_dict = {
            "name": emp.name,
            "age": emp.age,
            "gender": emp.gender,
            "department": emp.department,
            "job_role": emp.job_role,
            "years_at_company": emp.years_at_company,
            "years_in_current_role": emp.years_in_current_role,
            "monthly_income": emp.monthly_income,
            "job_level": emp.job_level,
            "job_satisfaction": emp.job_satisfaction,
            "environment_satisfaction": emp.environment_satisfaction,
            "work_life_balance": emp.work_life_balance,
            "training_hours": emp.training_hours,
            "projects_completed": emp.projects_completed,
            "attendance_rate": emp.attendance_rate,
            "overtime_hours": emp.overtime_hours,
            "previous_experience": emp.previous_experience,
            "promotion_last_5_years": emp.promotion_last_5_years,
            "employee_engagement": emp.employee_engagement,
            "absenteeism": emp.absenteeism
        }
        prediction_result = predict_single_employee(full_dict)
        emp.performance_group = prediction_result["predicted_group"]

    db.commit()
    db.refresh(emp)

    # MongoDB Atlas Sync
    mongo_payload = {
        "employee_id": emp.employee_id,
        "name": emp.name,
        "age": emp.age,
        "gender": emp.gender,
        "department": emp.department,
        "job_role": emp.job_role,
        "monthly_income": emp.monthly_income,
        "performance_group": emp.performance_group,
        "job_satisfaction": emp.job_satisfaction,
        "attendance_rate": emp.attendance_rate,
        "training_hours": emp.training_hours,
        "projects_completed": emp.projects_completed,
        "years_at_company": emp.years_at_company
    }
    sync_employee_to_mongo(mongo_payload)

    return emp

def delete_employee(db: Session, employee_id: str) -> bool:
    emp = get_employee_by_id(db, employee_id)
    if not emp:
        return False
    emp_code = emp.employee_id
    db.delete(emp)
    db.commit()
    delete_employee_from_mongo(emp_code)
    return True

def clear_all_employees(db: Session) -> int:
    count = db.query(models.Employee).count()
    db.query(models.Employee).delete()
    db.query(models.Prediction).delete()
    db.commit()
    clear_all_mongo_employees()
    return count
