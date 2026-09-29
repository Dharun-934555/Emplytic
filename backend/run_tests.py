import os
from dotenv import load_dotenv
load_dotenv()
from fastapi.testclient import TestClient
from main import app
import time

client = TestClient(app)

def run_tests():
    print("Testing MongoDB Connection...")
    from database import db
    try:
        # Check connection
        db.command("ping")
        print("MongoDB ping successful!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return

    # Clear users for clean test
    db.users.delete_many({"email": "test@emplytic.ai"})

    print("Testing POST /api/auth/register...")
    res = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test@emplytic.ai",
        "password": "securepassword123",
        "role": "HR Manager"
    })
    print(f"Register status: {res.status_code}")
    print(f"Register response: {res.json()}")

    print("Testing POST /api/auth/login...")
    res2 = client.post("/api/auth/login", json={
        "email": "test@emplytic.ai",
        "password": "securepassword123"
    })
    print(f"Login status: {res2.status_code}")
    print(f"Login response: {res2.json()}")
    if res2.status_code == 200:
        print("Login Successful! JWT Token received.")
        
    print("Verifying user in MongoDB...")
    user = db.users.find_one({"email": "test@emplytic.ai"})
    if user:
        print(f"User found in DB: {user['name']} with role {user['role']}")
    else:
        print("User NOT found in DB!")

if __name__ == "__main__":
    run_tests()
