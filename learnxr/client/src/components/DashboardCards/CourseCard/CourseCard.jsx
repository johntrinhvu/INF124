import { Link } from 'react-router-dom';
import "./CourseCard.css";
import SampleCoursePhoto from "../../../assets/SampleCoursePhoto.png";

export default function CourseCard() {
    return (
        <Link to="/quiz">
            <div className="text-left border-2 border-[#252592] rounded-[20px] grid w-80 p-5">
                <img 
                    src={SampleCoursePhoto}
                    alt="Course Photo"
                    className="w-80 h-60"
                />
                <h2 className="text-[#DEDAFF] text-2xl pt-2">
                    Course Title
                </h2>
                <p
                    className="text-[#b0aaff] line-clamp-3">
                    Course description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>
        </Link>
    );
}