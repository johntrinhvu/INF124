import "./Landing.css";
import vrHeadset from "../../assets/vrHeadset.png";

export default function Landing() {
  return (
    <div className="mt-28">
      <div className="flex flex-col md:pt-16 md:flex-row md:justify-center md:items-center md:min-h-[calc(100vh-350px)] md:gap-32">
        <div className="text-white text-5xl font-semibold text-center md:text-left">
          <h1>Hello, </h1>
          <h1>Welcome to <span className="text-orange-400">LearnXR</span>.</h1>
        </div>
        <div className="flex justify-center items-center">
          <img 
            src={vrHeadset}
            className="w-72 md:w-96"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center px-4 min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#2a2a4a]">
        <h2 className="text-4xl font-semibold text-orange-400 mb-6">Learn Efficiently.</h2>
        <p className="text-gray-200 max-w-2xl mb-8">
          LearnXR is an interactive AR experience designed to be smooth and user-friendly.
          Explore and learn like never before with our cutting-edge platform!
        </p>
        <a 
          href="/signup" 
          className="bg-[#3F3FE8] hover:bg-[#7676e8] text-white font-semibold py-3 px-8 rounded-lg"
        >
          Try it out
        </a>
      </div>
    </div>
  );
}

