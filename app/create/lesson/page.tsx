import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import LessonForm from "./lesson-form";
import { redirect } from "next/navigation";

export default async function CreateLessonPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    // Fetch courses owned by the teacher to attach the lesson to
    const courses = await prisma.course.findMany({
        where: { teacherId: session.user.id },
        select: { id: true, title: true }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Create New Lesson</h1>
            <LessonForm courses={courses} />
        </div>
    );
}
