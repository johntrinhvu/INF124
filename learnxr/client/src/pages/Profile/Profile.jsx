import './Profile.css';
import GenericAvatar from "../../assets/GenericAvatar.png";
import AboutCard from "../../components/ProfileCards/AboutCard";
import { Link } from "react-router-dom";
import QuizAccuracyCard from "../../components/DashboardCards/QuizAccuracyCard/QuizAccuracyCard";
import QuizzesCompletedCard from '../../components/DashboardCards/QuizzesCompletedCard/QuizzesCompletedCard';
import CurrentStreakCard from '../../components/DashboardCards/CurrentStreakCard/CurrentStreakCard';



export default function Profile() {
    return (
        <div className="min-h-screen pt-[120px] bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white px-4 py-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">


                <div className="bg-[#3b348b] p-6 rounded-xl flex flex-col items-center space-y-4">
                    <button className="border border-white text-white py-1 px-4 w-full text-sm">Share Profile</button>
                    <button className="border border-white text-white py-1 px-4 w-full text-sm">Edit Profile</button>
                    <img
                        src={GenericAvatar}
                        alt="ProfilePic"
                        className="w-24 h-24 rounded-full border-2 border-white"
                    />
                    <h2 className="text-xl font-semibold">John Doe</h2>
                    <p className="text-sm">Role: Student</p>
                    <p className="text-sm">Joined Date: 2025</p>
                    <Link to= "/faq" className="border border-white text-white py-1 px-4 w-full text-sm">FAQ</Link>
                    <Link to= "/settings" className="border border-white text-white py-1 px-4 w-full text-sm">Account Settings</Link>
                </div>




                <div className="lg:col-span-3 space-y-8">
                    <AboutCard />


                    <div>
                        <h3 className="text-xl mb-2 font-semibold">Learning Stats</h3>
                        <div className="border-dashed border-2 border-gray-400 p-10 rounded-md text-center text-gray-400">
                            <QuizAccuracyCard />
                            <QuizzesCompletedCard />
                            <div className="md:col-span-2">
                                <CurrentStreakCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
