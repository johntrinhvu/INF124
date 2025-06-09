from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid

class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    options: List[str]
    correct_answer: int
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

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[int]

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
            "correct_answer": 1,
            "explanation": "The CPU (Central Processing Unit) is responsible for executing instructions and processing data. It's often called the 'brain' of the computer."
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
            "correct_answer": 1,
            "explanation": "RAM (Random Access Memory) is used for temporary data storage while the computer is running."
        }
    ],
    "Introduction to Healthcare": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the primary role of a nurse?",
            "options": [
                "Only to administer medications",
                "To provide patient care and support",
                "Only to take vital signs",
                "Only to assist doctors"
            ],
            "correct_answer": 1,
            "explanation": "Nurses have a comprehensive role in patient care, including assessment, planning, implementation, and evaluation of patient care."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "What does HIPAA stand for?",
            "options": [
                "Health Insurance Portability and Accountability Act",
                "Health Information Protection and Access Act",
                "Healthcare Insurance and Patient Access Act",
                "Health Information Privacy and Accountability Act"
            ],
            "correct_answer": 0,
            "explanation": "HIPAA is the Health Insurance Portability and Accountability Act, which protects patient privacy and health information."
        }
    ],
    "Introduction to Electrical Engineering": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is Ohm's Law?",
            "options": [
                "V = IR",
                "P = VI",
                "I = V/R",
                "R = V/I"
            ],
            "correct_answer": 0,
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
            "correct_answer": 2,
            "explanation": "The unit of electrical resistance is the Ohm (Ω)."
        }
    ],
    "Introduction to Chemistry": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the atomic number of Hydrogen?",
            "options": [
                "1",
                "2",
                "3",
                "4"
            ],
            "correct_answer": 0,
            "explanation": "Hydrogen has an atomic number of 1, meaning it has one proton."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "What is the chemical formula for water?",
            "options": [
                "CO2",
                "H2O",
                "O2",
                "H2O2"
            ],
            "correct_answer": 1,
            "explanation": "Water's chemical formula is H2O, consisting of two hydrogen atoms and one oxygen atom."
        }
    ],
    "Advanced Computer Networks": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the purpose of a router?",
            "options": [
                "To connect devices within a local network",
                "To forward data packets between networks",
                "To store data",
                "To process data"
            ],
            "correct_answer": 1,
            "explanation": "A router's main purpose is to forward data packets between different networks."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "What is TCP/IP?",
            "options": [
                "A type of computer",
                "A network protocol suite",
                "A type of cable",
                "A type of server"
            ],
            "correct_answer": 1,
            "explanation": "TCP/IP is a suite of communication protocols used to interconnect network devices on the internet."
        }
    ],
    "Biochemistry": [
        {
            "id": str(uuid.uuid4()),
            "text": "What is the primary function of DNA?",
            "options": [
                "To provide energy",
                "To store genetic information",
                "To build cell walls",
                "To transport oxygen"
            ],
            "correct_answer": 1,
            "explanation": "DNA's primary function is to store and transmit genetic information."
        },
        {
            "id": str(uuid.uuid4()),
            "text": "What is the main energy currency of cells?",
            "options": [
                "DNA",
                "RNA",
                "ATP",
                "Glucose"
            ],
            "correct_answer": 2,
            "explanation": "ATP (Adenosine Triphosphate) is the main energy currency of cells."
        }
    ]
} 