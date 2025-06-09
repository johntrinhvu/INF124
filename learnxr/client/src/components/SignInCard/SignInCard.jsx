import { Link, useNavigate } from "react-router-dom";
import "./SignInCard.css";
import Logo from "../../assets/LogoXR.png";
import { useState } from "react";

export default function SignInCard() {
    const API = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
        setError("");

        // Validate form
        if (!formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await fetch(`${API}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to login");
            }

            // Store the token and user data in localStorage
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            // Set token expiration
            const expirationTime = new Date().getTime() + (30 * 60 * 1000); // 30 minutes
            localStorage.setItem("tokenExpiration", expirationTime.toString());

            // Trigger storage event to update header
            window.dispatchEvent(new Event("storage"));

            // Redirect to dashboard
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="grid justify-center gap-2">
            {/* top section */}
            <h1 className="text-[#DEDAFF] text-3xl font-semibold">Welcome Back</h1>
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
                    <button
                        type="submit"
                        className="mt-6 text-sm text-white bg-blue-700 rounded-[20px] hover:bg-blue-800 focus:ring-2 focus:ring-[#9690C4] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 p-2">
                        Continue
                    </button>
                </form>
                <p className="text-sm text-white pb-10">
                    Don't have an account? <Link to="/signup" className="text-[#FE9324]">Sign up</Link>
                </p>
            </div>
        </div>
    );
}