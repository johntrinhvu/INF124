from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from models.user import UserCreate, UserResponse
from database import get_database
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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