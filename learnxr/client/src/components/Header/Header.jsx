import "./Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/LogoXROrange.png";
import GenericAvatar from "../../assets/GenericAvatar.png";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="relative z-40 flex justify-center">
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
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden block"
            onClick={toggleMenu}
          >
            <FaBars className="text-[#6B6DB6] mb-0.5 mr-1" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex rounded-md border-[#10103D]">
              <Link to="/signin" className="bg-[#ACACE5] py-1 px-3 text-sm border border-[#10103D] rounded-sm">
                Sign In
              </Link>
              <Link to="/signup" className="bg-[#ACACE5] py-1 px-3 text-sm border border-[#10103D] rounded-sm">
                Sign Up
              </Link>
            </div>

            <Link to="/profile">
              <img 
                src={GenericAvatar}
                alt="user"
                className="w-9 h-9 rounded-full border-2 border-[#ACAE5] hover:opacity-90"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed right-0 bottom-0 w-56 top-0 bg-[#ACACEA] p-4 md:hidden">
          <div className="text-white flex flex-col gap-3">
            <button 
              className="flex justify-end"
              onClick={toggleMenu}
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h1 className="font-bold">LearnXR Menu</h1>
            <Link 
              to="/" 
              className={`flex justify-start py-2 px-2 text-sm text-center relative ${isActive('/') ? 'text-yellow-400 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/signin" 
              className={`flex justify-start py-2 px-2 text-sm text-center relative ${isActive('/signin') ? 'text-yellow-400 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className={`flex justify-start py-2 px-2 text-sm text-center relative ${isActive('/signup') ? 'text-yellow-400 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center justify-start gap-2 relative ${isActive('/profile') ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <img 
                src={GenericAvatar}
                alt="user"
                className="w-9 h-9 rounded-full border-2 border-[#ACAE5]"
              />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
