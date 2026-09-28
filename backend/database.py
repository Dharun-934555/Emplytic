import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ensure absolute DB path for SQLite so root and backend scripts connect to the SAME file
ABS_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "emplytic.db"))
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{ABS_DB_PATH}")

# Optional MongoDB Atlas configuration
MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb+srv://dharunyasridharunyasri2007_db_user:<db_password>@cluster0.oe1x7m6.mongodb.net/?appName=Cluster0"
)

# SQLAlchemy Engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# PyMongo connection helper
def get_mongo_client():
    try:
        import pymongo
        if "<db_password>" not in MONGODB_URL:
            client = pymongo.MongoClient(MONGODB_URL, serverSelectionTimeoutMS=3000)
            return client
    except Exception as e:
        print(f"MongoDB connection skipped: {e}")
    return None
