import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../../utils/auth';
import { useParams } from 'react-router-dom';
import './RecentQuizzesCard.css';

export default function RecentQuizzesCard() {
    const { username: routeUsername } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const token = getToken();
                const currentUser = getUser();
                const username = currentUser?.username;

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
    }, []);

    if (loading) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
                <h2 className="text-xl mb-4">Recent Quizzes</h2>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-[#1E1B4B] rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
                <h2 className="text-xl mb-4">Recent Quizzes</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const recentQuizzes = quizData?.quiz_accuracy?.slice(-5).reverse() || [];

    return (
        <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
            <h2 className="text-xl mb-4">Recent Quizzes</h2>
            <div className="space-y-4">
                {recentQuizzes.length === 0 ? (
                    <p className="text-[#b0aaff] text-center">No quizzes completed yet</p>
                ) : (
                    recentQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-[#1E1B4B] rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{quiz.course_title}</h3>
                                    <p className="text-sm text-[#b0aaff]">
                                        {new Date(quiz.submitted_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">{Math.round(quiz.score)}%</p>
                                    <p className="text-sm text-[#b0aaff]">Score</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 