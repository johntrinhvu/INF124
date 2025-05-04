import "./QuizAccuracyCard.css"
export default function QuizAccuracyCard() {
    return (
        <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 min-h-[250px] w-full">
            <h2 className="text-xl mb-4">Quiz Accuracy</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between h-full">
                <p className="text-5xl font-bold">92%</p>
                <div className="w-full md:w-2/3 ml-auto h-32">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                        <polyline
                            fill="none"
                            stroke="#9690C4"
                            strokeWidth="2"
                            points="0,35 10,30 20,20 30,25 40,15 50,10 60,18 70,12 80,20 90,10 100,5"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

