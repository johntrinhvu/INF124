from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from models.user import UserCreate, UserResponse, UserProfileResponse, LoginHistory
from database import get_database
import logging
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional, List
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from bson.objectid import ObjectId
from auth import get_current_user, create_access_token, get_password_hash, verify_password

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

class UserUpdate(BaseModel):
    username: str = Field(..., description="The user's username")
    email: str = Field(..., description="The user's email address")
    about: str = Field(default="", description="The user's bio")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "email": "john@example.com",
                "about": "My bio"
            }
        }

# Helper function to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        db = await get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": str(user["_id"]),
            "username": user["username"]
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def update_streak(user: dict) -> dict:
    """Update user's streak based on login history"""
    now = datetime.utcnow()
    today = now.date()
    
    # Get the last login date
    last_login = user.get('last_login')
    if last_login:
        last_login = last_login.date()
    
    # Initialize streak if it doesn't exist
    current_streak = user.get('current_streak', 0)
    longest_streak = user.get('longest_streak', 0)
    
    if not last_login:
        # First login
        current_streak = 1
    elif last_login == today - timedelta(days=1):
        # Consecutive day
        current_streak += 1
    elif last_login < today - timedelta(days=1):
        # Streak broken
        current_streak = 1
    
    # Update longest streak if current streak is higher
    if current_streak > longest_streak:
        longest_streak = current_streak
    
    # Add login history entry
    login_history = user.get('login_history', [])
    login_history.append(LoginHistory(
        date=now,
        streak_count=current_streak
    ).dict())
    
    # Update user document
    user['current_streak'] = current_streak
    user['longest_streak'] = longest_streak
    user['last_login'] = now
    user['login_history'] = login_history
    
    return user

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    try:
        logger.info(f"Creating new user: {user.username}")
        db = await get_database()
        
        # Check if username already exists
        if await db.users.find_one({"username": user.username}):
            logger.error(f"Username already exists: {user.username}")
            raise HTTPException(status_code=400, detail="Username already registered")
        
        # Check if email already exists
        if await db.users.find_one({"email": user.email}):
            logger.error(f"Email already registered: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user document
        user_doc = {
            "username": user.username,
            "email": user.email,
            "password": get_password_hash(user.password),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "followers": [],
            "following": [],
            "current_streak": 0,
            "longest_streak": 0,
            "last_login": None,
            "login_history": []
        }
        
        # Insert user into database
        result = await db.users.insert_one(user_doc)
        logger.info(f"Successfully created user: {user.username}")
        
        # Get the created user with all fields
        created_user = await db.users.find_one({"_id": result.inserted_id})
        
        # Return the user data
        return UserResponse(
            id=str(created_user["_id"]),
            username=created_user["username"],
            email=created_user["email"],
            created_at=created_user["created_at"],
            updated_at=created_user["updated_at"]
        )
        
    except HTTPException as he:
        logger.error(f"HTTP Exception during user creation: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No details available'}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(login_data: LoginRequest):
    try:
        db = await get_database()
        user = await db.users.find_one({"email": login_data.email})
        
        if not user or not verify_password(login_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Update streak information
        user = update_streak(user)
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "current_streak": user["current_streak"],
                    "longest_streak": user["longest_streak"],
                    "last_login": user["last_login"],
                    "login_history": user["login_history"]
                }
            }
        )
        
        # Create access token
        access_token = create_access_token({"sub": str(user["_id"])})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "current_streak": user["current_streak"],
                "longest_streak": user["longest_streak"]
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
async def update_user(username: str, user_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Starting profile update for user: {username}")
        logger.info(f"Current user from token: {current_user}")
        logger.info(f"Update data received: {user_data.model_dump()}")
        
        db = await get_database()
        
        # First, find the user by username
        user = await db.users.find_one({"username": username})
        if not user:
            logger.error(f"User not found: {username}")
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"Found user in database: {user}")
        
        # Ensure only the user can update their own profile
        if user["username"] != current_user["username"]:
            logger.error(f"Unauthorized update attempt. Current user: {current_user['username']}, Target user: {username}")
            raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
        # Check if new username is already taken by another user
        if user_data.username != username:
            existing_user = await db.users.find_one({"username": user_data.username})
            if existing_user:
                logger.error(f"Username already taken: {user_data.username}")
                raise HTTPException(status_code=400, detail="Username already taken")
        
        # Check if new email is already taken by another user
        if user_data.email != user["email"]:
            existing_user = await db.users.find_one({"email": user_data.email})
            if existing_user:
                logger.error(f"Email already registered: {user_data.email}")
                raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create the update document
        update_fields = {}
        
        # Only update fields that have changed
        if user_data.username != username:
            update_fields["username"] = user_data.username
        if user_data.email != user["email"]:
            update_fields["email"] = user_data.email
        if user_data.about != user.get("about", ""):
            update_fields["about"] = user_data.about
        
        # If no fields to update, return current user data
        if not update_fields:
            logger.info("No changes needed")
            return UserProfileResponse(
                username=user["username"],
                email=user["email"],
                role=user.get("role", "Student"),
                joined_date=user.get("created_at", datetime.utcnow()),
                about=user.get("about", ""),
                followers=user.get("followers", []),
                following=user.get("following", []),
                followers_count=len(user.get("followers", [])),
                following_count=len(user.get("following", []))
            )
        
        # Add updated_at timestamp
        update_fields["updated_at"] = datetime.utcnow()
        
        logger.info(f"Updating user with fields: {update_fields}")
        
        try:
            # Perform the update
            result = await db.users.update_one(
                {"_id": user["_id"]},  # Use _id for more reliable updates
                {"$set": update_fields}
            )
            
            if result.modified_count == 0:
                logger.error("No changes made to the database")
                raise HTTPException(status_code=400, detail="No changes made")
            
            # Get the updated user data
            updated_user = await db.users.find_one({"_id": user["_id"]})
            
            if not updated_user:
                logger.error(f"Failed to retrieve updated user data")
                raise HTTPException(status_code=500, detail="Failed to retrieve updated user data")
            
            logger.info(f"Successfully updated user profile for: {updated_user['username']}")
            
            # Return the updated user data
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
            
        except Exception as db_error:
            logger.error(f"Database error during update: {str(db_error)}")
            logger.error(f"Database error type: {type(db_error)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
        
    except HTTPException as he:
        logger.error(f"HTTP Exception during update: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No details available'}")
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

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Getting user info for user ID: {current_user['id']}")
        db = await get_database()
        
        # Convert string ID to ObjectId
        try:
            user_id = ObjectId(current_user["id"])
        except Exception as e:
            logger.error(f"Invalid user ID format: {current_user['id']}")
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        user = await db.users.find_one({"_id": user_id})
        
        if not user:
            logger.error(f"User not found with ID: {current_user['id']}")
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"Found user: {user['username']}")
        
        # Convert ObjectId to string
        user["id"] = str(user["_id"])
        
        # Ensure all required fields are present
        user_data = {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "current_streak": user.get("current_streak", 0),
            "longest_streak": user.get("longest_streak", 0),
            "login_history": user.get("login_history", []),
            "last_login": user.get("last_login"),
            "role": user.get("role", "Student"),
            "about": user.get("about", ""),
            "followers": user.get("followers", []),
            "following": user.get("following", []),
            "followers_count": len(user.get("followers", [])),
            "following_count": len(user.get("following", [])),
            "created_at": user.get("created_at", datetime.utcnow()),
            "updated_at": user.get("updated_at", datetime.utcnow())
        }
        
        logger.info(f"Returning user data with streak: {user_data['current_streak']}")
        return UserResponse(**user_data)
    except Exception as e:
        logger.error(f"Error fetching user info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching user info: {str(e)}")

