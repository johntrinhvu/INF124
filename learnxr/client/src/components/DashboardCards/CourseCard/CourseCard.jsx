import { Link } from 'react-router-dom';
import "./CourseCard.css";
import SampleCoursePhoto from "../../../assets/SampleCoursePhoto.png";

export default function CourseCard({ id, title, description, category, difficulty, lessons }) {
    return (
        <div className="bg-[#1E1B4B] rounded-lg p-6 w-80 flex-shrink-0">
            <Link to={`/courses/${encodeURIComponent(title)}`} className="block">
                <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
                <p className="text-[#b0aaff] mb-4 line-clamp-2">{description}</p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-[#b0aaff]">{category}</span>
                    <span className="text-sm text-[#b0aaff]">{difficulty}</span>
                </div>
                <div className="border-t border-[#3b348b] pt-4">
                    <h4 className="text-sm font-medium text-white mb-2">Course Structure:</h4>
                    <ul className="text-sm text-[#b0aaff] space-y-1">
                        {lessons?.map((lesson, index) => (
                            <li key={index} className="flex items-center">
                                <span className="w-6 h-6 bg-[#3b348b] rounded-full flex items-center justify-center mr-2 text-xs">
                                    {lesson.lesson_number}
                                </span>
                                <span className="line-clamp-1">{lesson.title}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 text-sm text-[#b0aaff]">
                        <span className="inline-flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {lessons?.length || 0} Lessons
                        </span>
                        <span className="inline-flex items-center ml-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Quiz Included
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}