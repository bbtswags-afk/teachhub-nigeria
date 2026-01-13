"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCw, X } from "lucide-react";
import Link from "next/link";

const FLASHCARDS = [
    { id: 1, front: "What is Photosynthesis?", back: "The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.", color: "bg-green-100", image: "https://cdn-icons-png.flaticon.com/512/188/188333.png" },
    { id: 2, front: "Define 'Verb'", back: "A word used to describe an action, state, or occurrence, and forming the main part of the predicate of a sentence.", color: "bg-blue-100" },
    { id: 3, front: "5 x 12 = ?", back: "60", color: "bg-orange-100" },
];

export default function FlashcardsPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % FLASHCARDS.length);
        }, 200);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
        }, 200);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
                <Link href="/games" className="text-slate-500 hover:text-slate-900 flex items-center gap-2">
                    <ArrowLeft size={20} /> Exit
                </Link>
                <div className="text-slate-400 font-medium">
                    Card {currentIndex + 1} of {FLASHCARDS.length}
                </div>
            </div>

            <div className="relative w-full max-w-xl aspect-[4/5] sm:aspect-[3/2] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="w-full h-full relative preserve-3d transition-transform duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-gradient-to-br from-white to-slate-50">
                        <span className="absolute top-6 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Question</span>
                        <p className="text-2xl sm:text-3xl font-bold text-slate-800">{FLASHCARDS[currentIndex].front}</p>
                        <span className="absolute bottom-6 text-slate-400 text-sm animate-pulse">Tap to flip</span>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden bg-indigo-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 sm:p-8 text-center text-white"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <span className="absolute top-6 left-6 text-xs font-bold text-indigo-200 uppercase tracking-widest">Answer</span>
                        <p className="text-xl sm:text-2xl font-medium leading-relaxed">{FLASHCARDS[currentIndex].back}</p>
                    </div>
                </motion.div>
            </div>

            <div className="flex gap-4 mt-6 md:mt-10">
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="p-4 bg-white rounded-full shadow-md text-slate-500 hover:text-primary hover:shadow-lg transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
                    className="p-4 bg-white rounded-full shadow-md text-slate-500 hover:text-primary hover:shadow-lg transition-all"
                >
                    <RotateCw size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="p-4 bg-primary text-white rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-110 transition-all"
                >
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}
