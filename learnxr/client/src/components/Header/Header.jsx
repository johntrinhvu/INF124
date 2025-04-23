import "./Header.css";
import Logo from "../../assets/LogoXROrange.png";

export default function Header() {
  return (
    <div className="z-40 flex justify-center">
      <nav className="rounded-2xl fixed px-4 h-[52px] items-center top-0 mt-4 w-9/12 max-w-[1070px] flex justify-between bg-[#1C1C43]">
        <div className="flex">
          <img src={Logo} className="w-10 h-10" />
          <h1 className="text-white pt-1.5 font-bold">LearnXR</h1>
        </div>

        <div>

        </div>
      </nav>
    </div>
  );
};
