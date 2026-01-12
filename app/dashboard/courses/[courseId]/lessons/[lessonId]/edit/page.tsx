import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditLessonForm from "./EditLessonForm";

export default async function EditLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { courseId, lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
            course: true,
            media: {
                orderBy: { order: 'asc' }
            },
            quizzes: {
                orderBy: { id: 'asc' }
            },
            flashcards: {
                orderBy: { id: 'asc' }
            }
        }
    });

    if (!lesson) notFound();

    // Authorization check
    if (lesson.course.teacherId !== session.user.id) {
        redirect("/dashboard");
    }

    return (
        <div className="pb-20">
            <EditLessonForm lesson={lesson} />
        </div>
    );
}
