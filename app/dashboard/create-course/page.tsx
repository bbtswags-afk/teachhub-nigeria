"use client";

import { useActionState, useState } from "react";
import { createCourse } from "@/app/actions/course";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { PRIMARY_GRADES, SUBJECTS } from "@/app/lib/constants";

const INITIAL_STATE = {
    message: "",
    errors: {} as Record<string, string[]>
};

export default function CreateCoursePage() {
    const router = useRouter();
    const [state, action, pending] = useActionState(createCourse, INITIAL_STATE);
    const [isCustomSubject, setIsCustomSubject] = useState(false);

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Course</h1>

            <form action={action} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Course Title</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="e.g. Introduction to Basic Science"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-900"
                        />
                        {state.errors?.title && <p className="text-red-500 text-xs font-bold">{state.errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Subject</label>
                            <select
                                name={isCustomSubject ? "subject_select" : "subject"} // Use distinct name when custom to avoid conflict
                                onChange={(e) => setIsCustomSubject(e.target.value === "Others")}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-900 appearance-none"
                            >
                                <option value="">Select Subject</option>
                                {SUBJECTS.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                                <option value="Others">Others (Specify)</option>
                            </select>

                            {isCustomSubject && (
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Enter custom subject..."
                                    className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-900"
                                />
                            )}
                            {state.errors?.subject && <p className="text-red-500 text-xs font-bold">{state.errors.subject}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Grade Level</label>
                            <select
                                name="grade"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-900 appearance-none"
                            >
                                <option value="">Select Grade</option>
                                {PRIMARY_GRADES.map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                ))}
                            </select>
                            {state.errors?.grade && <p className="text-red-500 text-xs font-bold">{state.errors.grade}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Description (Optional)</label>
                        <textarea
                            name="description"
                            placeholder="Briefly describe what students will learn..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-900 resize-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={pending}
                        className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-auth-accent transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {pending ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating...
                            </>
                        ) : (
                            <>
                                Create Course
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
                {state.message && (
                    <p className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl">{state.message}</p>
                )}
            </form>
        </div>
    );
}
