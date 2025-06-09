import './Profile.css';
import GenericAvatar from "../../assets/GenericAvatar.png";
import AboutCard from "../../components/ProfileCards/AboutCard";
import { Link, useParams, useNavigate } from "react-router-dom";
import QuizAccuracyCard from "../../components/DashboardCards/QuizAccuracyCard/QuizAccuracyCard";
import QuizzesCompletedCard from '../../components/DashboardCards/QuizzesCompletedCard/QuizzesCompletedCard';
import CurrentStreakCard from '../../components/DashboardCards/CurrentStreakCard/CurrentStreakCard';
import { getUser, isAuthenticated } from '../../utils/auth';
import { useEffect, useState } from 'react';

export default function Profile() {
    const API = process.env.REACT_APP_API_URL;

    const { username } = useParams();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showCopyNotification, setShowCopyNotification] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get the current logged-in user
                const loggedInUser = getUser();
                setCurrentUser(loggedInUser);

                // Fetch the profile user's data
                const response = await fetch(`${API}/api/users/username/${username}`);
                if (!response.ok) {
                    throw new Error('User not found');
                }
                const userData = await response.json();
                setProfileUser(userData);
                
                // Check if current user is following the profile user
                if (loggedInUser && userData.followers) {
                    setIsFollowing(userData.followers.includes(loggedInUser.username));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    const handleFollow = async () => {
        try {
            const response = await fetch(`${API}/api/users/username/${username}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to follow user');
            }

            // Update the profile user's data
            const updatedResponse = await fetch(`${API}/api/users/username/${username}`);
            if (updatedResponse.ok) {
                const updatedUser = await updatedResponse.json();
                setProfileUser(updatedUser);
                setIsFollowing(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUnfollow = async () => {
        try {
            const response = await fetch(`${API}/api/users/username/${username}/unfollow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to unfollow user');
            }

            // Update the profile user's data
            const updatedResponse = await fetch(`${API}/api/users/username/${username}`);
            if (updatedResponse.ok) {
                const updatedUser = await updatedResponse.json();
                setProfileUser(updatedUser);
                setIsFollowing(false);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleShareProfile = () => {
        const profileUrl = `${window.location.origin}/profile/${username}`;
        navigator.clipboard.writeText(profileUrl).then(() => {
            setShowCopyNotification(true);
            setTimeout(() => {
                setShowCopyNotification(false);
            }, 2000);
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-[120px] bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-[120px] bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Error</h1>
                <p className="text-xl mb-8">{error}</p>
                <Link 
                    to="/dashboard" 
                    className="bg-[#3F3FE8] hover:bg-[#7676e8] text-white font-semibold py-3 px-8 rounded-lg"
                >
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const isOwnProfile = currentUser && profileUser && currentUser.username === profileUser.username;

    return (
        <div className="min-h-screen pt-[120px] bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white px-4 py-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="bg-[#3b348b] p-6 rounded-xl flex flex-col items-center space-y-4 relative">
                    {isOwnProfile ? (
                        <>
                            <button 
                                onClick={handleShareProfile}
                                className="border border-white text-white py-1 px-4 w-full text-sm hover:bg-white hover:text-[#3b348b] transition-colors"
                            >
                                Share Profile
                            </button>
                            {showCopyNotification && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-green-500 text-white px-4 py-2 rounded-lg text-sm animate-fade-in-out">
                                    Copied!
                                </div>
                            )}
                            <button 
                                onClick={() => navigate(`/profile/${username}/settings`)}
                                className="border border-white text-white py-1 px-4 w-full text-sm hover:bg-white hover:text-[#3b348b] transition-colors"
                            >
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={isFollowing ? handleUnfollow : handleFollow}
                            className={`border ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-[#3F3FE8] hover:bg-[#7676e8]'} text-white py-1 px-4 w-full text-sm`}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                    <img
                        src={GenericAvatar}
                        alt="ProfilePic"
                        className="w-24 h-24 rounded-full border-2 border-white"
                    />
                    <h2 className="text-xl font-semibold">{profileUser.username}</h2>
                    <p className="text-sm">Role: {profileUser.role}</p>
                    <p className="text-sm">Joined Date: {new Date(profileUser.joined_date).toLocaleDateString()}</p>
                    <div className="flex space-x-4 text-sm">
                        <div className="text-center">
                            <p className="font-semibold">{profileUser.followers_count || 0}</p>
                            <p>Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">{profileUser.following_count || 0}</p>
                            <p>Following</p>
                        </div>
                    </div>
                    {isOwnProfile && (
                        <Link to="/faq" className="border border-white text-white py-1 px-4 w-full text-sm">FAQ</Link>
                    )}
                </div>

                <div className="lg:col-span-3 space-y-8">
                    <AboutCard 
                        about={profileUser.about}
                        isOwnProfile={isOwnProfile}
                    />
                    <div>
                        <h3 className="text-xl mb-2 font-semibold">Learning Stats</h3>
                        <div className="border-dashed border-2 border-gray-400 p-10 rounded-md text-center text-gray-400">
                            <QuizAccuracyCard username={username} />
                            <QuizzesCompletedCard username={username} />
                            <div className="md:col-span-2">
                                <CurrentStreakCard username={username} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