@router.get("/users/{username}", response_model=UserResponse)
async def get_user(username: str):
    try:
        db = await get_database()
        user = await db.users.find_one({"username": username})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user["id"] = str(user["_id"])
        return UserResponse(**user)
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

@router.delete("/username/{username}")
async def delete_user(username: str, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Starting account deletion for user: {username}")
        logger.info(f"Current user from token: {current_user}")
        
        db = await get_database()
        
        # First, find the user by username
        user = await db.users.find_one({"username": username})
        if not user:
            logger.error(f"User not found: {username}")
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"Found user in database: {user}")
        
        # Ensure only the user can delete their own account
        if user["username"] != current_user["username"]:
            logger.error(f"Unauthorized deletion attempt. Current user: {current_user['username']}, Target user: {username}")
            raise HTTPException(status_code=403, detail="Not authorized to delete this account")
        
        try:
            # Delete the user
            result = await db.users.delete_one({"_id": user["_id"]})
            
            if result.deleted_count == 0:
                logger.error("No user was deleted")
                raise HTTPException(status_code=500, detail="Failed to delete account")
            
            logger.info(f"Successfully deleted user account: {username}")
            return {"message": "Account deleted successfully"}
            
        except Exception as db_error:
            logger.error(f"Database error during deletion: {str(db_error)}")
            logger.error(f"Database error type: {type(db_error)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
        
    except HTTPException as he:
        logger.error(f"HTTP Exception during deletion: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No details available'}")
        raise HTTPException(status_code=500, detail=str(e)) 