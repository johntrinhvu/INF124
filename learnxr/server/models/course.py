from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid

class Lesson(BaseModel):
    title: str
    content: str
    examples: Optional[str] = None

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    difficulty: str = "Beginner"
    lessons: List[Dict[str, Any]]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Initial courses data with lessons
INITIAL_COURSES = [
    {
        "title": "Introduction to Computer Architecture",
        "description": "Learn the fundamentals of computer organization, CPU design, memory systems, and I/O interfaces.",
        "category": "Computer Science",
        "difficulty": "Beginner",
        "lessons": [
            {
                "title": "Introduction to Computer Components",
                "content": "Computers are made up of several key components that work together to process information. The main components include the CPU (Central Processing Unit), memory, storage, and input/output devices.",
                "examples": "Example: A modern CPU like the Intel i7 contains billions of transistors and can perform billions of calculations per second."
            },
            {
                "title": "CPU Architecture",
                "content": "The CPU is the brain of the computer, responsible for executing instructions and processing data. It consists of the control unit, arithmetic logic unit (ALU), and registers.",
                "examples": "Example: When you add two numbers, the ALU performs the calculation while the control unit manages the process."
            },
            {
                "title": "Memory Hierarchy",
                "content": "Computer memory is organized in a hierarchy, from fast but expensive cache memory to slower but cheaper main memory and storage devices.",
                "examples": "Example: L1 cache is the fastest but smallest, while hard drives are the slowest but can store the most data."
            }
        ]
    },
    {
        "title": "Introduction to Healthcare",
        "description": "Explore the basics of healthcare systems, medical terminology, and patient care fundamentals.",
        "category": "Healthcare",
        "difficulty": "Beginner",
        "lessons": [
            {
                "title": "Healthcare Systems Overview",
                "content": "Healthcare systems are complex organizations that provide medical services to populations. They include hospitals, clinics, and various healthcare professionals.",
                "examples": "Example: A primary care physician serves as the first point of contact for patients in the healthcare system."
            },
            {
                "title": "Medical Terminology",
                "content": "Medical terminology is the language used by healthcare professionals to describe the human body, conditions, and procedures.",
                "examples": "Example: 'Cardio' means heart, 'ology' means study of, so 'cardiology' is the study of the heart."
            },
            {
                "title": "Patient Care Basics",
                "content": "Patient care involves understanding patient needs, providing appropriate treatment, and ensuring patient safety and comfort.",
                "examples": "Example: Taking vital signs (temperature, blood pressure, pulse) is a fundamental part of patient assessment."
            }
        ]
    },
    {
        "title": "Introduction to Electrical Engineering",
        "description": "Study basic electrical circuits, components, and fundamental principles of electrical engineering.",
        "category": "Engineering",
        "difficulty": "Beginner",
        "lessons": [
            {
                "title": "Basic Circuit Elements",
                "content": "Electrical circuits are made up of basic elements like resistors, capacitors, and inductors. Each element has specific properties and behaviors.",
                "examples": "Example: A resistor limits current flow, while a capacitor stores electrical energy."
            },
            {
                "title": "Ohm's Law",
                "content": "Ohm's Law is a fundamental principle that relates voltage, current, and resistance in electrical circuits.",
                "examples": "Example: If a circuit has a voltage of 12V and a resistance of 4Ω, the current will be 3A (I = V/R)."
            },
            {
                "title": "Circuit Analysis",
                "content": "Circuit analysis involves using various techniques to determine the behavior of electrical circuits.",
                "examples": "Example: Kirchhoff's laws help analyze complex circuits by considering current and voltage relationships."
            }
        ]
    },
    {
        "title": "Introduction to Chemistry",
        "description": "Learn about atomic structure, chemical bonding, reactions, and basic laboratory techniques.",
        "category": "Science",
        "difficulty": "Beginner",
        "lessons": [
            {
                "title": "Atomic Structure",
                "content": "Atoms are the basic building blocks of matter, consisting of protons, neutrons, and electrons.",
                "examples": "Example: A carbon atom has 6 protons, 6 neutrons, and 6 electrons."
            },
            {
                "title": "Chemical Bonding",
                "content": "Chemical bonds form when atoms share or transfer electrons to achieve stability.",
                "examples": "Example: In a water molecule (H2O), hydrogen and oxygen atoms share electrons to form covalent bonds."
            },
            {
                "title": "Chemical Reactions",
                "content": "Chemical reactions involve the rearrangement of atoms to form new substances.",
                "examples": "Example: When hydrogen and oxygen react, they form water (2H2 + O2 → 2H2O)."
            }
        ]
    },
    {
        "title": "Advanced Computer Networks",
        "description": "Deep dive into network protocols, routing, switching, and advanced networking concepts.",
        "category": "Computer Science",
        "difficulty": "Advanced",
        "lessons": [
            {
                "title": "Network Protocols",
                "content": "Network protocols define rules for communication between devices on a network.",
                "examples": "Example: TCP/IP is the fundamental protocol suite used for internet communication."
            },
            {
                "title": "Routing and Switching",
                "content": "Routers and switches are essential network devices that direct traffic between different networks and devices.",
                "examples": "Example: A router uses routing tables to determine the best path for data packets."
            },
            {
                "title": "Network Security",
                "content": "Network security involves protecting networks from unauthorized access and attacks.",
                "examples": "Example: Firewalls and encryption are common security measures used to protect networks."
            }
        ]
    },
    {
        "title": "Biochemistry",
        "description": "Study the chemical processes within living organisms, including metabolism and molecular biology.",
        "category": "Science",
        "difficulty": "Advanced",
        "lessons": [
            {
                "title": "Cellular Metabolism",
                "content": "Metabolism refers to the chemical processes that occur within cells to maintain life.",
                "examples": "Example: Glycolysis is a metabolic pathway that breaks down glucose to produce energy."
            },
            {
                "title": "Molecular Biology",
                "content": "Molecular biology studies the structure and function of biological molecules.",
                "examples": "Example: DNA replication is a fundamental process in molecular biology."
            },
            {
                "title": "Enzymes and Catalysis",
                "content": "Enzymes are biological catalysts that speed up chemical reactions in living organisms.",
                "examples": "Example: The enzyme amylase breaks down starch into simpler sugars."
            }
        ]
    }
] 