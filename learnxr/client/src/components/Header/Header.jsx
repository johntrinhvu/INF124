import "./Header.css";
import { FaBars } from "react-icons/fa";
import Logo from "../../assets/LogoXROrange.png";

export default function Header() {
  return (
    <div className="z-40 flex justify-center">
      <nav className="rounded-2xl fixed px-4 h-[52px] items-center top-0 mt-4 w-9/12 max-w-[1070px] flex justify-between bg-[#1C1C41]">
        <div className="flex">
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-white pt-1.5 font-bold">LearnXR</h1>
        </div>

        <div>
          <button>
            <FaBars className="w-5 h-5 text-[#6B6DB6] pt-1"/>
          </button>
        </div>
      </nav>
    </div>
  );
};
