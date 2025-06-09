from fastapi import APIRouter, HTTPException
from typing import List
from models.course import Course, INITIAL_COURSES
from database import get_database
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/courses", response_model=List[Course])
async def get_courses():
    try:
        db = await get_database()
        courses = await db.courses.find().to_list(length=None)
        logger.info(f"Retrieved {len(courses)} courses")
        return courses
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch courses")

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
        # Delete all existing courses
        await db.courses.delete_many({})
        logger.info("Deleted all existing courses")
        
        # Insert initial courses
        result = await db.courses.insert_many(INITIAL_COURSES)
        logger.info(f"Reinitialized {len(result.inserted_ids)} courses")
        return {"message": f"Successfully reinitialized {len(result.inserted_ids)} courses"}
    except Exception as e:
        logger.error(f"Error reinitializing courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to reinitialize courses") 