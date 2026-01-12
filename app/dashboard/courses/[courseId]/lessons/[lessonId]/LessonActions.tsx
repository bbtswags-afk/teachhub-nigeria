"use client";

import { useState } from "react";
import { deleteLesson } from "@/app/actions/lesson";
import { Trash, Edit, Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonActionsProps {
    courseId: string;
    lessonId: string;
}

export default function LessonActions({ courseId, lessonId }: LessonActionsProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteLesson(lessonId, courseId);
            router.push(`/dashboard/courses/${courseId}`);
        } catch (e) {
            alert("Failed to delete lesson");
            setDeleting(false);
            setConfirming(false);
        }
    };

    if (confirming) {
        return (
            <div className="flex items-center gap-2 bg-red-50 p-1 rounded-lg border border-red-100 animate-in fade-in slide-in-from-right-4">
                <span className="text-xs text-red-600 font-bold px-2">Are you sure?</span>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    disabled={deleting}
                    className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200"
                >
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => router.push(`/dashboard/courses/${courseId}/lessons/${lessonId}/edit`)}
                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                title="Edit Lesson"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={() => setConfirming(true)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Delete Lesson"
            >
                <Trash size={18} />
            </button>
        </div>
    );
}
