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
        navigate(`/quizzes/${encodeURIComponent(courseTitle)}`);
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
                                <h3 className="text-xl font-semibold mb-3">{lesson.title}</h3>
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
                        Take Quiz Now
                    </button>
                </div>
            </div>
        </div>
    );
}