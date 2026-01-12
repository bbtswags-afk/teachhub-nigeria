"use client";

import Link from "next/link";
import { Gamepad2, Brain, Zap, Trophy, Play } from "lucide-react";
import { GAMES } from "@/data/mocks";

export default function GamesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Game Center</h1>
                    <p className="text-slate-500">Make learning fun with interactive games.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2 shadow-sm">
                    <Trophy className="text-yellow-500" size={18} />
                    <span className="font-bold text-slate-700">1,250 XP</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Flashcards (Featured) */}
                <Link href="/games/flashcards" className="md:col-span-2 group">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20 h-full flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                    <Brain size={20} />
                                </div>
                                <span className="font-semibold bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur">Daily Challenge</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Study Flashcards</h2>
                            <p className="text-indigo-100 max-w-sm">Master your vocabulary and concepts with our smart flashcard system.</p>
                        </div>

                        <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold self-start mt-8 flex items-center gap-2 group-hover:shadow-lg transition-all">
                            <Play size={18} className="fill-current" />
                            Start Review
                        </button>
                    </div>
                </Link>

                {/* Mini Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Zap className="text-orange-500" size={20} />
                            Leaderboard
                        </h3>
                        <ul className="space-y-3">
                            {[1, 2, 3].map((pos) => (
                                <li key={pos} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${pos === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {pos}
                                        </span>
                                        <span className="text-slate-700">Student {pos}</span>
                                    </div>
                                    <span className="font-medium text-slate-900">{2000 - pos * 150} pts</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-4">All Games</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {GAMES.map((game) => (
                    <div key={game.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center">
                            <Gamepad2 size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900">{game.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{game.type} • {game.plays} plays</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
