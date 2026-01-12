"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ArrowLeft, BookOpen, Clock, Users, PlayCircle, MoreVertical } from "lucide-react";
import Link from "next/link";
import { COURSES } from "@/data/mocks";

// Generic Layout
export default function CourseDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
    return (
        <AppLayout>
            <CourseDetailPage params={params} />
        </AppLayout>
    );
}

function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    // Just find any course or fallback to first for spoofing if ID doesn't match
    const course = COURSES.find(c => c.id.toString() === unwrappedParams.id) || COURSES[0];

    return (
        <div className="space-y-6">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className={`h-48 ${course.color} relative`}>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-8">
                        <span className="text-white/80 font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                            {course.grade}
                        </span>
                        <h1 className="text-3xl font-bold text-white mt-2">{course.title}</h1>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex gap-8 border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-2">
                            <BookOpen className="text-slate-400" size={20} />
                            <span className="font-bold text-slate-900">{course.lessons} Lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="text-slate-400" size={20} />
                            <span className="font-bold text-slate-900">32 Students</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-4">Course Content</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                                        {i}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Lesson Topic {i}</h3>
                                        <p className="text-xs text-slate-500">45 mins • Video & Quiz</p>
                                    </div>
                                </div>
                                <PlayCircle className="text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
