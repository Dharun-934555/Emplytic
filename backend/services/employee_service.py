from typing import List, Optional, Dict, Any
import schemas
from ml_model import predict_single_employee
from datetime import datetime, timezone

def get_employees(
    db,
    skip: int = 0,
    limit: int = 500,
    search: Optional[str] = None,
    department: Optional[str] = None,
    performance_group: Optional[str] = None,
    job_role: Optional[str] = None
) -> List[dict]:
    query = {}
    
    if search:
        search_fmt = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"name": search_fmt},
            {"employee_id": search_fmt},
            {"job_role": search_fmt},
            {"department": search_fmt}
        ]
        
    if department and department != "All":
        query["department"] = department
    if performance_group and performance_group != "All":
        query["performance_group"] = performance_group
    if job_role and job_role != "All":
        query["job_role"] = job_role

    cursor = db.employees.find(query).sort("_id", 1).skip(skip).limit(limit)
    employees = []
    for emp in cursor:
        emp["id"] = str(emp.pop("_id"))
        employees.append(emp)
    return employees

def get_employee_by_id(db, employee_id: str) -> Optional[dict]:
    emp = db.employees.find_one({"employee_id": employee_id})
    if emp:
        emp["id"] = str(emp.pop("_id"))
    return emp

def create_employee(db, emp_data: schemas.EmployeeCreate, user_id: Optional[str] = None) -> dict:
    if not emp_data.employee_id or not str(emp_data.employee_id).strip():
        max_id = db.employees.count_documents({})
        candidate_id = f"EMP-{1000 + max_id + 1}"
        while db.employees.find_one({"employee_id": candidate_id}):
            max_id += 1
            candidate_id = f"EMP-{1000 + max_id + 1}"
        emp_data.employee_id = candidate_id
    else:
        emp_data.employee_id = str(emp_data.employee_id).strip()

    input_dict = emp_data.model_dump()
    
    if not input_dict.get("performance_group"):
        prediction_result = predict_single_employee(input_dict)
        input_dict["performance_group"] = prediction_result["predicted_group"]

    input_dict["created_at"] = datetime.now(timezone.utc)
    
    result = db.employees.insert_one(input_dict.copy())
    input_dict["id"] = str(result.inserted_id)

    notification = {
        "user_id": user_id,
        "title": "New Employee Added",
        "message": f"{input_dict['name']} ({input_dict['employee_id']}) was added to {input_dict['department']} as {input_dict['performance_group']}.",
        "is_read": False,
        "created_at": datetime.now(timezone.utc)
    }
    db.notifications.insert_one(notification)

    if input_dict["performance_group"] == "Low Performance":
        alert_notif = {
            "user_id": user_id,
            "title": "Low Performance Employee Detected",
            "message": f"Attention: {input_dict['name']} in {input_dict['department']} was classified in the Low Performance tier.",
            "is_read": False,
            "created_at": datetime.now(timezone.utc)
        }
        db.notifications.insert_one(alert_notif)

    return input_dict

def update_employee(db, employee_id: str, emp_data: schemas.EmployeeUpdate) -> Optional[dict]:
    emp = get_employee_by_id(db, employee_id)
    if not emp:
        return None

    update_dict = emp_data.model_dump(exclude_unset=True)
    
    if "performance_group" not in update_dict:
        full_dict = emp.copy()
        full_dict.update(update_dict)
        prediction_result = predict_single_employee(full_dict)
        update_dict["performance_group"] = prediction_result["predicted_group"]

    db.employees.update_one({"employee_id": employee_id}, {"$set": update_dict})
    
    updated_emp = get_employee_by_id(db, employee_id)
    return updated_emp

def delete_employee(db, employee_id: str) -> bool:
    result = db.employees.delete_one({"employee_id": employee_id})
    return result.deleted_count > 0

def clear_all_employees(db) -> int:
    count = db.employees.count_documents({})
    db.employees.delete_many({})
    db.predictions.delete_many({})
    return count
