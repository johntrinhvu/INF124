import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Course.css';
import SampleCoursePhoto from "../../assets/SampleCoursePhoto.png";

export default function Course() {
    const { courseTitle } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/courses/${encodeURIComponent(courseTitle)}`);
                setCourse(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching course:', error);
                setError('Failed to load course content. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseTitle]);

    const handleTakeQuiz = () => {
        if (!course || !course._id) {
            console.error('Course data is missing:', course);
            return;
        }
        
        console.log('Navigating to quiz with course data:', {
            title: course.title,
            id: course._id
        });
        
        navigate(`/quizzes/${encodeURIComponent(courseTitle)}`, {
            state: {
                courseTitle: course.title,
                courseId: course._id
            }
        });
    };

    if (loading) {
        return (
            <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">
                <div className="animate-pulse">
                    <div className="h-8 bg-[#1E1B4B] rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-[#1E1B4B] rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-[#1E1B4B] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#1E1B4B] rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">
                <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
                    <p className="text-yellow-500">Course not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">
            <div className="max-w-4xl mx-auto">
                {/* Course Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                    <div className="flex items-center space-x-4 text-[#b0aaff]">
                        <span className="px-3 py-1 bg-[#1E1B4B] rounded-full text-sm">
                            {course.category}
                        </span>
                        <span className="px-3 py-1 bg-[#1E1B4B] rounded-full text-sm">
                            {course.difficulty}
                        </span>
                    </div>
                </div>

                {/* Course Description */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
                    <p className="text-[#b0aaff] leading-relaxed">{course.description}</p>
                </div>

                {/* Course Content */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
                    <div className="space-y-6">
                        {course.lessons?.map((lesson, index) => (
                            <div key={index} className="bg-[#1E1B4B] rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <span className="w-8 h-8 bg-[#3b348b] rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                                        {lesson.lesson_number}
                                    </span>
                                    <h3 className="text-xl font-semibold">{lesson.title}</h3>
                                </div>
                                <p className="text-[#b0aaff] mb-4">{lesson.content}</p>
                                {lesson.examples && (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-medium mb-2">Examples</h4>
                                        <div className="bg-[#0F0D2D] rounded p-4">
                                            <pre className="text-[#b0aaff] whitespace-pre-wrap">
                                                {lesson.examples}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                                {lesson.quiz && (
                                    <div className="mt-6 border-t border-[#3b348b] pt-4">
                                        <h4 className="text-lg font-medium mb-3">Lesson Quiz</h4>
                                        <p className="text-[#b0aaff] mb-4">
                                            This lesson includes a quiz with {lesson.quiz.length} questions to test your understanding.
                                        </p>
                                        <div className="bg-[#0F0D2D] rounded p-4">
                                            <h5 className="font-medium mb-2">Sample Question:</h5>
                                            <p className="text-[#b0aaff]">{lesson.quiz[0].question}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quiz Button */}
                <div className="text-center">
                    <button
                        onClick={handleTakeQuiz}
                        className="bg-[#b0aaff] text-[#0F0D2D] px-8 py-3 rounded-lg font-semibold hover:bg-[#9d93ff] transition-colors"
                    >
                        Take Course Quiz
                    </button>
                    <p className="text-[#b0aaff] mt-2 text-sm">
                        Test your knowledge with {course.lessons?.reduce((total, lesson) => total + (lesson.quiz?.length || 0), 0)} questions
                    </p>
                </div>
            </div>
        </div>
    );
}