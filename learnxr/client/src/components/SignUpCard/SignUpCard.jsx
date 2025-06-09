import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SignUpCard.css";
import Logo from "../../assets/LogoXR.png";

export default function SignUpCard() {
    const API = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Validate the data
            if (!formData.username.trim()) {
                throw new Error('Username is required');
            }
            if (!formData.email.trim()) {
                throw new Error('Email is required');
            }
            if (!formData.password) {
                throw new Error('Password is required');
            }
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Create user
            const response = await fetch(`${API}/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to create account');
            }

            // Redirect to success page
            navigate('/signup-success');
        } catch (err) {
            console.error('Error creating account:', err);
            setError(err.message);
        }
    };

    return (
        <div className="grid justify-center gap-2">
            {/* top section */}
            <h1 className="text-[#DEDAFF] text-3xl font-semibold">Create an Account</h1>
            {/* bottom section */}
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] grid justify-center gap-2 px-[10vw] py-5">
                <div className="grid justify-center">
                    <img src={Logo} alt="Logo" className="w-40 h-40" />
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <form onSubmit={handleSubmit} className="grid gap-2">
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                    <input
                        type="email"
                        id="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                    <button
                        type="submit"
                        className="mt-6 text-sm text-white bg-blue-700 rounded-[20px] hover:bg-blue-800 focus:ring-2 focus:ring-[#9690C4] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 p-2">
                        Continue
                    </button>
                </form>
                <p className="text-sm text-white pb-10">
                    Already have an account? <Link to="/signin" className="text-[#FE9324]">Sign in</Link>
                </p>
            </div>
        </div>
    );
}