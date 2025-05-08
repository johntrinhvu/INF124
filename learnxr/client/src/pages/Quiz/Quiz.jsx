import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
    const navigate = useNavigate();
    const totalQuestions = 20;
    const [currentIndex, setCurrentIndex] = useState(0);

    const question = {
        text: "EXAMPLE QUESTION",
        options: ["Answer A", "Answer B", "Answer C", "Answer D"],
    };

    const handleSelect = (index) => {
        setSelectedQuestion(index);
        console.log("Selected Answer:", index);
    }

    const handleClose = () => {
        navigate(-1);
    }

    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const progressWidth = `${(currentIndex + 1) / totalQuestions * 100}%`;

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex justify-center items-start px-4">
            <div className="bg-[#3b348b] p-8 rounded-xl w-full max-w-2xl relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-xl bg-[#999] text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
                >
                    ×
                </button>

                {/* Question Number */}
                <div className="text-center text-lg font-medium mb-2">
                    Question {currentIndex + 1} / {totalQuestions}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-gray-300 rounded-full mb-6">
                    <div
                        className="h-4 bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: progressWidth }}
                    />
                </div>


                <h2 className="text-center text-xl font-semibold mb-6">{question.text}</h2>

                <div className="space-y-4">
                    {question.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`flex items-center w-full py-3 px-4 rounded-md transition
              ${selectedQuestion === i
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            <div className={`border-2 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4
              ${selectedQuestion === i
                                    ? "border-white text-white bg-purple-600"
                                    : "border-blue-600 text-blue-600"
                                }`}
                            >
                                {String.fromCharCode(65 + i)}
                            </div>
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

};