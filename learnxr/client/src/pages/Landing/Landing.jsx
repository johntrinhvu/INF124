import "./Landing.css";
import vrHeadset from "../../assets/vrHeadset.png";
import FloatingHead3D from "../../components/FloatingHead/FloatingHead";
import Typewriter from 'typewriter-effect';
import { isAuthenticated } from "../../utils/auth";
import { Link } from "react-router-dom";

export default function Landing() {
  const isLoggedIn = isAuthenticated();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050515] via-[#0a0a23] to-[#2a2a4a]">
      <div className="flex flex-col gap-10 md:pt-16 md:flex-row md:justify-center md:items-center min-h-screen md:gap-32">
        <div className="text-white text-5xl font-semibold text-center md:text-left pt-28">
          <h1>Hello,</h1>
          <h1>Welcome to <Typewriter
            options={{
              strings: ['LearnXR.'],
              autoStart: true,
              loop: true,
              wrapperClassName: 'text-orange-400',
              cursorClassName: 'text-orange-400',
            }}
          /></h1>
        </div>
        <div className="flex justify-center items-center">
          <FloatingHead3D />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center px-4 min-h-screen">
        <h2 className="text-4xl font-semibold text-orange-400 mb-6">Learn Efficiently.</h2>
        <p className="text-gray-200 max-w-2xl mb-8">
          LearnXR is an interactive AR experience designed to be smooth and user-friendly.
          Explore and learn like never before with our cutting-edge platform!
        </p>
        <Link 
          to={isLoggedIn ? "/dashboard" : "/signup"}
          className="bg-[#3F3FE8] hover:bg-[#7676e8] text-white font-semibold py-3 px-8 rounded-lg"
        >
          {isLoggedIn ? "Go to Dashboard" : "Try it out"}
        </Link>
      </div>
    </div>
  );
}

