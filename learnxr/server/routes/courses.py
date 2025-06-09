from fastapi import APIRouter, HTTPException
from typing import List
from models.course import Course, INITIAL_COURSES
from database import get_database
from bson import ObjectId
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

def convert_objectid_to_str(obj):
    if isinstance(obj, dict):
        return {k: convert_objectid_to_str(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid_to_str(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj

@router.get("/courses")
async def get_courses():
    try:
        db = await get_database()
        courses = await db.courses.find().to_list(length=None)
        logger.info(f"Retrieved {len(courses)} courses")
        return convert_objectid_to_str(courses)
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching courses")

@router.get("/courses/{course_title}")
async def get_course(course_title: str):
    try:
        db = await get_database()
        # Use regex to match the course title case-insensitively
        course = await db.courses.find_one({"title": {"$regex": f"^{course_title}$", "$options": "i"}})
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Convert ObjectId to string and ensure all fields are properly formatted
        course_data = convert_objectid_to_str(course)
        
        # Ensure lessons are properly formatted
        if "lessons" in course_data:
            for lesson in course_data["lessons"]:
                if "quiz" in lesson:
                    for question in lesson["quiz"]:
                        # Ensure correct_answer is an integer
                        if isinstance(question.get("correct_answer"), str):
                            question["correct_answer"] = int(question["correct_answer"])
        
        return course_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching course: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching course")

@router.get("/courses/debug")
async def debug_courses():
    try:
        db = await get_database()
        courses = await db.courses.find().to_list(length=None)
        logger.info(f"Debug: Retrieved {len(courses)} courses")
        return {
            "count": len(courses),
            "courses": courses
        }
    except Exception as e:
        logger.error(f"Error in debug route: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/courses/initialize")
async def initialize_courses():
    try:
        db = await get_database()
        # Check if courses already exist
        existing_courses = await db.courses.find().to_list(length=1)
        if existing_courses:
            logger.info("Courses already exist, skipping initialization")
            return {"message": "Courses already initialized"}
        
        # Insert initial courses
        result = await db.courses.insert_many(INITIAL_COURSES)
        logger.info(f"Initialized {len(result.inserted_ids)} courses")
        return {"message": f"Successfully initialized {len(result.inserted_ids)} courses"}
    except Exception as e:
        logger.error(f"Error initializing courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize courses")

@router.post("/courses/reinitialize")
async def reinitialize_courses():
    try:
        db = await get_database()
        # Drop existing courses
        await db.courses.drop()
        # Insert new courses
        result = await db.courses.insert_many(INITIAL_COURSES)
        logger.info(f"Successfully reinitialized {len(result.inserted_ids)} courses")
        return {"message": f"Successfully reinitialized {len(result.inserted_ids)} courses"}
    except Exception as e:
        logger.error(f"Error reinitializing courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Error reinitializing courses") 