import './Dashboard.css'
import { Link } from 'react-router-dom';
import QuizAccuracyCard from "../../components/DashboardCards/QuizAccuracyCard/QuizAccuracyCard";
import QuizzesCompletedCard from '../../components/DashboardCards/QuizzesCompletedCard/QuizzesCompletedCard';
import CurrentStreakCard from '../../components/DashboardCards/CurrentStreakCard/CurrentStreakCard';
import CourseCard from '../../components/DashboardCards/CourseCard/CourseCard';

export default function Dashboard() {
    return (
        <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">
            <h1 className="text-4xl mb-4">Dashboard</h1>
            <p className="text-3xl text-[#b0aaff] mb-6">Welcome, John Doe</p>
            <p className="text-3xl text-left p-2">Courses</p>
            <div className="relative p-2 z-0">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pr-16">
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                </div>
                <div className="bg-gradient-to-r from-white/0 to-[#0F0D2D] pointer-events-none absolute right-0 top-0 h-full w-1/4 max-w-40 " />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <QuizAccuracyCard />
                <QuizzesCompletedCard />
                <div className="md:col-span-2">
                    <CurrentStreakCard />
                </div>
            </div>
            <div className="pt-6">
                <Link to="/quiz">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white text-xl font-semibold px-16 py-6 rounded transition" >
                        Start a Quiz
                    </button>
                </Link>
            </div>

        </div>
    );
}
