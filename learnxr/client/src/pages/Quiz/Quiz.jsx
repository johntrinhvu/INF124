import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { getToken } from '../../utils/auth';

export default function Quiz() {
    const navigate = useNavigate();
    const { courseTitle } = useParams();
    const location = useLocation();
    const courseTitleFromState = location.state?.courseTitle;

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(null);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // Decode the URL-friendly title back to the original title
                const decodedTitle = decodeURIComponent(courseTitle).replace(/-/g, ' ');
                console.log('Decoded course title:', decodedTitle);
                console.log('Course title from state:', courseTitleFromState);
                
                // First verify the course exists
                const courseResponse = await axios.get(`http://localhost:8000/api/courses`);
                const course = courseResponse.data.find(c => 
                    c.title.toLowerCase() === decodedTitle.toLowerCase()
                );
                
                if (!course) {
                    console.error('Course not found in database:', decodedTitle);
                    setError('Course not found. Please try again from the dashboard.');
                    setLoading(false);
                    return;
                }

                console.log('Found course in database:', course);
                
                // Then fetch the quiz using the course title
                const response = await axios.get(`http://localhost:8000/api/quizzes/${course.title}`);
                console.log('Quiz response:', response.data);
                setQuiz(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching quiz:', error.response?.data || error.message);
                setError(error.response?.data?.detail || 'Failed to load quiz. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (courseTitle) {
            console.log('Course title from URL:', courseTitle);
            fetchQuiz();
        } else {
            console.error('No course title in URL');
            setError('No course selected');
            setLoading(false);
        }
    }, [courseTitle, courseTitleFromState]);

    const handleSelect = (index) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentIndex]: index
        }));
    };

    const handleNext = () => {
        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = getToken();
            if (!token) {
                setError('You must be logged in to submit the quiz');
                return;
            }

            // Convert selectedAnswers to the correct format with string values
            const formattedAnswers = {};
            Object.entries(selectedAnswers).forEach(([index, answer]) => {
                // Get the actual answer text from the question options
                const question = quiz.questions[parseInt(index)];
                const selectedAnswer = question.options[parseInt(answer)];
                formattedAnswers[index.toString()] = selectedAnswer;
            });

            console.log('Submitting answers:', formattedAnswers);

            const response = await axios.post(
                `http://localhost:8000/api/quizzes/${quiz.id}/submit`,
                {
                    answers: formattedAnswers
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Submit response:', response.data);
            setScore(response.data.score);
            setQuizCompleted(true);
        } catch (error) {
            console.error('Error submitting quiz:', error.response?.data || error);
            setError('Failed to submit quiz. Please try again.');
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    if (loading) {
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

    if (quizCompleted) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex justify-center items-start px-4">
                <div className="bg-[#3b348b] p-8 rounded-xl w-full max-w-2xl text-center">
                    <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                    <p className="text-xl mb-2">Your Score: {score}%</p>
                    <button
                        onClick={handleClose}
                        className="bg-[#b0aaff] text-[#0a0a23] px-6 py-2 rounded-lg hover:bg-[#9b8fff] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!quiz || !quiz.questions) {
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

    const currentQuestion = quiz.questions[currentIndex];
    const progressWidth = `${(currentIndex + 1) / quiz.questions.length * 100}%`;

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
                <h1 className="text-center text-2xl font-bold mb-4">{courseTitleFromState}</h1>

                {/* Question Number */}
                <div className="text-center text-lg font-medium mb-2">
                    Question {currentIndex + 1} / {quiz.questions.length}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-gray-300 rounded-full mb-6">
                    <div
                        className="h-4 bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: progressWidth }}
                    />
                </div>

                <h2 className="text-center text-xl font-semibold mb-6">{currentQuestion.text}</h2>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`flex items-center w-full py-3 px-4 rounded-md transition
                                ${selectedAnswers[currentIndex] === i
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            <div className={`border-2 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4
                                ${selectedAnswers[currentIndex] === i
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
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className={`px-6 py-2 rounded ${
                            currentIndex === 0
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
                        {currentIndex === quiz.questions.length - 1 ? "Submit" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}