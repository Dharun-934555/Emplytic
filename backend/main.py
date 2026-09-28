import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routes import auth_routes, employee_routes, ml_routes, notification_routes, analytics_routes
from seed import seed_database

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EMPlytic API",
    description="AI-Powered Employee Performance Analytics FastAPI Backend",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_routes.router)
app.include_router(employee_routes.router)
app.include_router(ml_routes.router)
app.include_router(notification_routes.router)
app.include_router(analytics_routes.router)

@app.on_event("startup")
def startup_event():
    try:
        seed_database()
    except Exception as e:
        print(f"Startup warning during seeding: {e}")

@app.get("/")
def root():
    return {
        "message": "Welcome to EMPlytic AI Backend",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
