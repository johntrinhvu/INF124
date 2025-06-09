import { useState, useEffect } from "react";
import Logo from "../../assets/LogoXROrange.png";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";

export default function Settings() {
    const API = process.env.REACT_APP_API_URL;

    const { username } = useParams();
    const navigate = useNavigate();
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [autoUpdates, setAutoUpdates] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        bio: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API}/api/users/username/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setFormData({
                    username: userData.username || "",
                    email: userData.email || "",
                    bio: userData.about || ""
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            // Validate the data
            if (!formData.username.trim()) {
                throw new Error('Username is required');
            }
            if (!formData.email.trim()) {
                throw new Error('Email is required');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const updateData = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                about: formData.bio.trim()
            };

            const response = await fetch(`${API}/api/users/username/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.detail || 'Failed to update profile');
            }

            setSuccess(true);
            // If username was changed, redirect to new profile URL
            if (responseData.username !== username) {
                navigate(`/profile/${responseData.username}/settings`);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while updating your profile');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`${API}/api/users/username/${username}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to delete account');
            }

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to home page
            navigate('/');
        } catch (err) {
            console.error('Error deleting account:', err);
            setError(err.message || 'An error occurred while deleting your account');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex">
            {/* Sidebar */}
            <main className="flex-1 p-10 space-y-10">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded mb-4">
                            Profile updated successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Basic Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full max-w-md p-2 rounded bg-[#1a1a3d] border border-white/20 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full max-w-md p-2 rounded bg-[#1a1a3d] border border-white/20 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full max-w-md p-2 rounded bg-[#1a1a3d] border border-white/20 text-sm"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <button 
                                type="submit"
                                className="px-6 py-2 bg-[#3F3FE8] hover:bg-[#7676e8] transition-colors rounded text-sm font-semibold"
                            >
                                Save Changes
                            </button>

                            <div className="pt-8 border-t border-white/10">
                                <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 transition-colors rounded text-sm font-semibold"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a3d] p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Delete Account</h3>
                        <p className="text-white/80 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                            All your data will be permanently deleted.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 transition-colors rounded text-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 transition-colors rounded text-sm font-semibold"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between max-w-md">
            <span>{label}</span>
            <button
                className={`w-10 h-5 rounded-full p-1 transition-colors ${value ? "bg-purple-400" : "bg-gray-500"}`}
                onClick={() => onChange(!value)}
            >
                <div
                    className={`bg-white w-3 h-3 rounded-full transition-transform ${value ? "translate-x-5" : ""}`}
                />
            </button>
        </div>
    );
}
