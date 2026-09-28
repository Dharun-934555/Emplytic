from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="HR Manager")  # "Admin" or "HR Manager"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(50), nullable=False, default="Female")
    department = Column(String(100), nullable=False, index=True)
    job_role = Column(String(100), nullable=False, index=True)
    years_at_company = Column(Integer, nullable=False)
    years_in_current_role = Column(Integer, nullable=False)
    monthly_income = Column(Float, nullable=False)
    job_level = Column(Integer, nullable=False)
    job_satisfaction = Column(Integer, nullable=False)
    environment_satisfaction = Column(Integer, nullable=False)
    work_life_balance = Column(Integer, nullable=False)
    training_hours = Column(Integer, nullable=False)
    projects_completed = Column(Integer, nullable=False)
    attendance_rate = Column(Float, nullable=False)
    overtime_hours = Column(Integer, nullable=False)
    previous_experience = Column(Integer, nullable=False)
    promotion_last_5_years = Column(Integer, nullable=False)
    employee_engagement = Column(Float, nullable=False)
    absenteeism = Column(Integer, nullable=False)
    performance_group = Column(String(50), nullable=False, index=True) # High Performance, Medium Performance, Low Performance
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), nullable=True)
    predicted_group = Column(String(50), nullable=False)
    high_probability = Column(Float, nullable=False)
    medium_probability = Column(Float, nullable=False)
    low_probability = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")

class ModelMetrics(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
