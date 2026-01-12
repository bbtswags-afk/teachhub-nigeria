"use client";

import Link from "next/link";
import { PenTool, BrainCircuit, FileText, Plus } from "lucide-react";

export default function CreatePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Content Creation Suite</h1>
                <p className="text-slate-500">Design engaging learning materials for your students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quiz Creator Card */}
                <Link href="/create/quiz" className="block group">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-indigo-100 text-primary rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">
                                <BrainCircuit />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Quiz Creator</h2>
                            <p className="text-slate-500 mb-6">Build interactive quizzes with drag-and-drop simplicity. Auto-graded and gamified.</p>

                            <span className="inline-flex items-center text-primary font-bold">
                                Start Building <Plus className="ml-2" size={20} />
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Lesson Note Card */}
                {/* Lesson Note Card */}
                <Link href="/create/lesson" className="block group">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">
                                <FileText />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">Lesson Notes</h2>
                            <p className="text-slate-500 mb-6">Write comprehensive lesson notes with rich text formatting, summary, and game links.</p>

                            <span className="inline-flex items-center text-orange-600 font-bold group-hover:underline transition-all">
                                Create Notes <Plus className="ml-2" size={20} />
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="pt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Your Drafts</h3>
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
                    <PenTool className="mx-auto mb-3 opacity-50" size={32} />
                    <p>No drafts yet. Start creating!</p>
                </div>
            </div>
        </div>
    );
}
