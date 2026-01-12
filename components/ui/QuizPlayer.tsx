"use client";

import { useState } from "react";
import { Check, X, RefreshCw, Trophy, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type QuizParams = {
    question: string;
    options: string[]; // Logic expects raw strings here, parse if needed in parent
    correctOption: number;
};

export default function QuizPlayer({ quizzes }: { quizzes: QuizParams[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const currentQuiz = quizzes[currentIndex];

    // Helper to parse options if they are stored as JSON string (database quirk)
    const getOptions = (q: QuizParams) => {
        if (typeof q.options === 'string') {
            try { return JSON.parse(q.options); } catch { return []; }
        }
        return q.options;
    };

    const handleAnswer = (index: number) => {
        if (selectedOption !== null) return; // Prevent multiple answers
        setSelectedOption(index);
        const correct = index === currentQuiz.correctOption;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);
    };

    const nextQuestion = () => {
        if (currentIndex < quizzes.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    if (quizzes.length === 0) return <div className="text-center text-slate-500 italic">No quiz questions available.</div>;

    if (showResult) {
        return (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
                <p className="text-slate-500 mb-8">You scored <span className="font-bold text-slate-900">{score}</span> out of <span className="font-bold text-slate-900">{quizzes.length}</span></p>
                <button
                    onClick={resetQuiz}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 mx-auto"
                >
                    <RefreshCw size={18} /> Retry Quiz
                </button>
            </div>
        );
    }

    const options = getOptions(currentQuiz);

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {currentIndex + 1} of {quizzes.length}</span>
                <span className="text-xs font-bold text-primary bg-indigo-50 px-2 py-1 rounded">Score: {score}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-8">{currentQuiz.question}</h3>

            <div className="space-y-3">
                {options.map((option: string, i: number) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selectedOption !== null}
                        className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between
                            ${selectedOption === null
                                ? "border-slate-100 hover:border-primary/50 hover:bg-slate-50 text-slate-600"
                                : selectedOption === i
                                    ? (isCorrect ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700")
                                    : (i === currentQuiz.correctOption ? "border-green-500 bg-green-50 text-green-700" : "border-slate-100 text-slate-400 opacity-50")
                            }
                        `}
                    >
                        <span>{option}</span>
                        {selectedOption !== null && i === currentQuiz.correctOption && <Check size={20} className="text-green-600" />}
                        {selectedOption === i && !isCorrect && <X size={20} className="text-red-600" />}
                    </button>
                ))}
            </div>

            {selectedOption !== null && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={nextQuestion}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2"
                    >
                        {currentIndex < quizzes.length - 1 ? "Next Question" : "View Results"} <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
