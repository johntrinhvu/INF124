from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import uuid
from models.quiz import Quiz, Question, QuizSubmission, COURSE_QUESTIONS
from models.course import Course
from database import get_database
import logging
from bson import ObjectId
from models.user import QuizAccuracy
from auth import get_current_user

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

@router.get("/quizzes/accuracy/{username}")
async def get_quiz_accuracy(username: str):
    try:
        db = await get_database()
        # user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        user = await db.users.find_one({"username": username})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        quiz_accuracy = user.get("quiz_accuracy", [])
        total_quizzes = user.get("total_quizzes_completed", 0)
        average_score = user.get("average_score", 0)
        
        return {
            "quiz_accuracy": quiz_accuracy,
            "total_quizzes_completed": total_quizzes,
            "average_score": average_score
        }
        
    except Exception as e:
        logger.error(f"Error fetching quiz accuracy: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching quiz accuracy: {str(e)}")

@router.get("/quizzes/{course_title}")
async def get_quiz(course_title: str):
    try:
        logger.info(f"Fetching quiz for course: {course_title}")
        
        db = await get_database()
        course = await db.courses.find_one({"title": course_title})
        if not course:
            logger.error(f"Course not found: {course_title}")
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Get or create quiz for the course
        quiz = await db.quizzes.find_one({"course_id": str(course["_id"])})
        if not quiz:
            # Create a new quiz if it doesn't exist
            quiz = {
                "id": str(uuid.uuid4()),
                "course_id": str(course["_id"]),
                "questions": COURSE_QUESTIONS.get(course_title, [])
            }
            await db.quizzes.insert_one(quiz)
        
        return convert_objectid_to_str(quiz)
        
    except Exception as e:
        logger.error(f"Error fetching quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching quiz: {str(e)}")

@router.post("/quizzes/{course_id}/submit")
async def submit_quiz(course_id: str, submission: QuizSubmission, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Received quiz submission for course {course_id}")
        logger.info(f"Current user data: {current_user}")
        logger.info(f"Submission data: {submission.dict()}")
        
        db = await get_database()
        course = await db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            logger.error(f"Course not found: {course_id}")
            raise HTTPException(status_code=404, detail="Course not found")
        
        logger.info(f"Found course: {course['title']}")
        
        # Calculate score
        correct_answers = 0
        total_questions = 0
        
        # Count total questions across all lessons
        for lesson in course.get("lessons", []):
            if "quiz" in lesson:
                total_questions += len(lesson["quiz"])
        
        logger.info(f"Total questions in course: {total_questions}")
        
        # Process each answer
        for q_idx_str, selected_ans_idx in submission.answers.items():
            q_idx = int(q_idx_str)
            lesson_number = (q_idx // 5) + 1  # Calculate lesson number based on question index
            question_index = q_idx % 5  # Get question index within the lesson
            
            # Find the corresponding lesson and question
            for lesson in course.get("lessons", []):
                if lesson.get("lesson_number") == lesson_number and "quiz" in lesson:
                    if question_index < len(lesson["quiz"]):
                        question = lesson["quiz"][question_index]
                        correct_answer_index = question["correct_answer"]
                        
                        logger.info(f"\nQuestion {q_idx}:")
                        logger.info(f"Submitted answer index: {selected_ans_idx}")
                        logger.info(f"Correct answer index: {correct_answer_index}")
                        logger.info(f"Options: {question['options']}")
                        
                        if selected_ans_idx == correct_answer_index:
                            correct_answers += 1
                            logger.info("Answer is correct!")
                        else:
                            logger.info("Answer is incorrect")
                    break
        
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        logger.info(f"\nFinal score calculation:")
        logger.info(f"Correct answers: {correct_answers}")
        logger.info(f"Total questions: {total_questions}")
        logger.info(f"Score: {score}%")
        
        # Create quiz accuracy record
        quiz_accuracy = QuizAccuracy(
            quiz_id=course_id,
            course_title=course["title"],
            score=score,
            answers={str(k): str(v) for k, v in submission.answers.items()}  # Convert both keys and values to strings
        )
        
        # Get current user data for stats calculation
        user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user's quiz accuracy and stats
        await db.users.update_one(
            {"_id": ObjectId(current_user["id"])},
            {
                "$push": {"quiz_accuracy": quiz_accuracy.dict()},
                "$inc": {"total_quizzes_completed": 1},
                "$set": {
                    "average_score": (
                        (user.get("average_score", 0) * user.get("total_quizzes_completed", 0) + score) /
                        (user.get("total_quizzes_completed", 0) + 1)
                    )
                }
            }
        )
        
        logger.info(f"Updated user's quiz accuracy and stats")
        
        return {
            "score": score,
            "correct_answers": correct_answers,
            "total_questions": total_questions
        }
        
    except Exception as e:
        logger.error(f"Error submitting quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error submitting quiz: {str(e)}") 