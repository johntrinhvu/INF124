import "./SignInCard.css";
import Logo from "../../assets/LogoXR.png";

export default function SignInCard() {
    return (
        <div className="grid justify-center gap-2">
            {/* top section */}
            <h1 className="text-[#DEDAFF] text-3xl">Welcome Back</h1>
            {/* bottom section */}
            <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] grid justify-center gap-2 px-[10vw] py-5">
                <div className="grid justify-center">
                    <img src={Logo} alt="Logo" className="w-40 h-40" />
                </div>
                <input type="text" id="emailaddress" placeholder="Email address" className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                <input type="text" id="password" placeholder="Password" className="text-sm text-white bg-[#242452] border-2 border-[#252592] rounded-[20px] p-2" />
                <button type="button" className="text-sm text-white bg-blue-700 rounded-[20px] hover:bg-blue-800 focus:ring-2 focus:ring-[#9690C4] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 p-2">Continue</button>
                <p className="text-xs text-white pb-10">Don't have an account? <a href="/signup" className="text-[#FE9324]">Sign Up</a></p>
            </div>
        </div>
    )
}