import './Dashboard.css'

import QuizAccuracyCard from "../../components/DashboardCards/QuizAccuracyCard/QuizAccuracyCard";
import QuizzesCompletedCard from '../../components/DashboardCards/QuizzesCompletedCard/QuizzesCompletedCard';
import CurrentStreakCard from '../../components/DashboardCards/CurrentStreakCard/CurrentStreakCard';

export default function Dashboard() {
    return (
        <div className="bg-[#0F0D2D] min-h-screen pt-24 p-6 text-white">
            <h1 className="text-4xl mb-4">Dashboard</h1>
            <p className="text-3xl text-[#b0aaff] mb-6">Welcome, John Doe</p>
            <div className="grid md:grid-cols-2 gap-4">
                <QuizAccuracyCard />
                <QuizzesCompletedCard />
                <div className="md:col-span-2">
                    <CurrentStreakCard />
                </div>
            </div>
        </div>
    );
}
