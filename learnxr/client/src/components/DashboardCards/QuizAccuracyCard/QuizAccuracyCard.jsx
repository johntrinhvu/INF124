import "./QuizAccuracyCard.css"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../../utils/auth';
import { useParams } from 'react-router-dom';

export default function QuizAccuracyCard() {
    const { username: routeUsername } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizAccuracy = async () => {
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
                console.error('Error fetching quiz accuracy:', err);
                setError('Failed to load quiz accuracy');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAccuracy();
    }, [routeUsername]);

    if (loading) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 min-h-[250px] w-full">
                <h2 className="text-xl mb-4">Quiz Accuracy</h2>
                <div className="animate-pulse">
                    <div className="h-12 bg-[#1E1B4B] rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-[#1E1B4B] rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 min-h-[250px] w-full">
                <h2 className="text-xl mb-4">Quiz Accuracy</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Get the last 5 quiz scores for the graph
    const recentScores = quizData?.quiz_accuracy?.slice(-5).map(qa => qa.score) || [];
    const maxScore = Math.max(...recentScores, 100); // Ensure we have at least 100 as max
    
    // Generate points string
    let pointsString = '';
    if (recentScores.length > 0) {
        pointsString = recentScores.map((score, index) => {
            const x = (index / (recentScores.length - 1 || 1)) * 100;
            const y = 40 - (score / maxScore) * 35;
            return x + ',' + y;
        }).join(' ');
    }

    return (
        <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 min-h-[250px] w-full">
            <h2 className="text-xl mb-4">Quiz Accuracy</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between h-full">
                <div className="text-center">
                    <p className="text-5xl font-bold">{Math.round(quizData?.average_score || 0)}%</p>
                    <p className="text-sm text-[#b0aaff] mt-2">Average Score</p>
                </div>
                <div className="w-full md:w-2/3 ml-auto h-32">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                        <polyline
                            fill="none"
                            stroke="#9690C4"
                            strokeWidth="2"
                            points={pointsString}
                        />
                        {recentScores.map((score, index) => {
                            const x = (index / (recentScores.length - 1 || 1)) * 100;
                            const y = 40 - (score / maxScore) * 35;
                            return (
                                <circle
                                    key={index}
                                    cx={x}
                                    cy={y}
                                    r="2"
                                    fill="#b0aaff"
                                />
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}

