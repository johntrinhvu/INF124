import "./Header.css";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../../assets/LogoXROrange.png";

export default function Header() {
  return (
    <div className="z-40 flex justify-center">
      <nav className="rounded-2xl fixed px-4 h-[52px] items-center top-0 mt-4 w-9/12 max-w-[1070px] flex justify-between bg-[#1C1C41]">
        {/* Left Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="w-10 h-10" />
            <h1 className="text-white pb-0.5 font-bold">LearnXR</h1>
          </Link>
        </div>

        {/* Right Section */}
        <div>
          <button>
            <FaBars className="w-5 h-5 text-[#6B6DB6] pt-1"/>
          </button>
        </div>
      </nav>
    </div>
  );
};
