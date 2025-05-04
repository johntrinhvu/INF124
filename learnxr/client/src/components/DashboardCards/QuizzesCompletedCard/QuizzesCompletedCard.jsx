import "./QuizzesCompletedCard.css"
export default function QuizzesCompletedCard() {
    return (
        <div className="bg-[#242452] border-8 border-[#0F0D2D] rounded-[25px] text-white px-6 py-10 w-full">
            <h2 className="text-xl mb-4">Quizzes Completed</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <p className="text-5xl font-bold">15</p>
                <div className="h-16 w-1/2 flex items-end justify-end gap-[6px] pb-2 pr-2">
                    <div className="w-10 h-9 bg-[#9690C4] rounded"></div>
                    <div className="w-10 h-14 bg-[#9690C4] rounded"></div>
                    <div className="w-10 h-16 bg-[#9690C4] rounded"></div>
                </div>
            </div>
        </div>
    );
}
