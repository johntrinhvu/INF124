from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import uuid
from models.quiz import Quiz, Question, QuizSubmission, COURSE_QUESTIONS
from models.course import Course
from database import get_database
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/quizzes/{course_title}")
async def get_quiz(course_title: str):
    try:
        logger.info(f"Fetching quiz for course: {course_title}")
        
        # Get the database
        db = await get_database()
        
        # Find the course by title
        course = await db.courses.find_one({"title": course_title})
        if not course:
            logger.error(f"Course not found: {course_title}")
            raise HTTPException(status_code=404, detail="Course not found")
        
        logger.info(f"Found course: {course['title']} (ID: {course['id']})")
        
        # Get questions for the course
        questions = COURSE_QUESTIONS.get(course['title'])
        if not questions:
            logger.error(f"No questions found for course: {course['title']}")
            raise HTTPException(status_code=404, detail="No questions found for this course")
        
        logger.info(f"Found {len(questions)} questions for course: {course['title']}")
        
        # Create quiz object
        quiz = {
            "id": str(uuid.uuid4()),
            "course_id": course['id'],
            "title": f"{course['title']} Quiz",
            "description": f"Test your knowledge of {course['title']}",
            "questions": questions,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        logger.info(f"Created quiz with ID: {quiz['id']}")
        return quiz
        
    except Exception as e:
        logger.error(f"Error creating quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quizzes/submit")
async def submit_quiz(submission: QuizSubmission):
    try:
        # Get the database
        db = await get_database()
        
        # Get the quiz
        quiz = await db.quizzes.find_one({"id": submission.quiz_id})
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Calculate score
        correct_answers = 0
        for i, answer in enumerate(submission.answers):
            if i < len(quiz['questions']) and answer == quiz['questions'][i]['correct_answer']:
                correct_answers += 1
        
        score = (correct_answers / len(quiz['questions'])) * 100
        
        return {
            "score": score,
            "correct_answers": correct_answers,
            "total_questions": len(quiz['questions'])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 