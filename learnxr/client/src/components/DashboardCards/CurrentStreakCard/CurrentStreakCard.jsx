import './CurrentStreakCard.css'
export default function CurrentStreakCard() {
    return (
        <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 min-h-[300px] w-full">
            <h2 className="text-xl mb-4">Current Streak</h2>
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 h-full">
                <p className="text-5xl font-bold self-start">36 days</p>
                <div className="flex-grow md:w-[70%] h-full ml-auto">
                    <div className="grid grid-cols-7 gap-3 text-lg text-center mb-3">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                            <span key={i} className="font-bold text-[#6C4FB6]">{d}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-3 text-lg text-center text-[#b0aaff]">
                        {[...Array(28)].map((_, i) => (
                            <span
                                key={i + 1}
                                className="py-3 bg-[#1a1a3d] rounded-lg"
                            >
                                {i + 1}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
