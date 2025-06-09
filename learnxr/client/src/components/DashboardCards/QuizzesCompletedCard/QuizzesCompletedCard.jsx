import "./QuizzesCompletedCard.css"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../../utils/auth';
import { useParams } from 'react-router-dom';

export default function QuizzesCompletedCard() {
    const { username: routeUsername } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const token = getToken();
                const currentUser = getUser();
                const username = routeUsername || currentUser?.username;

                if (!token) {
                    setError('Not authenticated');
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/quizzes/accuracy/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setQuizData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching quiz data:', err);
                setError('Failed to load quiz data');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [routeUsername]);

    if (loading) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
                <h2 className="text-xl mb-4">Quizzes Completed</h2>
                <div className="animate-pulse">
                    <div className="h-12 bg-[#1E1B4B] rounded w-1/4 mb-4"></div>
                    <div className="h-16 bg-[#1E1B4B] rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
                <h2 className="text-xl mb-4">Quizzes Completed</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const totalQuizzes = quizData?.total_quizzes_completed || 0;
    const recentQuizzes = quizData?.quiz_accuracy?.slice(-3) || [];
    const heights = recentQuizzes.map(qa => (qa.score / 100) * 16); // Scale heights to max 16

    return (
        <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
            <h2 className="text-xl mb-4">Quizzes Completed</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="text-center">
                    <p className="text-5xl font-bold">{totalQuizzes}</p>
                    <p className="text-sm text-[#b0aaff] mt-2">Total Quizzes</p>
                </div>
                <div className="h-16 w-1/2 flex items-end justify-end gap-[6px] pb-2 pr-2">
                    {heights.map((height, index) => (
                        <div
                            key={index}
                            className="w-10 bg-[#9690C4] rounded transition-all duration-300"
                            style={{ height: `${height}px` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
