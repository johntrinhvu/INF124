from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional, Dict
import uuid

class QuizAccuracy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quiz_id: str
    course_title: str
    score: float
    answers: Dict[str, str]
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        populate_by_name = True

class LoginHistory(BaseModel):
    date: datetime
    streak_count: int

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password: str
    about: Optional[str] = None
    followers: List[str] = []
    following: List[str] = []
    followers_count: int = 0
    following_count: int = 0
    quiz_accuracy: List[QuizAccuracy] = []
    total_quizzes_completed: int = 0
    average_score: float = 0.0
    login_history: List[LoginHistory] = []
    current_streak: int = 0
    longest_streak: int = 0
    last_login: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        populate_by_name = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    current_streak: int = 0
    longest_streak: int = 0
    login_history: List[LoginHistory] = []
    last_login: Optional[datetime] = None
    role: str = "Student"
    about: str = ""
    followers: List[str] = []
    following: List[str] = []
    followers_count: int = 0
    following_count: int = 0
    created_at: datetime
    updated_at: datetime

class UserProfileResponse(BaseModel):
    username: str
    email: EmailStr
    role: str = "Student"
    joined_date: datetime
    about: str = ""
    followers: List[str]
    following: List[str]
    followers_count: int
    following_count: int
    current_streak: int = 0
    longest_streak: int = 0 