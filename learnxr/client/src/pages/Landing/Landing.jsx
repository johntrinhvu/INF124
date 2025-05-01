import "./Landing.css";
import vrHeadset from "../../assets/vrHeadset.png";

export default function Landing() {
  return (
    <div className="landing-page min-h-screen bg-gradient-to-r from-[#0a0a23] to-[#1a1a3d] text-white font-sans">
      <div className="flex flex-col lg:flex-row items-center justify-between px-20 py-20">



        <div className="text-center space-y-10 max-w-lg">
          <h1 className="text-5xl font-light lg:m-4">Hello,</h1>
          <h1 className="text-5xl font-light">Welcome to <span className="text-orange-400 font-semibold">LearnXR</span>.</h1>
        </div>

        <div className="mt-10 lg:mt-20">
          <img src={vrHeadset} alt="vrHeadset"
            className="w-72 lg:w-96"
          />
        </div>
      </div>
    </div>
  );
}

