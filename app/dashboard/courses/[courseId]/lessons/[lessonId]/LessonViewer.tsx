"use client";

import { useState } from "react";
import { BookOpen, Gamepad2, CheckCircle, Layers, ArrowRight, ArrowLeft } from "lucide-react";
import BlockRenderer from "@/components/ui/BlockRenderer";
import QuizPlayer from "@/components/ui/QuizPlayer";
import FlashcardDeck from "@/components/ui/FlashcardDeck";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type LessonViewerProps = {
    lesson: any; // We'll type this loosely for now to accept the Prisma result
};

export default function LessonViewer({ lesson }: LessonViewerProps) {
    const [activeTab, setActiveTab] = useState("content");

    // Define tabsOrder
    const tabs = [
        { id: "content", label: "Learn", icon: BookOpen, show: !!(lesson.articleContent || lesson.videoUrl) },
        { id: "quiz", label: "Quiz", icon: CheckCircle, show: lesson.quizzes && lesson.quizzes.length > 0 },
        { id: "flashcards", label: "Flashcards", icon: Layers, show: lesson.flashcards && lesson.flashcards.length > 0 },
        { id: "game", label: "Game", icon: Gamepad2, show: !!lesson.gameUrl },
    ].filter(t => t.show);

    const activeIndex = tabs.findIndex(t => t.id === activeTab);

    const handleNext = () => {
        if (activeIndex < tabs.length - 1) {
            setActiveTab(tabs[activeIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveTab(tabs[activeIndex - 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "px-4 py-3 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-all relative top-[1px]",
                            activeTab === tab.id
                                ? "bg-white border border-slate-200 border-b-white text-primary"
                                : "bg-slate-50 text-slate-500 hover:text-slate-700 border-transparent hover:bg-slate-100"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "content" && (
                            <div className="space-y-8">
                                {/* Video Section (Legacy Support) */}
                                {lesson.videoUrl && (
                                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={lesson.videoUrl.replace("watch?v=", "embed/")}
                                            title={lesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                {/* Main Content */}
                                {lesson.articleContent ? (
                                    <BlockRenderer content={lesson.articleContent} />
                                ) : (
                                    !lesson.videoUrl && <p className="text-slate-400 italic">No content added yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === "quiz" && (
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <CheckCircle className="text-green-500" /> Knowledge Check
                                </h2>
                                <QuizPlayer quizzes={lesson.quizzes} />
                            </div>
                        )}

                        {activeTab === "flashcards" && (
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Layers className="text-blue-500" /> Flashcards
                                </h2>
                                <FlashcardDeck cards={lesson.flashcards} />
                            </div>
                        )}

                        {activeTab === "game" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Gamepad2 className="text-purple-500" /> Interactive Game
                                </h2>
                                <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10">
                                    <iframe
                                        src={lesson.gameUrl}
                                        className="w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={18} /> Previous
                </button>

                {activeIndex < tabs.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all transform active:scale-95"
                    >
                        Next: {tabs[activeIndex + 1].label} <ArrowRight size={18} />
                    </button>
                ) : (
                    <div className="text-green-600 font-bold flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                        <CheckCircle size={18} /> Lesson Completed!
                    </div>
                )}
            </div>
        </div>
    );
}
