from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import List, Optional, Dict, Any
import models
import schemas
from ml_model import predict_single_employee

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
    return db_employee

def update_employee(db: Session, employee_id: str, emp_data: schemas.EmployeeUpdate) -> Optional[models.Employee]:
    emp = get_employee_by_id(db, employee_id)
    if not emp:
        return None

    update_dict = emp_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)
    return emp

def delete_employee(db: Session, employee_id: str) -> bool:
    emp = get_employee_by_id(db, employee_id)
    if not emp:
        return False
    db.delete(emp)
    db.commit()
    return True
