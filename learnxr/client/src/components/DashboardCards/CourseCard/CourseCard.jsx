import { Link } from 'react-router-dom';
import "./CourseCard.css";
import SampleCoursePhoto from "../../../assets/SampleCoursePhoto.png";

export default function CourseCard({ id, title, description, category, difficulty }) {
    return (
        <div className="bg-[#1E1B4B] rounded-lg p-6 w-80 flex-shrink-0">
            <Link to={`/courses/${encodeURIComponent(title)}`} className="block">
                <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
                <p className="text-[#b0aaff] mb-4 line-clamp-2">{description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-[#b0aaff]">{category}</span>
                    <span className="text-sm text-[#b0aaff]">{difficulty}</span>
                </div>
            </Link>
        </div>
    );
}