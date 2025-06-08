import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SignUpCard.css";
import Logo from "../../assets/LogoXR.png";

export default function SignUpCard() {
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
        setError("");

        // Validate form
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // First, create the user account
            const signupResponse = await fetch("http://localhost:8000/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const signupData = await signupResponse.json();

            if (!signupResponse.ok) {
                throw new Error(signupData.detail || "Failed to create account");
            }

            // Then, automatically log in the user
            const loginResponse = await fetch("http://localhost:8000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(loginData.detail || "Failed to log in");
            }

            // Store the token and user data
            localStorage.setItem("token", loginData.access_token);
            localStorage.setItem("user", JSON.stringify(loginData.user));
            localStorage.setItem("tokenExpiration", new Date(Date.now() + 30 * 60 * 1000).toISOString());

            // Trigger a storage event to update the header
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