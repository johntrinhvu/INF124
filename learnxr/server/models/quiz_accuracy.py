from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, Field
import uuid

class QuizAccuracy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    quiz_id: str
    course_title: str
    score: float
    answers: Dict[str, str]
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True 