"use client";

import { useActionState, useState } from "react";
import { updateCourse } from "@/app/actions/course";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { PRIMARY_GRADES, SUBJECTS } from "@/app/lib/constants";

const INITIAL_STATE = { message: "", errors: {} };

export default function EditCourseForm({ course }: { course: any }) {
    const router = useRouter();
    const updateCourseWithId = updateCourse.bind(null, course.id);
    const [state, action, pending] = useActionState(updateCourseWithId, INITIAL_STATE);

    // Determine initial subject state (is it one of the presets or custom?)
    const initialIsCustom = !!course.subject && !SUBJECTS.includes(course.subject);
    const [isCustomSubject, setIsCustomSubject] = useState(initialIsCustom);

    return (
        <form action={action} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Course Title</label>
                    <input
                        name="title"
                        defaultValue={course.title}
                        type="text"
                        placeholder="e.g. Introduction to Biology"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-900"
                    />
                    {state.errors?.title && <p className="text-red-500 text-xs font-bold">{state.errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Subject</label>
                        <select
                            name={isCustomSubject ? "subject_select" : "subject"}
                            defaultValue={initialIsCustom ? "Others" : (course.subject || "")}
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
                                name="subject" // This will be the value sent if visible
                                defaultValue={initialIsCustom ? course.subject : ""}
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
                            defaultValue={course.grade || ""}
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
                    <label className="text-sm font-bold text-slate-700">Description</label>
                    <textarea
                        name="description"
                        defaultValue={course.description || ""}
                        placeholder="Briefly describe what students will learn..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-slate-900 resize-none"
                    />

                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                    <input
                        type="checkbox"
                        name="isPublic"
                        id="isPublic"
                        defaultChecked={course.isPublic}
                        value="true" // Ensure "true" is sent if checked
                        className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                    />
                    <div>
                        <label htmlFor="isPublic" className="font-bold text-slate-800 block cursor-pointer">
                            Share to Community Library
                        </label>
                        <p className="text-sm text-slate-500 mt-1">
                            Allow other teachers to find and view this course. Your name will be displayed as the author.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={pending}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-auth-accent transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {pending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Save Changes
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
    );
}
