import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResultReview } from '../../services/quizService';
import { FaLightbulb, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

function QuizResultReview() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quizResult, setQuizResult] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSolution, setShowSolution] = useState(false);

    const getOptionClass = (option) => {
        if (option.is_selected && option.is_correct) return 'bg-green-100 border-green-400';
        if (option.is_selected && !option.is_correct) return 'bg-red-100 border-red-400';
        if (!option.is_selected && option.is_correct) return 'bg-green-50 border-green-300';
        return 'bg-white border-gray-200';
    };

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await getResultReview(quizId);
                setQuizResult(res.data.data.data);
            } catch (error) {
                toast.error("Failed to load quiz result");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [quizId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-amber-50 px-4">
                <div className="text-sm md:text-base text-gray-500 animate-pulse">
                    Loading quiz review...
                </div>
            </div>
        );
    }

    const question = quizResult[currentIndex];

    return (
        <div className="min-h-screen bg-amber-50 flex justify-center px-3 md:px-6 py-15 md:py-20">
            <div className="w-full max-w-2xl md:max-w-3xl bg-white rounded-xl shadow p-4 md:p-6">

                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <p className="text-xs md:text-sm text-amber-600 font-medium">
                        Question {currentIndex + 1} / {quizResult.length}
                    </p>

                    {/* English */}
                    <h2 className="text-sm md:text-lg font-semibold text-gray-800 mt-1 leading-snug">
                        {question?.question_text}
                    </h2>

                    {/* Hindi */}
                    {question?.question_hi && (
                        <p className="text-xs md:text-base text-gray-600 mt-1 leading-snug">
                            {question?.question_hi}
                        </p>
                    )}
                </div>

                {/* Options */}
                <div className="space-y-2 md:space-y-3">
                    {question?.options?.map((option) => (
                        <div
                            key={option.id}
                            className={`p-3 md:p-4 rounded-lg border text-sm md:text-base ${getOptionClass(option)}`}
                        >
                            <div className="flex justify-between items-start gap-2 md:gap-4">

                                <div>
                                    {/* English */}
                                    <p className="text-gray-800">
                                        {option.option_text}
                                    </p>

                                    {/* Hindi */}
                                    {option.option_hi && (
                                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                                            {option.option_hi}
                                        </p>
                                    )}
                                </div>

                                {/* Labels */}
                                <div className="flex flex-col gap-1 text-[10px] md:text-xs">
                                    {option.is_selected && (
                                        <span className="bg-gray-800 text-white px-2 py-[2px] rounded">
                                            Selected
                                        </span>
                                    )}

                                    {option.is_correct && (
                                        <span className="bg-green-600 text-white px-2 py-[2px] rounded">
                                            Correct
                                        </span>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Explanation */}
                {question?.solution && (
                    <div className="mt-4 md:mt-6">
                        <button
                            onClick={() => setShowSolution(!showSolution)}
                            className="flex items-center gap-2 text-xs md:text-sm font-semibold text-amber-700"
                        >
                            <FaLightbulb />
                            Explanation
                            {showSolution ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        {showSolution && (
                            <div className="mt-2 p-3 md:p-4 bg-amber-50 border border-amber-200 rounded text-xs md:text-sm text-gray-700 leading-relaxed">
                                {question.solution}
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6 md:mt-8">
                    <button
                        onClick={() => {
                            setCurrentIndex((prev) => prev - 1);
                            setShowSolution(false);
                        }}
                        disabled={currentIndex === 0}
                        className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded bg-gray-200 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <button
                        onClick={() => {
                            setCurrentIndex((prev) => prev + 1);
                            setShowSolution(false);
                        }}
                        disabled={currentIndex === quizResult.length - 1}
                        className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded bg-amber-400 text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
}

export default QuizResultReview;