import { Link } from 'react-router-dom';
import "./CourseCard.css";
import SampleCoursePhoto from "../../../assets/SampleCoursePhoto.png";

export default function CourseCard({ id, title, description, category, difficulty }) {
    // Convert title to URL-friendly format
    const urlTitle = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
    
    return (
        <Link to={`/quizzes/${urlTitle}`} state={{ courseTitle: title }}>
            <div className="text-left border-2 border-[#252592] rounded-[20px] grid w-60 p-5 hover:border-purple-500 transition-colors cursor-pointer">
                <img 
                    src={SampleCoursePhoto}
                    alt={`${title} Course Photo`}
                    className="w-60 h-40 object-cover rounded-lg"
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-purple-400">{category}</span>
                    <span className="text-sm text-[#b0aaff]">{difficulty}</span>
                </div>
                <h2 className="text-[#DEDAFF] text-2xl pt-2">
                    {title}
                </h2>
                <p className="text-[#b0aaff] line-clamp-3">
                    {description}
                </p>
            </div>
        </Link>
    );
}