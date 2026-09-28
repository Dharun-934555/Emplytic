from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "HR Manager"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Employee Schemas ---
class EmployeeBase(BaseModel):
    name: str
    age: int = Field(..., ge=18, le=75)
    gender: Optional[str] = "Female"
    department: str
    job_role: str
    years_at_company: int = Field(..., ge=0)
    years_in_current_role: int = Field(..., ge=0)
    monthly_income: float = Field(..., ge=0)
    job_level: int = Field(1, ge=1, le=5)
    job_satisfaction: int = Field(3, ge=1, le=5)
    environment_satisfaction: int = Field(3, ge=1, le=5)
    work_life_balance: int = Field(3, ge=1, le=4)
    training_hours: int = Field(0, ge=0)
    projects_completed: int = Field(0, ge=0)
    attendance_rate: float = Field(95.0, ge=0.0, le=100.0)
    overtime_hours: int = Field(0, ge=0)
    previous_experience: int = Field(0, ge=0)
    promotion_last_5_years: int = Field(0, ge=0, le=1)
    employee_engagement: float = Field(7.0, ge=1.0, le=10.0)
    absenteeism: int = Field(0, ge=0)

class EmployeeCreate(EmployeeBase):
    employee_id: Optional[str] = None
    performance_group: Optional[str] = None

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    department: Optional[str] = None
    job_role: Optional[str] = None
    years_at_company: Optional[int] = None
    years_in_current_role: Optional[int] = None
    monthly_income: Optional[float] = None
    job_level: Optional[int] = None
    job_satisfaction: Optional[int] = None
    environment_satisfaction: Optional[int] = None
    work_life_balance: Optional[int] = None
    training_hours: Optional[int] = None
    projects_completed: Optional[int] = None
    attendance_rate: Optional[float] = None
    overtime_hours: Optional[int] = None
    previous_experience: Optional[int] = None
    promotion_last_5_years: Optional[int] = None
    employee_engagement: Optional[float] = None
    absenteeism: Optional[int] = None
    performance_group: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: int
    employee_id: str
    performance_group: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- ML Predict Schemas ---
class PredictInput(BaseModel):
    age: int = 32
    department: str = "Engineering"
    job_role: str = "Software Engineer"
    years_at_company: int = 4
    years_in_current_role: int = 2
    monthly_income: float = 8500.0
    job_level: int = 2
    job_satisfaction: int = 4
    environment_satisfaction: int = 4
    work_life_balance: int = 3
    training_hours: int = 45
    projects_completed: int = 12
    attendance_rate: float = 96.5
    overtime_hours: int = 8
    previous_experience: int = 3
    promotion_last_5_years: int = 0
    employee_engagement: float = 8.2
    absenteeism: int = 2
    gender: Optional[str] = "Female"
    employee_id: Optional[str] = None

class PredictOutput(BaseModel):
    predicted_group: str
    confidence: float
    high_probability: float
    medium_probability: float
    low_probability: float
    top_factors: List[Dict[str, Any]] = []

# --- Model Info & Metrics Schemas ---
class ModelMetricDetail(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: Optional[List[List[int]]] = None
    classification_report: Optional[Dict[str, Any]] = None
    feature_importance: Optional[List[Dict[str, Any]]] = None
    is_active: bool = False

class ModelInfoResponse(BaseModel):
    dataset_size: int
    training_samples: int
    testing_samples: int
    features_count: int
    best_model: str
    models: List[ModelMetricDetail]
    feature_importances: List[Dict[str, Any]]
    active_model: str

class DatasetPreview(BaseModel):
    total_rows: int
    total_columns: int
    missing_values: int
    duplicate_records: int
    numerical_columns: List[str]
    categorical_columns: List[str]
    preview_data: List[Dict[str, Any]]
