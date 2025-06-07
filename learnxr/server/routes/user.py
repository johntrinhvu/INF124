from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from models.user import UserCreate, UserResponse
from database import get_database
import logging
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")  # Fallback for development
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    try:
        db = await get_database()
        
        # Check if user already exists
        if await db.users.find_one({"email": user.email}):
            logger.warning(f"Attempt to create user with existing email: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        if await db.users.find_one({"username": user.username}):
            logger.warning(f"Attempt to create user with existing username: {user.username}")
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Hash the password
        hashed_password = pwd_context.hash(user.password)
        
        # Create user document
        user_dict = user.dict()
        user_dict["password"] = hashed_password
        
        # Insert user into database
        result = await db.users.insert_one(user_dict)
        logger.info(f"Successfully created user: {user.username}")
        
        # Return user without password
        return UserResponse(username=user.username, email=user.email)
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(login_data: LoginRequest):
    try:
        db = await get_database()
        user = await db.users.find_one({"email": login_data.email})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not pwd_context.verify(login_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "username": user["username"],
                "email": user["email"]
            }
        }
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 