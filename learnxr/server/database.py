from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging
from models.course import INITIAL_COURSES

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL")
if not MONGODB_URL:
    raise ValueError("MONGODB_URL environment variable is not set")

try:
    client = AsyncIOMotorClient(MONGODB_URL)
    # Test the connection
    client.admin.command('ping')
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

db = client.learnxr

async def get_database():
    try:
        return db
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise

async def initialize_courses():
    try:
        # Check if courses already exist
        existing_courses = await db.courses.find().to_list(length=1)
        if not existing_courses:
            # Insert initial courses
            result = await db.courses.insert_many(INITIAL_COURSES)
            logger.info(f"Initialized {len(result.inserted_ids)} courses")
        else:
            logger.info("Courses already exist, skipping initialization")
    except Exception as e:
        logger.error(f"Error initializing courses: {str(e)}")
        raise 