import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
import models
from services.mongodb_service import sync_employee_to_mongo

def main():
    print("Starting sync from SQLite to MongoDB...")
    db = SessionLocal()
    try:
        employees = db.query(models.Employee).all()
        print(f"Found {len(employees)} employees in SQLite.")
        for emp in employees:
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
                "years_at_company": emp.years_at_company,
                "created_at": emp.created_at.isoformat() if emp.created_at else None
            }
            sync_employee_to_mongo(mongo_payload)
        print("Sync complete!")
    finally:
        db.close()

if __name__ == "__main__":
    main()
