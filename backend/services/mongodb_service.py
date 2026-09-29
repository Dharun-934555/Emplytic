import os
from typing import Dict, Any, List, Optional
import pymongo

# MongoDB connection configuration
MONGODB_URL = os.getenv("MONGODB_URL", "")

def get_mongo_db():
    if not MONGODB_URL or "<db_password>" in MONGODB_URL:
        return None
    try:
        client = pymongo.MongoClient(MONGODB_URL, serverSelectionTimeoutMS=4000)
        # Verify connection
        client.admin.command('ping')
        return client["emplytic"]
    except Exception as e:
        print(f"MongoDB Atlas connection warning: {e}")
        return None

def sync_employee_to_mongo(emp_data: Dict[str, Any]):
    db = get_mongo_db()
    if db is None:
        return
    try:
        collection = db["employees"]
        collection.update_one(
            {"employee_id": emp_data["employee_id"]},
            {"$set": emp_data},
            upsert=True
        )
        print(f"Synced employee {emp_data.get('employee_id')} to MongoDB Atlas.")
    except Exception as e:
        print(f"Failed to sync employee to MongoDB: {e}")

def delete_employee_from_mongo(employee_id: str):
    db = get_mongo_db()
    if db is None:
        return
    try:
        collection = db["employees"]
        collection.delete_one({"employee_id": employee_id})
        print(f"Deleted employee {employee_id} from MongoDB Atlas.")
    except Exception as e:
        print(f"Failed to delete employee from MongoDB: {e}")

def clear_all_mongo_employees():
    db = get_mongo_db()
    if db is None:
        return
    try:
        collection = db["employees"]
        collection.delete_many({})
        print("Cleared all employees from MongoDB Atlas.")
    except Exception as e:
        print(f"Failed to clear MongoDB employees: {e}")
