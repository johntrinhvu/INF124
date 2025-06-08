from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from models.user import UserCreate, UserResponse, UserProfileResponse
from database import get_database
import logging
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

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

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

# Helper function to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    db = await get_database()
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

class LoginRequest(BaseModel):
    email: str
    password: str

class UserProfileResponse(BaseModel):
    username: str
    email: str
    role: str = "Student"  # Default role
    joined_date: datetime
    about: str = ""  # Default empty bio
    followers: list
    following: list
    followers_count: int
    following_count: int

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
        user_dict["created_at"] = datetime.utcnow()
        user_dict["role"] = "Student"  # Default role
        user_dict["about"] = ""  # Default empty bio
        user_dict["followers"] = []  # Initialize empty followers list
        user_dict["following"] = []  # Initialize empty following list
        user_dict["followers_count"] = 0
        user_dict["following_count"] = 0
        
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

@router.get("/username/{username}", response_model=UserProfileResponse)
async def get_user_by_username(username: str):
    try:
        db = await get_database()
        user = await db.users.find_one({"username": username})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Return user data without sensitive information
        return UserProfileResponse(
            username=user["username"],
            email=user["email"],
            role=user.get("role", "Student"),  # Default to Student if role not set
            joined_date=user.get("created_at", datetime.utcnow()),  # Default to current time if not set
            about=user.get("about", ""),  # Default to empty string if about not set
            followers=user.get("followers", []),
            following=user.get("following", []),
            followers_count=len(user.get("followers", [])),
            following_count=len(user.get("following", []))
        )
    except Exception as e:
        logger.error(f"Error fetching user by username: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/username/{username}")
async def update_user(username: str, user_data: dict, current_user: dict = Depends(get_current_user)):
    try:
        db = await get_database()
        user = await db.users.find_one({"username": username})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Ensure only the user can update their own profile
        if user["username"] != current_user["username"]:
            raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
        # Update user data while preserving followers/following
        update_data = {
            "username": user_data.get("username", user["username"]),
            "email": user_data.get("email", user["email"]),
            "about": user_data.get("about", user.get("about", "")),
            "followers": user.get("followers", []),
            "following": user.get("following", []),
            "followers_count": len(user.get("followers", [])),
            "following_count": len(user.get("following", []))
        }
        
        # Update in database
        result = await db.users.update_one(
            {"username": username},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="No changes made")
        
        # Return updated user data
        updated_user = await db.users.find_one({"username": update_data["username"]})
        return UserProfileResponse(
            username=updated_user["username"],
            email=updated_user["email"],
            role=updated_user.get("role", "Student"),
            joined_date=updated_user.get("created_at", datetime.utcnow()),
            about=updated_user.get("about", ""),
            followers=updated_user.get("followers", []),
            following=updated_user.get("following", []),
            followers_count=len(updated_user.get("followers", [])),
            following_count=len(updated_user.get("following", []))
        )
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/username/{username}/follow")
async def follow_user(username: str, current_user: dict = Depends(get_current_user)):
    try:
        db = await get_database()
        
        # Check if user exists
        user_to_follow = await db.users.find_one({"username": username})
        if not user_to_follow:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if trying to follow self
        if username == current_user["username"]:
            raise HTTPException(status_code=400, detail="Cannot follow yourself")
        
        # Check if already following
        if username in current_user.get("following", []):
            raise HTTPException(status_code=400, detail="Already following this user")
        
        # Update both users
        await db.users.update_one(
            {"username": username},
            {"$push": {"followers": current_user["username"]}}
        )
        
        await db.users.update_one(
            {"username": current_user["username"]},
            {"$push": {"following": username}}
        )
        
        return {"message": f"Successfully followed {username}"}
    except Exception as e:
        logger.error(f"Error following user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/username/{username}/unfollow")
async def unfollow_user(username: str, current_user: dict = Depends(get_current_user)):
    try:
        db = await get_database()
        
        # Check if user exists
        user_to_unfollow = await db.users.find_one({"username": username})
        if not user_to_unfollow:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if actually following
        if username not in current_user.get("following", []):
            raise HTTPException(status_code=400, detail="Not following this user")
        
        # Update both users
        await db.users.update_one(
            {"username": username},
            {"$pull": {"followers": current_user["username"]}}
        )
        
        await db.users.update_one(
            {"username": current_user["username"]},
            {"$pull": {"following": username}}
        )
        
        return {"message": f"Successfully unfollowed {username}"}
    except Exception as e:
        logger.error(f"Error unfollowing user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 