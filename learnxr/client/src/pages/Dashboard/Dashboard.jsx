import './Dashboard.css'
import { Link } from 'react-router-dom';
import QuizAccuracyCard from "../../components/DashboardCards/QuizAccuracyCard/QuizAccuracyCard";
import QuizzesCompletedCard from '../../components/DashboardCards/QuizzesCompletedCard/QuizzesCompletedCard';
import CurrentStreakCard from '../../components/DashboardCards/CurrentStreakCard/CurrentStreakCard';
import RecentQuizzesCard from '../../components/DashboardCards/RecentQuizzesCard/RecentQuizzesCard';
import CourseCard from '../../components/DashboardCards/CourseCard/CourseCard';
import { getUser } from '../../utils/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/courses?t=${Date.now()}`);
            
            // Clear any existing courses before setting new ones
            setCourses([]);
            setCourses(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch courses. Please refresh the page.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = getUser();
        setUser(userData);
        fetchCourses();
        
        // Set up periodic refresh every 30 seconds
        const intervalId = setInterval(fetchCourses, 30000);
        return () => clearInterval(intervalId);
    }, []); 

    if (!user) {
        return null; 
    }

    if (loading) {
        return <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">Loading courses...</div>;
    }

    return (
        <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">
            <h1 className="text-4xl mb-4">Dashboard</h1>
            <p className="text-3xl text-[#b0aaff] mb-6">Welcome, {user.username}</p>
            {error && (
                <p className="text-red-500 mt-4">{error}</p>
            )}
            <p className="text-3xl text-left px-2 py-1 mt-8">Courses</p>
            <div className="relative p-2 z-0">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pr-16">
                    {courses.length === 0 ? (
                        <p className="text-[#b0aaff]">No courses available</p>
                    ) : (
                        courses.map((course) => {
                            return (
                                <CourseCard 
                                    key={course.id}
                                    id={course.id}
                                    title={course.title}
                                    description={course.description}
                                    category={course.category}
                                    difficulty={course.difficulty}
                                    lessons={course.lessons}
                                />
                            );
                        })
                    )}
                </div>
                <div className="bg-gradient-to-r from-white/0 to-[#0F0D2D] pointer-events-none absolute right-0 top-0 h-full w-1/4 max-w-40 " />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div key="quiz-accuracy">
                    <QuizAccuracyCard />
                </div>
                <div key="quizzes-completed">
                    <QuizzesCompletedCard />
                </div>
                <div key="recent-quizzes" className="md:col-span-2">
                    <RecentQuizzesCard />
                </div>
                <div key="current-streak" className="md:col-span-2">
                    <CurrentStreakCard />
                </div>
            </div>
        </div>
    );
}
