from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import json
import os
import shutil
import pandas as pd
from typing import Dict, Any

from database import get_db
import models
import schemas
from ml_model import predict_single_employee, train_and_evaluate_all_models, METRICS_PATH, MODEL_PATH
import auth

router = APIRouter(prefix="/api", tags=["Machine Learning"])

@router.post("/predict", response_model=schemas.PredictOutput)
def predict_employee_performance(
    input_data: schemas.PredictInput,
    db: Session = Depends(get_db)
):
    try:
        data_dict = input_data.model_dump()
        emp_id = data_dict.pop("employee_id", None)
        
        result = predict_single_employee(data_dict)
        
        # Save prediction record in PostgreSQL predictions table
        prediction_record = models.Prediction(
            employee_id=emp_id,
            predicted_group=result["predicted_group"],
            high_probability=result["high_probability"],
            medium_probability=result["medium_probability"],
            low_probability=result["low_probability"]
        )
        db.add(prediction_record)
        
        # Add notification for performance analysis
        notif = models.Notification(
            title="Performance Analysis Completed",
            message=f"ML Prediction generated: Classified as {result['predicted_group']} ({result['confidence']}% confidence)."
        )
        db.add(notif)
        db.commit()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/model/train", response_model=schemas.ModelInfoResponse)
@router.post("/train", response_model=schemas.ModelInfoResponse)
def train_model(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "uploaded_dataset.csv"))
        if not os.path.exists(dataset_path):
            dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "employee_performance.csv"))

        payload = train_and_evaluate_all_models(csv_path=dataset_path)

        # Update ModelMetrics table in DB
        db.query(models.ModelMetrics).delete()
        for m in payload["models"]:
            metric_entry = models.ModelMetrics(
                model_name=m["model_name"],
                accuracy=m["accuracy"],
                precision=m["precision"],
                recall=m["recall"],
                f1_score=m["f1_score"]
            )
            db.add(metric_entry)

        # Create Notification
        notif = models.Notification(
            title="ML Model Training Completed",
            message=f"Model training pipeline completed. Champion Model: {payload['best_model']} with {payload['models'][0]['accuracy']*100:.2f}% accuracy."
        )
        db.add(notif)
        db.commit()

        return payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training error: {str(e)}")

@router.get("/model/info", response_model=schemas.ModelInfoResponse)
@router.get("/model/metrics")
@router.get("/model-info", response_model=schemas.ModelInfoResponse)
def get_model_info():
    if not os.path.exists(METRICS_PATH):
        payload = train_and_evaluate_all_models()
        return payload
    
    with open(METRICS_PATH, "r") as f:
        data = json.load(f)
    return data

@router.post("/model/dataset", response_model=schemas.DatasetPreview)
@router.post("/upload-dataset", response_model=schemas.DatasetPreview)
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
    os.makedirs(upload_dir, exist_ok=True)
    target_path = os.path.join(upload_dir, "uploaded_dataset.csv")

    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    df = pd.read_csv(target_path)
    total_rows, total_columns = df.shape
    missing_values = int(df.isnull().sum().sum())
    duplicate_records = int(df.duplicated().sum())

    num_cols = list(df.select_dtypes(include=['int64', 'float64']).columns)
    cat_cols = list(df.select_dtypes(include=['object', 'category']).columns)

    preview_records = df.head(10).fillna("").to_dict(orient="records")

    # Notification
    notif = models.Notification(
        title="Dataset Uploaded",
        message=f"New dataset file {file.filename} with {total_rows} rows uploaded successfully."
    )
    db.add(notif)
    db.commit()

    return {
        "total_rows": total_rows,
        "total_columns": total_columns,
        "missing_values": missing_values,
        "duplicate_records": duplicate_records,
        "numerical_columns": num_cols,
        "categorical_columns": cat_cols,
        "preview_data": preview_records
    }
