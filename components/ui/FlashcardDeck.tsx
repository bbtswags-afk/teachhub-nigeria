"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FlashcardParams = {
    front: string;
    back: string;
    color: string;
    image?: string;
};

export default function FlashcardDeck({ cards }: { cards: FlashcardParams[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (cards.length === 0) return <div className="text-center text-slate-500 italic">No flashcards available.</div>;

    const currentCard = cards[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((c) => (c + 1) % cards.length), 200);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((c) => (c - 1 + cards.length) % cards.length), 200);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="perspective-1000 w-full aspect-[3/2] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-3xl"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* Front */}
                    <div className={`absolute w-full h-full backface-hidden ${currentCard.color} rounded-3xl border-2 border-slate-900/5 flex flex-col items-center justify-center p-8 text-center`}>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Front</span>
                        {currentCard.image && (
                            <div className="mb-4 w-full h-32 flex items-center justify-center">
                                <img src={currentCard.image} alt="Flashcard" className="max-w-full max-h-full object-contain rounded-lg shadow-sm bg-white" />
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-slate-800">{currentCard.front}</h3>
                        <div className="absolute bottom-6 text-slate-400 text-xs font-bold flex items-center gap-1">
                            <RotateCw size={14} /> TAP TO FLIP
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-3xl border-2 border-primary border-b-8 flex flex-col items-center justify-center p-8 text-center">
                        <span className="text-xs font-bold text-primary/50 uppercase tracking-wider mb-4">Back</span>
                        <p className="text-xl font-medium text-slate-600 leading-relaxed">{currentCard.back}</p>
                    </div>
                </motion.div>
            </div >

            <div className="flex items-center justify-between mt-8 px-4">
                <button
                    onClick={prevCard}
                    className="p-3 bg-white rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200"
                >
                    <ArrowLeft size={20} />
                </button>
                <span className="font-bold text-slate-400 text-sm">
                    {currentIndex + 1} / {cards.length}
                </span>
                <button
                    onClick={nextCard}
                    className="p-3 bg-white rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200"
                >
                    <ArrowRight size={20} />
                </button>
            </div>
        </div >
    );
}
