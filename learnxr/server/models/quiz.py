from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
import uuid

class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class Quiz(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    title: str
    description: str
    questions: List[Dict[str, Any]]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class QuizAnswer(BaseModel):
    selectedAnswer: str
    lessonNumber: int

class QuizSubmission(BaseModel):
    answers: Dict[str, int] = Field(
        ...,
        description="Maps question index (as string) to selected answer index (as integer)",
        example={ "0": 2, "1": 0 }
    )

    @validator('answers')
    def validate_answers(cls, v):
        if not v:
            raise ValueError('Answers cannot be empty')
        return v

# Sample questions for each course
COURSE_QUESTIONS = {
    "Introduction to Computer Architecture": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the main function of the CPU?",
            "options": [
                "To store data permanently",
                "To execute instructions and process data",
                "To display graphics",
                "To connect to the internet"
            ],
            "correct_answer": "To execute instructions and process data",
            "explanation": "The CPU (Central Processing Unit) is the brain of the computer, responsible for executing instructions and processing data."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "Which component is responsible for temporary data storage?",
            "options": [
                "Hard Drive",
                "RAM",
                "CPU",
                "Power Supply"
            ],
            "correct_answer": "RAM",
            "explanation": "RAM (Random Access Memory) is used for temporary data storage while the computer is running."
        }
    ],
    "Introduction to Healthcare": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the primary role of a nurse?",
            "options": [
                "To perform surgery",
                "To prescribe medication",
                "To provide patient care and support",
                "To manage hospital finances"
            ],
            "correct_answer": "To provide patient care and support",
            "explanation": "Nurses are primarily responsible for patient care, monitoring, and support."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "Which of these is a vital sign?",
            "options": [
                "Blood pressure",
                "Hair color",
                "Shoe size",
                "Favorite food"
            ],
            "correct_answer": "Blood pressure",
            "explanation": "Blood pressure is one of the main vital signs used to assess a patient's health."
        }
    ],
    "Introduction to Electrical Engineering": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is Ohm's Law?",
            "options": [
                "V = IR",
                "P = VI",
                "F = ma",
                "E = mc²"
            ],
            "correct_answer": "V = IR",
            "explanation": "Ohm's Law states that voltage (V) equals current (I) times resistance (R)."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "What is the unit of electrical resistance?",
            "options": [
                "Volt",
                "Ampere",
                "Ohm",
                "Watt"
            ],
            "correct_answer": "Ohm",
            "explanation": "The ohm (Ω) is the unit of electrical resistance."
        }
    ],
    "Introduction to Chemistry": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the atomic number of carbon?",
            "options": [
                "6",
                "12",
                "14",
                "16"
            ],
            "correct_answer": "6",
            "explanation": "Carbon has 6 protons, which determines its atomic number."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "What type of bond is formed when atoms share electrons?",
            "options": [
                "Ionic bond",
                "Covalent bond",
                "Metallic bond",
                "Hydrogen bond"
            ],
            "correct_answer": "Covalent bond",
            "explanation": "A covalent bond is formed when atoms share electrons."
        }
    ],
    "Advanced Computer Networks": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the purpose of a router?",
            "options": [
                "To connect devices within a local network",
                "To route data between different networks",
                "To store data",
                "To process data"
            ],
            "correct_answer": "To route data between different networks",
            "explanation": "Routers are used to forward data packets between different networks."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "Which protocol is used for secure web browsing?",
            "options": [
                "HTTP",
                "FTP",
                "HTTPS",
                "SMTP"
            ],
            "correct_answer": "HTTPS",
            "explanation": "HTTPS (Hypertext Transfer Protocol Secure) provides secure communication over a network."
        }
    ],
    "Biochemistry": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the primary function of enzymes?",
            "options": [
                "To store energy",
                "To catalyze chemical reactions",
                "To transport molecules",
                "To provide structure"
            ],
            "correct_answer": "To catalyze chemical reactions",
            "explanation": "Enzymes are biological catalysts that speed up chemical reactions."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "What is the main energy currency of cells?",
            "options": [
                "Glucose",
                "ATP",
                "DNA",
                "Protein"
            ],
            "correct_answer": "ATP",
            "explanation": "ATP (Adenosine Triphosphate) is the main energy currency of cells."
        }
    ]
} 