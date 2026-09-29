from fastapi import APIRouter, Depends, Query, HTTPException, Body
from fastapi.responses import StreamingResponse
from typing import Optional, List, Dict, Any
from types import SimpleNamespace
import io
import os
import pandas as pd
from datetime import datetime, timezone
from database import get_db
from services import analytics_service

router = APIRouter(prefix="/api", tags=["Analytics & Reports"])

@router.get("/dashboard")
def get_dashboard_data(db = Depends(get_db)):
    return analytics_service.get_dashboard_summary(db)

@router.get("/analytics")
def get_analytics_data(
    department: Optional[str] = Query("All"),
    job_role: Optional[str] = Query("All"),
    performance_group: Optional[str] = Query("All"),
    db = Depends(get_db)
):
    return analytics_service.get_detailed_analytics(
        db, department=department, job_role=job_role, performance_group=performance_group
    )

@router.get("/insights")
def get_ai_insights(db = Depends(get_db)):
    return analytics_service.get_insights(db)

@router.post("/reports/generate")
def generate_custom_report(payload: Dict[str, Any] = Body(...), db = Depends(get_db)):
    report_title = payload.get("title", "Custom_HR_Report")
    dept = payload.get("department", "All")
    group = payload.get("performance_group", "All")
    included_metrics = payload.get("metrics", ["employee_id", "name", "department", "job_role", "performance_group", "monthly_income", "attendance_rate", "job_satisfaction"])

    query = {}
    if dept and dept != "All":
        query["department"] = dept
    if group and group != "All":
        query["performance_group"] = group

    employees = [SimpleNamespace(**e) for e in db.employees.find(query)]

    data = []
    for e in employees:
        row = {}
        if "employee_id" in included_metrics: row["Employee ID"] = getattr(e, "employee_id", "N/A")
        if "name" in included_metrics: row["Name"] = getattr(e, "name", "N/A")
        if "department" in included_metrics: row["Department"] = getattr(e, "department", "N/A")
        if "job_role" in included_metrics: row["Job Role"] = getattr(e, "job_role", "N/A")
        if "performance_group" in included_metrics: row["Performance Group"] = getattr(e, "performance_group", "N/A")
        if "monthly_income" in included_metrics: row["Monthly Income ($)"] = getattr(e, "monthly_income", "N/A")
        if "attendance_rate" in included_metrics: row["Attendance Rate (%)"] = getattr(e, "attendance_rate", "N/A")
        if "job_satisfaction" in included_metrics: row["Job Satisfaction"] = getattr(e, "job_satisfaction", "N/A")
        if "training_hours" in included_metrics: row["Training Hours"] = getattr(e, "training_hours", "N/A")
        if "projects_completed" in included_metrics: row["Projects Completed"] = getattr(e, "projects_completed", "N/A")
        if "employee_engagement" in included_metrics: row["Engagement Score"] = getattr(e, "employee_engagement", "N/A")
        data.append(row)

    df = pd.DataFrame(data if data else [{"Message": "No employee records matched selected criteria."}])

    # Add notification for generated HR report
    notif = {
        "user_id": None,
        "title": "Custom HR Report Generated",
        "message": f"Report '{report_title}' exported for {dept} ({group}) with {len(employees)} records.",
        "is_read": False,
        "created_at": datetime.now(timezone.utc)
    }
    db.notifications.insert_one(notif)

    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    clean_filename = f"{report_title.replace(' ', '_')}.csv"
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={clean_filename}"
    return response

@router.get("/reports/download/{report_type}")
def download_csv_report(report_type: str, db = Depends(get_db)):
    stream = io.StringIO()
    filename = f"{report_type}_report.csv"

    if report_type == "employees":
        employees = [SimpleNamespace(**e) for e in db.employees.find({})]
        data = [{
            "Employee ID": getattr(e, "employee_id", "N/A"),
            "Name": getattr(e, "name", "N/A"),
            "Department": getattr(e, "department", "N/A"),
            "Job Role": getattr(e, "job_role", "N/A"),
            "Years at Company": getattr(e, "years_at_company", 0),
            "Monthly Income": getattr(e, "monthly_income", 0),
            "Job Satisfaction": getattr(e, "job_satisfaction", 0),
            "Attendance Rate (%)": getattr(e, "attendance_rate", 0),
            "Performance Group": getattr(e, "performance_group", "N/A")
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
        predictions = [SimpleNamespace(**p) for p in db.predictions.find({})]
        data = [{
            "ID": str(getattr(p, "_id", "N/A")),
            "Employee ID": getattr(p, "employee_id", "N/A"),
            "Predicted Group": getattr(p, "predicted_group", "N/A"),
            "High Probability (%)": getattr(p, "high_probability", 0),
            "Medium Probability (%)": getattr(p, "medium_probability", 0),
            "Low Probability (%)": getattr(p, "low_probability", 0),
            "Prediction Date": getattr(p, "created_at", "N/A")
        } for p in predictions]
        df = pd.DataFrame(data)

    elif report_type == "model-evaluation":
        metrics = [SimpleNamespace(**m) for m in db.model_metrics.find({})]
        data = [{
            "Model Name": getattr(m, "model_name", "N/A"),
            "Accuracy": f"{getattr(m, 'accuracy', 0)*100:.2f}%",
            "Precision": f"{getattr(m, 'precision', 0)*100:.2f}%",
            "Recall": f"{getattr(m, 'recall', 0)*100:.2f}%",
            "F1 Score": f"{getattr(m, 'f1_score', 0)*100:.2f}%",
            "Evaluated Date": getattr(m, "created_at", "N/A")
        } for m in metrics]
        df = pd.DataFrame(data)

    else:
        raise HTTPException(status_code=400, detail="Invalid report type requested.")

    df.to_csv(stream, index=False)
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response

@router.post("/settings/mongodb")
def update_mongodb_setting(payload: Dict[str, Any] = Body(...), db = Depends(get_db)):
    mongo_url = payload.get("mongodb_url", "").strip()
    password = payload.get("password", "").strip()
    
    if password and "<db_password>" in mongo_url:
        mongo_url = mongo_url.replace("<db_password>", password)

    if not mongo_url:
        mongo_url = os.getenv("MONGODB_URI", "")

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
            if line.startswith("MONGODB_URI="):
                new_lines.append(f"MONGODB_URI={mongo_url}\n")
                found = True
            else:
                new_lines.append(line)
        if not found:
            new_lines.append(f"MONGODB_URI={mongo_url}\n")
        with open(env_path, "w") as f:
            f.writelines(new_lines)

    # 2. Update memory
    os.environ["MONGODB_URI"] = mongo_url

    return {
        "status": "connected",
        "message": "Successfully updated MongoDB Atlas Connection string.",
        "synced_records": 0
    }

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "EMPlytic AI Backend"}
