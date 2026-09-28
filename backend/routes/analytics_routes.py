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

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "EMPlytic AI Backend"}
