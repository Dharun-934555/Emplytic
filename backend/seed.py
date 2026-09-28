import os
import pandas as pd
from database import engine, Base, SessionLocal
import models
import auth
from ml_model import train_and_evaluate_all_models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Users if not present
    if db.query(models.User).count() == 0:
        admin_user = models.User(
            name="Admin Director",
            email="admin@emplytic.ai",
            password_hash=auth.hash_password("admin123"),
            role="Admin"
        )
        hr_user = models.User(
            name="Sarah Jenkins",
            email="hr@emplytic.ai",
            password_hash=auth.hash_password("hr123"),
            role="HR Manager"
        )
        db.add(admin_user)
        db.add(hr_user)
        db.commit()
        print("Seeded default Admin & HR Manager users.")

    # 2. Seed Employees if not present
    if db.query(models.Employee).count() == 0:
        csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "employee_performance.csv"))
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            employee_records = []
            for _, row in df.iterrows():
                emp = models.Employee(
                    employee_id=str(row["employee_id"]),
                    name=str(row["name"]),
                    age=int(row["age"]),
                    gender=str(row["gender"]),
                    department=str(row["department"]),
                    job_role=str(row["job_role"]),
                    years_at_company=int(row["years_at_company"]),
                    years_in_current_role=int(row["years_in_current_role"]),
                    monthly_income=float(row["monthly_income"]),
                    job_level=int(row["job_level"]),
                    job_satisfaction=int(row["job_satisfaction"]),
                    environment_satisfaction=int(row["environment_satisfaction"]),
                    work_life_balance=int(row["work_life_balance"]),
                    training_hours=int(row["training_hours"]),
                    projects_completed=int(row["projects_completed"]),
                    attendance_rate=float(row["attendance_rate"]),
                    overtime_hours=int(row["overtime_hours"]),
                    previous_experience=int(row["previous_experience"]),
                    promotion_last_5_years=int(row["promotion_last_5_years"]),
                    employee_engagement=float(row["employee_engagement"]),
                    absenteeism=int(row["absenteeism"]),
                    performance_group=str(row["performance_group"])
                )
                employee_records.append(emp)
            db.bulk_save_objects(employee_records)
            db.commit()
            print(f"Seeded {len(employee_records)} employee records.")

    # 3. Seed Notifications if empty
    if db.query(models.Notification).count() == 0:
        n1 = models.Notification(
            title="System Initialization",
            message="EMPlytic AI Engine initialized with PostgreSQL workforce database.",
            is_read=False
        )
        n2 = models.Notification(
            title="ML Model Trained",
            message="Random Forest classifier selected as active champion model (92.3% test accuracy).",
            is_read=False
        )
        n3 = models.Notification(
            title="Low Performance Alert",
            message="10 low-performing employee records flagged for targeted skill training.",
            is_read=False
        )
        db.add_all([n1, n2, n3])
        db.commit()
        print("Seeded initial system notifications.")

    # 4. Ensure ML models are trained
    trained_model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "models", "trained_model.joblib"))
    if not os.path.exists(trained_model_path):
        train_and_evaluate_all_models()

    db.close()

if __name__ == "__main__":
    seed_database()
