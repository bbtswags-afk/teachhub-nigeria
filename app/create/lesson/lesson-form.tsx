"use client";

import { useState } from "react";
import { createLesson } from "@/app/actions/lesson";
import { Save, Loader2, FileText, Link as LinkIcon, Gamepad2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
    id: string;
    title: string;
}

export default function LessonForm({ courses }: { courses: Course[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [courseId, setCourseId] = useState(courses[0]?.id || "");
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [article, setArticle] = useState("");
    const [gameUrl, setGameUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!courseId) {
            setError("Please select a course first.");
            setLoading(false);
            return;
        }

        try {
            await createLesson(courseId, {
                title,
                summary,
                article,
                gameUrl,
                videoUrl,
                quizzes: [], // Empty for now, can be added later
                flashcards: []
            });
            // Redirect is handled in server action
        } catch (err) {
            console.error(err);
            setError("Failed to create lesson.");
            setLoading(false);
        }
    };

    if (courses.length === 0) {
        return (
            <div className="p-8 bg-orange-50 text-orange-800 rounded-xl border border-orange-200">
                You need to create a Course before adding lessons!
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Select Course</label>
                    <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium"
                    >
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Lesson Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium"
                        placeholder="e.g. Introduction to Biology"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Info size={16} /> Lesson Summary (Teacher Notes)
                </label>
                <p className="text-xs text-slate-500">A brief summary for you to recall what to teach.</p>
                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium h-24 resize-none"
                    placeholder="Key points to cover..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Gamepad2 size={16} /> Game Embed URL
                </label>
                <p className="text-xs text-slate-500">Link to Wordwall or other game site.</p>
                <input
                    type="text"
                    value={gameUrl}
                    onChange={(e) => setGameUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium"
                    placeholder="https://wordwall.net/..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FileText size={16} /> Lesson Content
                </label>
                <textarea
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium h-48"
                    placeholder="# Lesson Content..."
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Post Lesson
                </button>
            </div>
        </form>
    );
}
