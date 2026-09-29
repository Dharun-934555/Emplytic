from fastapi import APIRouter, Depends, Query, HTTPException, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
import io
import pandas as pd
from database import get_db
import models
from services import analytics_service

router = APIRouter(prefix="/api", tags=["Analytics & Reports"])

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_summary(db)

@router.get("/analytics")
def get_analytics_data(
    department: Optional[str] = Query("All"),
    job_role: Optional[str] = Query("All"),
    performance_group: Optional[str] = Query("All"),
    db: Session = Depends(get_db)
):
    return analytics_service.get_detailed_analytics(
        db, department=department, job_role=job_role, performance_group=performance_group
    )

@router.get("/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    return analytics_service.get_insights(db)

@router.post("/reports/generate")
def generate_custom_report(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    report_title = payload.get("title", "Custom_HR_Report")
    dept = payload.get("department", "All")
    group = payload.get("performance_group", "All")
    included_metrics = payload.get("metrics", ["employee_id", "name", "department", "job_role", "performance_group", "monthly_income", "attendance_rate", "job_satisfaction"])

    query = db.query(models.Employee)

    if dept and dept != "All":
        query = query.filter(models.Employee.department == dept)
    if group and group != "All":
        query = query.filter(models.Employee.performance_group == group)

    employees = query.all()

    data = []
    for e in employees:
        row = {}
        if "employee_id" in included_metrics: row["Employee ID"] = e.employee_id
        if "name" in included_metrics: row["Name"] = e.name
        if "department" in included_metrics: row["Department"] = e.department
        if "job_role" in included_metrics: row["Job Role"] = e.job_role
        if "performance_group" in included_metrics: row["Performance Group"] = e.performance_group
        if "monthly_income" in included_metrics: row["Monthly Income ($)"] = e.monthly_income
        if "attendance_rate" in included_metrics: row["Attendance Rate (%)"] = e.attendance_rate
        if "job_satisfaction" in included_metrics: row["Job Satisfaction"] = e.job_satisfaction
        if "training_hours" in included_metrics: row["Training Hours"] = e.training_hours
        if "projects_completed" in included_metrics: row["Projects Completed"] = e.projects_completed
        if "employee_engagement" in included_metrics: row["Engagement Score"] = e.employee_engagement
        data.append(row)

    df = pd.DataFrame(data if data else [{"Message": "No employee records matched selected criteria."}])

    # Add notification for generated HR report
    notif = models.Notification(
        title="Custom HR Report Generated",
        message=f"Report '{report_title}' exported for {dept} ({group}) with {len(employees)} records."
    )
    db.add(notif)
    db.commit()

    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    clean_filename = f"{report_title.replace(' ', '_')}.csv"
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={clean_filename}"
    return response

@router.get("/reports/download/{report_type}")
def download_csv_report(report_type: str, db: Session = Depends(get_db)):
    stream = io.StringIO()
    filename = f"{report_type}_report.csv"

    if report_type == "employees":
        employees = db.query(models.Employee).all()
        data = [{
            "Employee ID": e.employee_id,
            "Name": e.name,
            "Department": e.department,
            "Job Role": e.job_role,
            "Years at Company": e.years_at_company,
            "Monthly Income": e.monthly_income,
            "Job Satisfaction": e.job_satisfaction,
            "Attendance Rate (%)": e.attendance_rate,
            "Performance Group": e.performance_group
        } for e in employees]
        df = pd.DataFrame(data)

    elif report_type == "summary":
        summary = analytics_service.get_dashboard_summary(db)
        data = [
            {"Metric": "Total Employees", "Value": summary["total_employees"]},
            {"Metric": "High Performers", "Value": summary["high_performers"]},
            {"Metric": "Medium Performers", "Value": summary["medium_performers"]},
            {"Metric": "Low Performers", "Value": summary["low_performers"]},
            {"Metric": "High Performer %", "Value": f"{summary['high_percentage']}%"},
            {"Metric": "Medium Performer %", "Value": f"{summary['medium_percentage']}%"},
            {"Metric": "Low Performer %", "Value": f"{summary['low_percentage']}%"}
        ]
        df = pd.DataFrame(data)

    elif report_type == "predictions":
        predictions = db.query(models.Prediction).all()
        data = [{
            "ID": p.id,
            "Employee ID": p.employee_id or "N/A",
            "Predicted Group": p.predicted_group,
            "High Probability (%)": p.high_probability,
            "Medium Probability (%)": p.medium_probability,
            "Low Probability (%)": p.low_probability,
            "Prediction Date": p.created_at
        } for p in predictions]
        df = pd.DataFrame(data)

    elif report_type == "model-evaluation":
        metrics = db.query(models.ModelMetrics).all()
        data = [{
            "Model Name": m.model_name,
            "Accuracy": f"{m.accuracy*100:.2f}%",
            "Precision": f"{m.precision*100:.2f}%",
            "Recall": f"{m.recall*100:.2f}%",
            "F1 Score": f"{m.f1_score*100:.2f}%",
            "Evaluated Date": m.created_at
        } for m in metrics]
        df = pd.DataFrame(data)

    else:
        raise HTTPException(status_code=400, detail="Invalid report type requested.")

    df.to_csv(stream, index=False)
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response

@router.post("/settings/mongodb")
def update_mongodb_setting(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    mongo_url = payload.get("mongodb_url", "").strip()
    password = payload.get("password", "").strip()
    
    if password and "<db_password>" in mongo_url:
        mongo_url = mongo_url.replace("<db_password>", password)

    if not mongo_url:
        mongo_url = os.getenv("MONGODB_URL", "")

    if password and "<db_password>" in mongo_url:
        mongo_url = mongo_url.replace("<db_password>", password)

    if not mongo_url or "<db_password>" in mongo_url:
        raise HTTPException(status_code=400, detail="Please enter your MongoDB Atlas database password.")

    # 1. Update .env file
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            lines = f.readlines()
        new_lines = []
        found = False
        for line in lines:
            if line.startswith("MONGODB_URL="):
                new_lines.append(f"MONGODB_URL={mongo_url}\n")
                found = True
            else:
                new_lines.append(line)
        if not found:
            new_lines.append(f"MONGODB_URL={mongo_url}\n")
        with open(env_path, "w") as f:
            f.writelines(new_lines)

    # 2. Update memory
    os.environ["MONGODB_URL"] = mongo_url
    import services.mongodb_service as m_service
    m_service.MONGODB_URL = mongo_url

    # 3. Test MongoDB Atlas Connection
    mongo_db = m_service.get_mongo_db()
    if mongo_db is None:
        raise HTTPException(
            status_code=400,
            detail="Could not connect to MongoDB Atlas. Please check password and Network Access (IP Whitelist) in MongoDB Atlas."
        )

    # 4. Sync all current database records to MongoDB Atlas
    employees = db.query(models.Employee).all()
    synced_count = 0
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
        m_service.sync_employee_to_mongo(mongo_payload)
        synced_count += 1

    return {
        "status": "connected",
        "message": f"Successfully connected to MongoDB Atlas! Synced {synced_count} employee records (including Kavinila S) to collection 'emplytic.employees'.",
        "synced_records": synced_count
    }

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "EMPlytic AI Backend"}
