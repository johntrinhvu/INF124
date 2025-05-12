import { Link } from 'react-router-dom';
import "./Course.css";

export default function Course() {
    return (
        <div className="pt-24">
            <h1>Course</h1>
            <div className="pt-6">
                <Link to="/quiz">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white text-xl font-semibold px-16 py-6 rounded transition" >
                        Start a Quiz
                    </button>
                </Link>
            </div>
        </div>
    )
}