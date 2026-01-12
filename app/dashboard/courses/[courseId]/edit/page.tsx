import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditCourseForm from "./EditCourseForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { courseId } = await params;

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            teacherId: session.user.id
        }
    });

    if (!course) notFound();

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Link
                href={`/dashboard/courses/${courseId}`}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
            >
                <ArrowLeft size={18} /> Cancel Editing
            </Link>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Course</h1>
                <EditCourseForm course={course} />
            </div>
        </div>
    );
}
