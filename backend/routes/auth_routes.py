from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
import schemas
import auth
from datetime import datetime, timezone

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register")
def register(user_data: schemas.UserRegister, db = Depends(get_db)):
    # Check if email already exists
    existing = db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Securely hash password using PBKDF2 SHA-256
    hashed_pw = auth.hash_password(user_data.password)
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hashed_pw,
        "role": user_data.role or "HR Manager",
        "created_at": datetime.now(timezone.utc)
    }
    
    db.users.insert_one(new_user)

    return {"message": "Account created successfully"}

@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db = Depends(get_db)):
    user = db.users.find_one({"email": login_data.email})
    if not user or not auth.verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Format for response
    user["id"] = str(user.pop("_id"))

    access_token = auth.create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user = Depends(auth.get_current_user)):
    return current_user
