import os
import pymongo
from dotenv import load_dotenv

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(env_path)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://dharunyasridharunyasri2007_db_user:<db_password>@cluster0.oe1x7m6.mongodb.net/?appName=Cluster0")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "emplytic")

client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
db = client[MONGODB_DATABASE]

def get_db():
    yield db
