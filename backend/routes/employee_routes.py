from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
from services import employee_service
import auth

router = APIRouter(prefix="/api/employees", tags=["Employees"])

@router.get("", response_model=List[schemas.EmployeeOut])
def list_employees(
    skip: int = 0,
    limit: int = 300,
    search: Optional[str] = None,
    department: Optional[str] = None,
    performance_group: Optional[str] = None,
    job_role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return employee_service.get_employees(
        db, skip=skip, limit=limit, search=search,
        department=department, performance_group=performance_group, job_role=job_role
    )

@router.get("/{employee_id}", response_model=schemas.EmployeeOut)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = employee_service.get_employee_by_id(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.post("", response_model=schemas.EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    emp_data: schemas.EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return employee_service.create_employee(db, emp_data)

@router.put("/{employee_id}", response_model=schemas.EmployeeOut)
def update_employee(
    employee_id: str,
    emp_data: schemas.EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    emp = employee_service.update_employee(db, employee_id, emp_data)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.delete("/{employee_id}", status_code=status.HTTP_200_OK)
def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    success = employee_service.delete_employee(db, employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": f"Employee {employee_id} deleted successfully"}
