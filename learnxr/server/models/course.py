from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
import uuid

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    difficulty: str = "Beginner"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Initial courses data
INITIAL_COURSES = [
    {
        "title": "Introduction to Computer Architecture",
        "description": "Learn the fundamentals of computer organization, CPU design, memory systems, and I/O interfaces.",
        "category": "Computer Science",
        "difficulty": "Beginner"
    },
    {
        "title": "Introduction to Healthcare",
        "description": "Explore the basics of healthcare systems, medical terminology, and patient care fundamentals.",
        "category": "Healthcare",
        "difficulty": "Beginner"
    },
    {
        "title": "Introduction to Electrical Engineering",
        "description": "Study basic electrical circuits, components, and fundamental principles of electrical engineering.",
        "category": "Engineering",
        "difficulty": "Beginner"
    },
    {
        "title": "Introduction to Chemistry",
        "description": "Learn about atomic structure, chemical bonding, reactions, and basic laboratory techniques.",
        "category": "Science",
        "difficulty": "Beginner"
    },
    {
        "title": "Advanced Computer Networks",
        "description": "Deep dive into network protocols, routing, switching, and advanced networking concepts.",
        "category": "Computer Science",
        "difficulty": "Advanced"
    },
    {
        "title": "Biochemistry",
        "description": "Study the chemical processes within living organisms, including metabolism and molecular biology.",
        "category": "Science",
        "difficulty": "Advanced"
    }
] 