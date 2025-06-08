import { Navigate, Link } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

export default function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return (
            <div className="min-h-screen pt-[120px] bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                <p className="text-xl mb-8">Please sign in to access this page.</p>
                <Link 
                    to="/signin" 
                    className="bg-[#3F3FE8] hover:bg-[#7676e8] text-white font-semibold py-3 px-8 rounded-lg"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    return children;
} 