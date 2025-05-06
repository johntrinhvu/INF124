import "./Header.css";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../../assets/LogoXROrange.png";
import GenericAvatar from "../../assets/GenericAvatar.png";


export default function Header() {
  return (
    <div className="z-40 flex justify-center">
      <nav className="rounded-2xl fixed px-4 h-[52px] items-center top-0 mt-4 w-9/12 max-w-[1070px] flex justify-between bg-[#242452]">
        {/* Left Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="w-10 h-10" />
            <h1 className="text-white pb-0.5 font-bold">LearnXR</h1>
          </Link>
        </div>

        {/* Right Section */}
        <div>
          <button className="hidden">
            <FaBars className="w-5 h-5 text-[#6B6DB6] pt-1"/>
          </button>
          <div className="flex items-center gap-2">
          <div className="flex rounded-md border-[#10103D]">
            <Link to="/signin" className="bg-[#ACACE5] py-1 px-3 text-sm border border-[#10103D] rounded-sm">
              Sign In
            </Link>
            <Link to="/signup" className="bg-[#ACACE5] py-1 px-3 text-sm border border-[#10103D] rounded-sm">
              Sign Up
            </Link>
          </div>
         
          <Link to= "/profile">
            <img src = {GenericAvatar}
            alt = "user"
            className = "w-9 h-9 rounded-full border-2 border-[#ACAE5] hover:opacity-90x"
            />

          </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
