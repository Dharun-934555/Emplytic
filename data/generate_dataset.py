import pandas as pd
import numpy as np
import random
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

n_samples = 650

first_names = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Avery",
               "Devon", "Dakota", "Reese", "Rowan", "Hayden", "Emerson", "Finley", "Harper", "Quinn", "Skyler",
               "Sarah", "Michael", "Emily", "David", "Jessica", "James", "Amanda", "Robert", "Jennifer", "John",
               "Sophia", "Daniel", "Olivia", "Matthew", "Ava", "Anthony", "Isabella", "Joseph", "Mia", "Andrew",
               "Ethan", "Charlotte", "Joshua", "Amelia", "Christopher", "Abigail", "Andrew", "Ella", "William", "Hanna"]

last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
              "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
              "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
              "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
              "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"]

departments_roles = {
    "Engineering": ["Software Engineer", "Senior Developer", "DevOps Engineer", "Data Engineer", "QA Engineer"],
    "HR": ["HR Specialist", "Talent Acquisition", "HR Manager", "People Ops Specialist"],
    "Finance": ["Financial Analyst", "Accountant", "Finance Manager", "Auditor"],
    "Marketing": ["Marketing Specialist", "Content Strategist", "SEO Manager", "Marketing Lead"],
    "Sales": ["Sales Executive", "Account Manager", "Sales Manager", "BDR"],
    "Operations": ["Operations Lead", "Supply Chain Analyst", "Operations Manager", "Logistics Coordinator"]
}

data = []

for i in range(1, n_samples + 1):
    emp_id = f"EMP-{1000 + i}"
    name = f"{random.choice(first_names)} {random.choice(last_names)}"
    dept = random.choice(list(departments_roles.keys()))
    role = random.choice(departments_roles[dept])
    gender = random.choice(["Male", "Female", "Non-Binary"])
    
    age = random.randint(22, 58)
    prev_exp = random.randint(0, min(15, age - 22))
    years_at_co = random.randint(1, min(18, age - 21))
    years_curr_role = random.randint(1, min(years_at_co, 8))
    
    job_level = min(5, max(1, int(1 + (years_at_co + prev_exp) / 4)))
    monthly_income = int(3500 + job_level * 2200 + random.randint(-800, 1200))
    
    # Latent performance score calculation (to derive natural performance groups)
    job_satisfaction = random.randint(1, 5)
    env_satisfaction = random.randint(1, 5)
    work_life_balance = random.randint(1, 4)
    training_hours = random.randint(8, 120)
    projects_completed = random.randint(2, 22)
    attendance_rate = round(random.uniform(82.0, 99.8), 1)
    overtime_hours = random.randint(0, 45)
    promotion_last_5 = 1 if (random.random() < 0.25 and years_at_co >= 3) else 0
    engagement = round(random.uniform(1.5, 9.8), 1)
    absenteeism = int(max(0, round((100 - attendance_rate) * 0.4 + random.randint(-2, 3))))
    
    # Calculate score based on key drivers
    perf_score = (
        (engagement * 4.5) +
        (attendance_rate * 0.45) +
        (job_satisfaction * 4.0) +
        (projects_completed * 1.8) +
        (training_hours * 0.25) +
        (promotion_last_5 * 6.0) +
        (work_life_balance * 2.5) -
        (absenteeism * 2.2) -
        (overtime_hours * 0.15 if overtime_hours > 30 else 0) +
        np.random.normal(0, 4.0)
    )
    
    if perf_score >= 102.0:
        perf_group = "High Performance"
    elif perf_score >= 82.0:
        perf_group = "Medium Performance"
    else:
        perf_group = "Low Performance"
        
    data.append({
        "employee_id": emp_id,
        "name": name,
        "age": age,
        "gender": gender,
        "department": dept,
        "job_role": role,
        "years_at_company": years_at_co,
        "years_in_current_role": years_curr_role,
        "monthly_income": monthly_income,
        "job_level": job_level,
        "job_satisfaction": job_satisfaction,
        "environment_satisfaction": env_satisfaction,
        "work_life_balance": work_life_balance,
        "training_hours": training_hours,
        "projects_completed": projects_completed,
        "attendance_rate": attendance_rate,
        "overtime_hours": overtime_hours,
        "previous_experience": prev_exp,
        "promotion_last_5_years": promotion_last_5,
        "employee_engagement": engagement,
        "absenteeism": absenteeism,
        "performance_group": perf_group
    })

df = pd.DataFrame(data)
os.makedirs("data", exist_ok=True)
df.to_csv("data/employee_performance.csv", index=False)

print(f"Generated {len(df)} employee records in data/employee_performance.csv")
print("Performance distribution:")
print(df["performance_group"].value_counts())
