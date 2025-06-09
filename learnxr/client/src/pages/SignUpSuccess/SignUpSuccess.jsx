import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/LogoXROrange.png';

export default function SignUpSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically redirect to sign in page after 5 seconds
        const timer = setTimeout(() => {
            navigate('/signin');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] flex items-center justify-center">
            <div className="bg-[#1a1a3d] p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <img src={Logo} alt="LearnXR Logo" className="w-32 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-white mb-4">Account Created Successfully!</h1>
                <p className="text-white/80 mb-6">
                    Your account has been created. You will be redirected to the sign in page in 5 seconds.
                </p>
                <button
                    onClick={() => navigate('/signin')}
                    className="px-6 py-2 bg-[#3F3FE8] hover:bg-[#7676e8] transition-colors rounded text-sm font-semibold text-white"
                >
                    Sign In Now
                </button>
            </div>
        </div>
    );
} 