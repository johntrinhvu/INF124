from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user import router as user_router
from routes.courses import router as courses_router
from routes.quizzes import router as quizzes_router
from database import initialize_courses
import logging

logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(courses_router, prefix="/api", tags=["courses"])
app.include_router(quizzes_router, prefix="/api", tags=["quizzes"])

@app.on_event("startup")
async def startup_event():
    try:
        await initialize_courses()
    except Exception as e:
        logger.error(f"Failed to initialize courses: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI User Management API"}
