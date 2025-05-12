import { Link } from 'react-router-dom';
import "./Course.css";
import SampleCoursePhoto from "../../assets/SampleCoursePhoto.png";

export default function Course() {
    return (
        <div className="flex pt-24 pl-5">
            <div className="text-left text-wrap grid w-1/2">
                <img 
                    src={SampleCoursePhoto}
                    alt="Course Photo"
                    className=""
                />
                <h2 className="text-[#DEDAFF] text-3xl pt-2">
                    Course Title
                </h2>
                <p
                    className="text-[#b0aaff] line-clamp-3">
                    Course description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>
            
            <div className="pl-6">
                <Link to="/quiz">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white text-xl font-semibold px-16 py-6 rounded transition" >
                        Start a Quiz
                    </button>
                </Link>
            </div>
        </div>
    )
}