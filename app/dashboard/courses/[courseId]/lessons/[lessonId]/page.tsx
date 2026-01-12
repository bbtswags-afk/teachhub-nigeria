import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import LessonActions from "./LessonActions";
import LessonViewer from "./LessonViewer";

export default async function LessonDetailPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { courseId, lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
            quizzes: true,
            flashcards: true,
            course: {
                select: {
                    teacherId: true
                }
            }
        }
    });

    if (!lesson) notFound();

    const isOwner = session.user.id === lesson.course.teacherId;

    // Transform data to match component types
    const formattedQuizzes = lesson.quizzes.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    const formattedFlashcards = lesson.flashcards.map((f: any) => ({
        ...f,
        color: f.color || 'bg-blue-100'
    }));

    // Combine into a clean object for the client component
    const lessonData = {
        ...lesson,
        quizzes: formattedQuizzes,
        flashcards: formattedFlashcards
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <Link
                    href={`/dashboard/courses/${courseId}`}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Course
                </Link>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
                    {isOwner && <LessonActions courseId={courseId} lessonId={lesson.id} />}
                </div>
            </div>

            {/* Client Viewer with Tabs */}
            <LessonViewer lesson={lessonData} />
        </div>
    );
}
