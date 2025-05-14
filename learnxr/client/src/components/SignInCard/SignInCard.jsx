import { Link } from "react-router-dom";
import "./SignInCard.css";
import Logo from "../../assets/LogoXR.png";
import { useState } from "react";


export default function SignInCard() {
    
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const checkForEmailSpaces = (e) => {
        const value = e.target.value;
        setEmail(value);
        setError(value.includes(" ") ? "Email should not contain spaces." : "");
    };

    return (
        <div className="grid justify-center gap-2">
            {/* top section */}
            <h1 className="text-[#DEDAFF] text-3xl">Welcome Back</h1>
            {/* bottom section */}
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] grid justify-center gap-2 px-[10vw] py-5">
                <div className="grid justify-center">
                    <img src={Logo} alt="Logo" className="w-40 h-40" />
                </div>
                <input
                    type="text"
                    id="emailaddress"
                    placeholder="Email address"
                    value={email}
                    onChange={checkForEmailSpaces}
                    className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                {error && (
                <p className="text-red-400 text-xs -mt-1">{error}</p>
                )}
                <input
                    type="text"
                    id="password"
                    placeholder="Password"
                    className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                <Link to="/dashboard"
                    className="text-sm text-white bg-blue-700 rounded-[20px] hover:bg-blue-800 focus:ring-2 focus:ring-[#9690C4] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 p-2">
                        Continue
                </Link>
                <p className="text-xs text-white pb-10">
                    Don't have an account? <Link to="/signup" className="text-[#FE9324]">Sign up</Link>
                </p>
            </div>
        </div>
    )
}