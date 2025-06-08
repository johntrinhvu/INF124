import "./Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/LogoXROrange.png";
import GenericAvatar from "../../assets/GenericAvatar.png";
import { useState, useEffect, useRef } from "react";
import { isAuthenticated as checkAuth, getUser, logout } from "../../utils/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount and when auth state changes
    const checkAuthStatus = () => {
      const auth = checkAuth();
      setIsAuthenticated(auth);
      if (auth) {
        setUser(getUser());
      } else {
        setUser(null);
      }
    };

    checkAuthStatus();
    // Add event listener for storage changes
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
    setIsProfileOpen(false);
    navigate("/signin");
  };

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.username}`);
    }
    setIsProfileOpen(false);
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
            {!isAuthenticated ? (
              <div className="flex rounded-md border-[#10103D] gap-1">
                <Link to="/signin" className="bg-[#ACACE5] py-1 px-3 text-sm border-2 border-[#10103D] rounded-md hover:bg-[#7878A1]">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-[#ACACE5] py-1 px-3 text-sm border-2 border-[#10103D] rounded-md hover:bg-[#7878A1]">
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <Link to="/dashboard" className="bg-[#3F3FE8] text-white py-2 px-5 text-sm font-semibold border-2 border-[#10103D] rounded-lg hover:bg-[#7676e8]">
                  Dashboard
                </Link>
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="focus:outline-none"
                  >
                    <img 
                      src={GenericAvatar}
                      alt="user"
                      className="mt-1 w-9 h-9 rounded-full border-2 border-[#10103D] hover:opacity-90"
                    />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#242452] border-2 border-[#10103D] rounded-md shadow-lg py-1">
                      <button 
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ACACE5]"
                      >
                        Profile
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ACACE5]"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
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
            {!isAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <Link 
                  to={`/profile/${user.username}`}
                  className={`flex justify-start py-2 px-2 text-sm text-center relative ${isActive(`/profile/${user.username}`) ? 'text-yellow-400 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`flex justify-start py-2 px-2 text-sm text-center relative ${isActive('/dashboard') ? 'text-yellow-400 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex justify-start py-2 px-2 text-sm text-center"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
