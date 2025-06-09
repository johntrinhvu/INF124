import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken, isAuthenticated } from '../../utils/auth';
import './Quiz.css';

export default function Quiz() {
    const API = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();
    const { courseTitle } = useParams();
    const location = useLocation();
    const courseTitleFromState = location.state?.courseTitle;
    const courseIdFromState = location.state?.courseId;

    const [course, setCourse] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        const fetchCourseAndQuiz = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const titleToUse = courseTitleFromState || courseTitle;
                
                const response = await fetch(`${API}/api/courses/${encodeURIComponent(titleToUse)}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch course data');
                }
                const courseData = await response.json();
                
                setCourse(courseData);
                
                // Combine all lesson quizzes into one
                const allQuestions = courseData.lessons.reduce((acc, lesson) => {
                    if (lesson.quiz && Array.isArray(lesson.quiz)) {
                        return [...acc, ...lesson.quiz];
                    }
                    return acc;
                }, []);
                
                setQuestions(allQuestions);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseAndQuiz();
    }, [courseTitle, courseTitleFromState, navigate]);

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            if (!isAuthenticated()) {
                navigate('/login');
                return;
            }

            const token = getToken();
            if (!token) {
                throw new Error('You must be logged in to submit the quiz');
            }

            // Use course ID from state if available, otherwise use from course data
            const courseId = courseIdFromState || (course && course._id);
            
            if (!courseId) {
                console.error('Course ID is missing:', {
                    courseIdFromState,
                    courseIdFromData: course?._id,
                    course
                });
                throw new Error('Course information is missing');
            }

            const response = await fetch(`${API}/api/quizzes/${courseId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    answers: Object.fromEntries(
                        Object.entries(selectedAnswers).map(([key, value]) => [key, value.toString()])
                    )
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Your session has expired. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to submit quiz');
            }

            const result = await response.json();
            setScore(result);
        } catch (err) {
            console.error('Error submitting quiz:', err);
            setError(err.message);
            if (err.message.includes('session has expired')) {
                navigate('/login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    if (score !== null) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex justify-center items-start px-4">
                <div className="bg-[#3b348b] p-8 rounded-xl w-full max-w-2xl text-center">
                    <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
                    <div className="mb-8">
                        <p className="text-6xl font-bold mb-2">{Math.round(score.score)}%</p>
                        <p className="text-[#b0aaff]">Your Score</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#242452] p-4 rounded-lg">
                            <p className="text-2xl font-bold">{score.correct_answers}</p>
                            <p className="text-[#b0aaff]">Correct Answers</p>
                        </div>
                        <div className="bg-[#242452] p-4 rounded-lg">
                            <p className="text-2xl font-bold">{score.total_questions}</p>
                            <p className="text-[#b0aaff]">Total Questions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex justify-center items-start px-4">
                <div className="bg-[#3b348b] p-8 rounded-xl w-full max-w-2xl text-center">
                    <p className="text-xl">Loading quiz...</p>
                    <p className="text-sm text-gray-400 mt-2">Please wait while we prepare your questions</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex justify-center items-start px-4">
                <div className="bg-[#3b348b] p-8 rounded-xl w-full max-w-2xl text-center">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button
                        onClick={handleClose}
                        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!course || !questions.length) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex justify-center items-start px-4">
                <div className="bg-[#3b348b] p-8 rounded-xl w-full max-w-2xl text-center">
                    <p className="text-red-500">Failed to load quiz questions</p>
                    <button
                        onClick={handleClose}
                        className="mt-4 bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressWidth = `${(currentQuestionIndex + 1) / questions.length * 100}%`;

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex justify-center items-start px-4">
            <div className="bg-[#3b348b] p-8 rounded-xl w-full max-w-2xl relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-xl bg-[#999] text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
                >
                    ×
                </button>

                {/* Course Title */}
                <h1 className="text-center text-2xl font-bold mb-2">{courseTitleFromState}</h1>
                
                {/* Lesson Info */}
                <div className="text-center text-[#b0aaff] mb-4">
                    Lesson {currentQuestion.lessonNumber}: {currentQuestion.lessonTitle}
                </div>

                {/* Question Number */}
                <div className="text-center text-lg font-medium mb-2">
                    Question {currentQuestionIndex + 1} / {questions.length}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-gray-300 rounded-full mb-6">
                    <div
                        className="h-4 bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: progressWidth }}
                    />
                </div>

                <h2 className="text-center text-xl font-semibold mb-6">{currentQuestion.question}</h2>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, i)}
                            className={`flex items-center w-full py-3 px-4 rounded-md transition
                                ${selectedAnswers[currentQuestionIndex] === i
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            <div className={`border-2 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4
                                ${selectedAnswers[currentQuestionIndex] === i
                                    ? "border-white text-white bg-purple-600"
                                    : "border-blue-600 text-blue-600"
                                }`}
                            >
                                {String.fromCharCode(65 + i)}
                            </div>
                            {option}
                        </button>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleClose}
                        disabled={currentQuestionIndex === 0}
                        className={`px-6 py-2 rounded ${
                            currentQuestionIndex === 0
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded"
                    >
                        {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}