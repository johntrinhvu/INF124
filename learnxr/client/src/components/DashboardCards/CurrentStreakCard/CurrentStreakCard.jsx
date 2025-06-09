import './CurrentStreakCard.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../../utils/auth';
import { useParams } from 'react-router-dom';

export default function CurrentStreakCard() {
    const { username: routeUsername } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getToken();
                const currentUser = getUser();
                const username = routeUsername || currentUser?.username;
                
                if (!token) {
                    console.log('No token found'); // Debug log
                    setError('Not authenticated');
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/users/username/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load streak data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [routeUsername]);

    if (loading) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
                <h2 className="text-xl mb-4">Current Streak</h2>
                <div className="animate-pulse">
                    <div className="h-12 bg-[#1E1B4B] rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-[#1E1B4B] rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
                <h2 className="text-xl mb-4">Current Streak</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const currentStreak = userData?.current_streak || 0;
    const longestStreak = userData?.longest_streak || 0;
    const loginHistory = userData?.login_history || [];

    // Get the last 7 days of login history
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    // Create a map of dates to streak counts
    const streakMap = new Map(
        loginHistory.map(entry => [
            new Date(entry.date).toISOString().split('T')[0],
            entry.streak_count
        ])
    );

    return (
        <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
            <h2 className="text-xl mb-4">Current Streak</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="text-center">
                    <p className="text-5xl font-bold">{currentStreak}</p>
                    <p className="text-sm text-[#b0aaff] mt-2">Current Streak</p>
                    <p className="text-sm text-[#b0aaff] mt-1">Longest: {longestStreak} days</p>
                </div>
                <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-7 gap-2">
                        {last7Days.map((date, index) => {
                            const hasLoggedIn = streakMap.has(date);
                            const streakCount = streakMap.get(date) || 0;
                            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                            
                            return (
                                <div key={date} className="text-center">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1
                                        ${hasLoggedIn ? 'bg-[#9690C4]' : 'bg-[#1E1B4B]'}`}>
                                        {hasLoggedIn ? '✓' : ''}
                                    </div>
                                    <p className="text-xs text-[#b0aaff]">{dayName}</p>
                                    {hasLoggedIn && (
                                        <p className="text-xs text-[#b0aaff]">{streakCount}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
