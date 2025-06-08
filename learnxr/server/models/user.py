from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr

class UserProfileResponse(BaseModel):
    username: str
    email: str
    role: str = "Student"  # Default role
    joined_date: datetime
    about: str = ""  # Default empty string for bio/about
    followers: List[str] = []  # List of usernames who follow this user
    following: List[str] = []  # List of usernames this user follows
    followers_count: int = 0
    following_count: int = 0 