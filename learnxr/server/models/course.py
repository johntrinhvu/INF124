from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int  # Index of the correct answer in options list

class Lesson(BaseModel):
    lesson_number: int
    title: str
    content: str
    examples: Optional[str] = None
    quiz: Optional[List[QuizQuestion]] = None

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    difficulty: str = "Beginner"
    lessons: List[Lesson]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

    def dict(self, *args, **kwargs):
        d = super().dict(*args, **kwargs)
        if not d.get('id'):
            d['id'] = str(uuid.uuid4())
        return d

# Initial courses data with lessons
INITIAL_COURSES = [
    {
        "title": "Introduction to Computer Architecture",
        "description": "Learn the fundamentals of computer organization, CPU design, memory systems, and I/O interfaces.",
        "category": "Computer Science",
        "difficulty": "Beginner",
        "lessons": [
            {
                "lesson_number": 1,
                "title": "Introduction to Computer Components",
                "content": "Computers are made up of several key components that work together to process information. The main components include the CPU (Central Processing Unit), memory, storage, and input/output devices.",
                "examples": "Example: A modern CPU like the Intel i7 contains billions of transistors and can perform billions of calculations per second.",
                "quiz": [
                    {
                        "question": "What is the main function of a CPU?",
                        "options": ["Store data", "Process instructions", "Display output", "Connect to the internet"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which component stores data temporarily while the computer is running?",
                        "options": ["Hard Drive", "RAM", "CPU", "Power Supply"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the purpose of the motherboard?",
                        "options": ["To connect all components", "To store data", "To process data", "To display output"],
                        "correct_answer": 0
                    },
                    {
                        "question": "Which component is responsible for converting AC to DC power?",
                        "options": ["CPU", "RAM", "Power Supply", "Motherboard"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is the purpose of the BIOS?",
                        "options": ["To store user data", "To connect to the internet", "To initialize hardware", "To display graphics"],
                        "correct_answer": 2
                    }
                ]
            },
            {
                "lesson_number": 2,
                "title": "CPU Architecture",
                "content": "The CPU is the brain of the computer, responsible for executing instructions and processing data. It consists of the control unit, arithmetic logic unit (ALU), and registers.",
                "examples": "Example: When you add two numbers, the ALU performs the addition while the control unit manages the process.",
                "quiz": [
                    {
                        "question": "What does ALU stand for?",
                        "options": ["Arithmetic Logic Unit", "Advanced Logic Unit", "Arithmetic Learning Unit", "Advanced Learning Unit"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is the purpose of the control unit?",
                        "options": ["To perform calculations", "To store data", "To manage instruction execution", "To display output"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What are registers used for?",
                        "options": ["Long-term storage", "Temporary data storage", "Display output", "Connect to peripherals"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the clock speed of a CPU?",
                        "options": ["The amount of memory", "The number of cores", "The speed of instruction execution", "The power consumption"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is pipelining in CPU architecture?",
                        "options": ["A type of memory", "A way to connect components", "A method of parallel instruction processing", "A cooling system"],
                        "correct_answer": 2
                    }
                ]
            },
            {
                "lesson_number": 3,
                "title": "Memory Systems",
                "content": "Computer memory systems include different types of storage with varying speeds and capacities. Understanding the memory hierarchy is crucial for computer performance.",
                "examples": "Example: Cache memory is faster but smaller than RAM, while hard drives are slower but can store more data.",
                "quiz": [
                    {
                        "question": "What is the memory hierarchy?",
                        "options": ["A way to organize memory by speed and size", "A type of CPU", "A storage device", "A network protocol"],
                        "correct_answer": 0
                    },
                    {
                        "question": "Which memory type is fastest?",
                        "options": ["Hard Drive", "RAM", "Cache", "SSD"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is virtual memory?",
                        "options": ["A type of RAM", "A way to extend RAM using disk space", "A storage device", "A CPU component"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the purpose of cache memory?",
                        "options": ["Long-term storage", "To store frequently used data", "To connect components", "To display output"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the difference between RAM and ROM?",
                        "options": ["RAM is faster", "RAM is volatile, ROM is non-volatile", "RAM is larger", "RAM is cheaper"],
                        "correct_answer": 1
                    }
                ]
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
                "lesson_number": 1,
                "title": "Healthcare Systems Overview",
                "content": "Healthcare systems are complex organizations that provide medical services to populations. They include hospitals, clinics, and various healthcare professionals.",
                "examples": "Example: A primary care physician serves as the first point of contact for patients in the healthcare system.",
                "quiz": [
                    {
                        "question": "What is the role of a primary care physician?",
                        "options": ["Perform surgeries", "First point of contact", "Manage hospital finances", "Conduct research"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which is NOT typically part of a healthcare system?",
                        "options": ["Hospitals", "Restaurants", "Clinics", "Pharmacies"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the main goal of a healthcare system?",
                        "options": ["Make profit", "Provide medical services", "Conduct research", "Train doctors"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which healthcare professional typically works in a hospital?",
                        "options": ["Chef", "Nurse", "Teacher", "Engineer"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the purpose of a clinic?",
                        "options": ["Serve food", "Provide outpatient care", "Conduct research", "Train athletes"],
                        "correct_answer": 1
                    }
                ]
            },
            {
                "lesson_number": 2,
                "title": "Medical Terminology",
                "content": "Medical terminology is the language used by healthcare professionals to describe the human body, conditions, and procedures.",
                "examples": "Example: 'Cardio' means heart, 'ology' means study of, so 'cardiology' is the study of the heart.",
                "quiz": [
                    {
                        "question": "What does the prefix 'cardio-' mean?",
                        "options": ["Brain", "Heart", "Lung", "Liver"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What does the suffix '-ology' mean?",
                        "options": ["Treatment", "Study of", "Disease", "Medicine"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the meaning of 'neuro-'?",
                        "options": ["Heart", "Brain", "Lung", "Bone"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What does 'derma-' refer to?",
                        "options": ["Bone", "Muscle", "Skin", "Blood"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is the meaning of '-itis'?",
                        "options": ["Study of", "Treatment", "Inflammation", "Disease"],
                        "correct_answer": 2
                    }
                ]
            },
            {
                "lesson_number": 3,
                "title": "Patient Care Basics",
                "content": "Patient care involves understanding patient needs, providing appropriate treatment, and ensuring patient safety and comfort.",
                "examples": "Example: Taking vital signs (temperature, blood pressure, pulse) is a fundamental part of patient assessment.",
                "quiz": [
                    {
                        "question": "What are vital signs?",
                        "options": ["Patient's name and address", "Basic body measurements", "Insurance information", "Medical history"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which is NOT typically considered a vital sign?",
                        "options": ["Blood pressure", "Temperature", "Favorite color", "Pulse rate"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is the first step in patient assessment?",
                        "options": ["Take vital signs", "Check insurance", "Call family", "Order tests"],
                        "correct_answer": 0
                    },
                    {
                        "question": "Why is patient safety important?",
                        "options": ["To save money", "To prevent harm", "To speed up treatment", "To reduce paperwork"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the role of patient comfort in care?",
                        "options": ["It's not important", "It's the only goal", "It's part of quality care", "It's the doctor's job"],
                        "correct_answer": 2
                    }
                ]
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
                "lesson_number": 1,
                "title": "Basic Circuit Elements",
                "content": "Electrical circuits are made up of basic elements like resistors, capacitors, and inductors. Each element has specific properties and behaviors.",
                "examples": "Example: A resistor limits current flow, while a capacitor stores electrical energy.",
                "quiz": [
                    {
                        "question": "What is the primary function of a resistor in a circuit?",
                        "options": ["Store energy", "Limit current flow", "Amplify signals", "Generate power"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which component stores electrical energy in an electric field?",
                        "options": ["Resistor", "Capacitor", "Inductor", "Transistor"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the unit of resistance?",
                        "options": ["Volt", "Ampere", "Ohm", "Watt"],
                        "correct_answer": 2
                    },
                    {
                        "question": "Which component stores energy in a magnetic field?",
                        "options": ["Resistor", "Capacitor", "Inductor", "Diode"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is the symbol for a resistor in circuit diagrams?",
                        "options": ["Circle", "Zigzag line", "Rectangle", "Triangle"],
                        "correct_answer": 1
                    }
                ]
            },
            {
                "lesson_number": 2,
                "title": "Ohm's Law",
                "content": "Ohm's Law is a fundamental principle that relates voltage, current, and resistance in electrical circuits.",
                "examples": "Example: If a circuit has a voltage of 12V and a resistance of 4Ω, the current will be 3A (I = V/R).",
                "quiz": [
                    {
                        "question": "What is the formula for Ohm's Law?",
                        "options": ["V = IR", "I = VR", "R = IV", "P = VI"],
                        "correct_answer": 0
                    },
                    {
                        "question": "If voltage is 10V and resistance is 2Ω, what is the current?",
                        "options": ["5A", "20A", "0.2A", "2A"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What happens to current if resistance increases?",
                        "options": ["Increases", "Decreases", "Stays the same", "Becomes zero"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the unit of voltage?",
                        "options": ["Ampere", "Ohm", "Volt", "Watt"],
                        "correct_answer": 2
                    },
                    {
                        "question": "If current is 2A and resistance is 3Ω, what is the voltage?",
                        "options": ["1.5V", "6V", "5V", "2V"],
                        "correct_answer": 1
                    }
                ]
            },
            {
                "lesson_number": 3,
                "title": "Circuit Analysis",
                "content": "Circuit analysis involves using various techniques to determine the behavior of electrical circuits.",
                "examples": "Example: Kirchhoff's laws help analyze complex circuits by considering current and voltage relationships.",
                "quiz": [
                    {
                        "question": "What is Kirchhoff's Current Law?",
                        "options": ["Sum of currents at a node is zero", "Sum of voltages in a loop is zero", "Power equals voltage times current", "Resistance equals voltage divided by current"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is Kirchhoff's Voltage Law?",
                        "options": ["Sum of currents at a node is zero", "Sum of voltages in a loop is zero", "Power equals voltage times current", "Resistance equals voltage divided by current"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a node in circuit analysis?",
                        "options": ["A power source", "A connection point", "A resistor", "A capacitor"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a loop in circuit analysis?",
                        "options": ["A power source", "A closed path", "A resistor", "A connection point"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which law is used to analyze parallel circuits?",
                        "options": ["Ohm's Law", "Kirchhoff's Laws", "Newton's Laws", "Faraday's Law"],
                        "correct_answer": 1
                    }
                ]
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
                "lesson_number": 1,
                "title": "Atomic Structure",
                "content": "Atoms are the basic building blocks of matter, consisting of protons, neutrons, and electrons.",
                "examples": "Example: A carbon atom has 6 protons, 6 neutrons, and 6 electrons.",
                "quiz": [
                    {
                        "question": "What are the three main subatomic particles?",
                        "options": ["Protons, neutrons, electrons", "Atoms, molecules, ions", "Elements, compounds, mixtures", "Solids, liquids, gases"],
                        "correct_answer": 0
                    },
                    {
                        "question": "Where are electrons located in an atom?",
                        "options": ["Nucleus", "Electron cloud", "Proton shell", "Neutron orbit"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What determines the atomic number of an element?",
                        "options": ["Number of neutrons", "Number of protons", "Number of electrons", "Mass number"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the charge of a proton?",
                        "options": ["Negative", "Positive", "Neutral", "Variable"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the mass of an electron compared to a proton?",
                        "options": ["Equal", "Greater", "Much smaller", "Variable"],
                        "correct_answer": 2
                    }
                ]
            },
            {
                "lesson_number": 2,
                "title": "Chemical Bonding",
                "content": "Chemical bonds form when atoms share or transfer electrons to achieve stability.",
                "examples": "Example: In a water molecule (H2O), hydrogen and oxygen atoms share electrons to form covalent bonds.",
                "quiz": [
                    {
                        "question": "What type of bond forms when electrons are shared?",
                        "options": ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What type of bond forms when electrons are transferred?",
                        "options": ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is a polar covalent bond?",
                        "options": ["Equal sharing of electrons", "Unequal sharing of electrons", "Complete transfer of electrons", "No sharing of electrons"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What type of bond is found in water molecules?",
                        "options": ["Ionic", "Covalent", "Metallic", "Hydrogen"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What determines the type of bond that forms?",
                        "options": ["Temperature", "Electronegativity difference", "Pressure", "Volume"],
                        "correct_answer": 1
                    }
                ]
            },
            {
                "lesson_number": 3,
                "title": "Chemical Reactions",
                "content": "Chemical reactions involve the rearrangement of atoms to form new substances.",
                "examples": "Example: When hydrogen and oxygen react, they form water (2H2 + O2 → 2H2O).",
                "quiz": [
                    {
                        "question": "What is a chemical reaction?",
                        "options": ["Physical change", "Rearrangement of atoms", "Change in temperature", "Change in pressure"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a reactant?",
                        "options": ["End product", "Starting material", "Catalyst", "Inhibitor"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a product?",
                        "options": ["Starting material", "End result", "Catalyst", "Inhibitor"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a balanced chemical equation?",
                        "options": ["Equal number of atoms on both sides", "Equal number of molecules", "Equal volume", "Equal mass"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is a catalyst?",
                        "options": ["Reactant", "Product", "Reaction speeder", "Inhibitor"],
                        "correct_answer": 2
                    }
                ]
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
                "lesson_number": 1,
                "title": "Network Protocols",
                "content": "Network protocols define rules for communication between devices on a network.",
                "examples": "Example: TCP/IP is the fundamental protocol suite used for internet communication.",
                "quiz": [
                    {
                        "question": "What is the main purpose of network protocols?",
                        "options": ["Increase network speed", "Define communication rules", "Reduce costs", "Increase security"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which protocol is used for reliable data delivery?",
                        "options": ["UDP", "TCP", "IP", "HTTP"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the main difference between TCP and UDP?",
                        "options": ["Speed", "Reliability", "Cost", "Security"],
                        "correct_answer": 1
                    },
                    {
                        "question": "Which layer of the OSI model does TCP operate in?",
                        "options": ["Physical", "Data Link", "Transport", "Application"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is the purpose of the IP protocol?",
                        "options": ["Reliable delivery", "Addressing and routing", "Error checking", "Flow control"],
                        "correct_answer": 1
                    }
                ]
            },
            {
                "lesson_number": 2,
                "title": "Routing and Switching",
                "content": "Routers and switches are essential network devices that direct traffic between different networks and devices.",
                "examples": "Example: A router uses routing tables to determine the best path for data packets.",
                "quiz": [
                    {
                        "question": "What is the main function of a router?",
                        "options": ["Connect devices in the same network", "Connect different networks", "Amplify signals", "Store data"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a routing table?",
                        "options": ["List of connected devices", "List of network paths", "List of users", "List of files"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the difference between a router and a switch?",
                        "options": ["Speed", "Cost", "Network scope", "Size"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is packet switching?",
                        "options": ["Physical connection", "Logical connection", "Data transmission method", "Error checking"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is the purpose of a switch?",
                        "options": ["Connect networks", "Connect devices in a network", "Route packets", "Store data"],
                        "correct_answer": 1
                    }
                ]
            },
            {
                "lesson_number": 3,
                "title": "Network Security",
                "content": "Network security involves protecting networks from unauthorized access and attacks.",
                "examples": "Example: Firewalls and encryption are common security measures used to protect networks.",
                "quiz": [
                    {
                        "question": "What is a firewall?",
                        "options": ["Network device", "Security barrier", "Storage device", "Routing device"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is encryption?",
                        "options": ["Data compression", "Data encoding", "Data storage", "Data routing"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a VPN?",
                        "options": ["Virtual Private Network", "Virtual Public Network", "Very Private Network", "Very Public Network"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is a DDoS attack?",
                        "options": ["Data theft", "Service disruption", "Network monitoring", "Data backup"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the purpose of network security?",
                        "options": ["Increase speed", "Reduce cost", "Protect data", "Increase storage"],
                        "correct_answer": 2
                    }
                ]
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
                "lesson_number": 1,
                "title": "Cellular Metabolism",
                "content": "Metabolism refers to the chemical processes that occur within cells to maintain life.",
                "examples": "Example: Glycolysis is a metabolic pathway that breaks down glucose to produce energy.",
                "quiz": [
                    {
                        "question": "What is metabolism?",
                        "options": ["Cell division", "Chemical processes in cells", "Protein synthesis", "DNA replication"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is glycolysis?",
                        "options": ["Protein synthesis", "Glucose breakdown", "DNA replication", "Cell division"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is ATP?",
                        "options": ["Protein", "Energy currency", "Enzyme", "Hormone"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the main purpose of cellular respiration?",
                        "options": ["Protein synthesis", "Energy production", "DNA replication", "Cell division"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the role of enzymes in metabolism?",
                        "options": ["Energy storage", "Reaction catalysis", "DNA replication", "Cell division"],
                        "correct_answer": 1
                    }
                ]
            },
            {
                "lesson_number": 2,
                "title": "Molecular Biology",
                "content": "Molecular biology studies the structure and function of biological molecules.",
                "examples": "Example: DNA replication is a fundamental process in molecular biology.",
                "quiz": [
                    {
                        "question": "What is DNA?",
                        "options": ["Protein", "Carbohydrate", "Genetic material", "Lipid"],
                        "correct_answer": 2
                    },
                    {
                        "question": "What is the structure of DNA?",
                        "options": ["Single strand", "Double helix", "Triple helix", "Quadruple helix"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is transcription?",
                        "options": ["DNA to RNA", "RNA to protein", "DNA to protein", "Protein to DNA"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is translation?",
                        "options": ["DNA to RNA", "RNA to protein", "DNA to protein", "Protein to DNA"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is a gene?",
                        "options": ["Protein", "Carbohydrate", "DNA sequence", "Lipid"],
                        "correct_answer": 2
                    }
                ]
            },
            {
                "lesson_number": 3,
                "title": "Enzymes and Catalysis",
                "content": "Enzymes are biological catalysts that speed up chemical reactions in living organisms.",
                "examples": "Example: The enzyme amylase breaks down starch into simpler sugars.",
                "quiz": [
                    {
                        "question": "What is an enzyme?",
                        "options": ["Protein", "Carbohydrate", "Lipid", "Nucleic acid"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is the role of an enzyme?",
                        "options": ["Energy storage", "Reaction catalysis", "DNA replication", "Cell division"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What is the active site of an enzyme?",
                        "options": ["Energy storage site", "Reaction site", "DNA binding site", "Cell division site"],
                        "correct_answer": 1
                    },
                    {
                        "question": "What affects enzyme activity?",
                        "options": ["Temperature and pH", "Light and sound", "Pressure and volume", "Color and shape"],
                        "correct_answer": 0
                    },
                    {
                        "question": "What is enzyme specificity?",
                        "options": ["Ability to work at any temperature", "Ability to catalyze specific reactions", "Ability to store energy", "Ability to replicate DNA"],
                        "correct_answer": 1
                    }
                ]
            }
        ]
    }
] 