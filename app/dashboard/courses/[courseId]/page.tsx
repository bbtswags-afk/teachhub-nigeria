import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, Clock, FileText, PlayCircle, Plus, Users, Video } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CourseActions from "./CourseActions";

import VisibilityToggle from "@/components/course/VisibilityToggle";

export default async function CourseDetailPage({ params, searchParams }: { params: Promise<{ courseId: string }>, searchParams: Promise<{ back?: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { courseId } = await params;
    const { back } = await searchParams;

    const backLink = back === '/resources' ? '/resources' : '/dashboard';
    const backLabel = back === '/resources' ? 'Back to Library' : 'Back to Dashboard';

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            lessons: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!course) notFound();

    // Type casting to specific shape or any to bypass stale client definition
    const isOwner = session.user.id === (course as any).teacherId;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <Link href={backLink} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                        <ArrowLeft size={18} /> {backLabel}
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
                        {isOwner && <VisibilityToggle courseId={course.id} initialIsPublic={!!(course as any).isPublic} />}
                    </div>
                    <p className="text-slate-500 mt-2">{course.subject} • {course.grade}</p>
                </div>
            </div>

            {isOwner ? (
                <div className="flex items-center gap-2">
                    <CourseActions courseId={course.id} />
                    <Link
                        href={`/dashboard/courses/${course.id}/lessons/create`}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                    >
                        <Plus size={20} />
                        Add Lesson
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm border border-slate-200">
                        View Only Mode
                    </div>
                </div>
            )}


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase">Lessons</p>
                            <p className="text-2xl font-bold text-slate-900">{course.lessons.length}</p>
                        </div>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Course Content</h2>
                    <span className="text-sm text-slate-500">{course.lessons.length} items</span>
                </div>

                {course.lessons.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No lessons yet</h3>
                        <p className="text-slate-500 mt-2 mb-6">{isOwner ? "Start building your course curriculum." : "The teacher hasn't added any lessons yet."}</p>
                        {isOwner && (
                            <Link
                                href={`/dashboard/courses/${course.id}/lessons/create`}
                                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                            >
                                <Plus size={18} /> Create First Lesson
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {course.lessons.map((lesson: any, i: number) => (
                            <Link
                                href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                                key={lesson.id}
                                className="flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{lesson.title}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                        {lesson.videoUrl && <span className="flex items-center gap-1"><Video size={12} /> Video</span>}
                                        {lesson.articleContent && <span className="flex items-center gap-1"><FileText size={12} /> Article</span>}
                                        <span className="flex items-center gap-1"><Clock size={12} /> Updated {new Date(lesson.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="text-slate-400 group-hover:translate-x-1 transition-transform">
                                    <PlayCircle size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
