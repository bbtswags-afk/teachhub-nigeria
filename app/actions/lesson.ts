"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Validation Schemas
const QuizSchema = z.object({
    question: z.string().min(1, "Question required"),
    options: z.array(z.string()).min(2, "At least 2 options"),
    correctOption: z.coerce.number().min(0),
});

const FlashcardSchema = z.object({
    front: z.string().min(1, "Front text required"),
    back: z.string().min(1, "Back text required"),
    color: z.string().optional(),
    image: z.string().optional(),
});

const MediaSchema = z.object({
    url: z.string(),
    type: z.string(), // "video" or "image"
});

const LessonSchema = z.object({
    title: z.string().min(3, "Title required"),
    summary: z.string().optional(),
    lessonPlan: z.string().optional(),
    gameUrl: z.string().optional(),
    pdfUrl: z.string().optional(),
    article: z.string().optional(),
    media: z.array(MediaSchema).optional(),
    slug: z.string().optional(), // We'll generate if empty
    quizzes: z.array(QuizSchema).optional(),
    flashcards: z.array(FlashcardSchema).optional(),
});

export async function createLesson(courseId: string, data: any) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const result = LessonSchema.safeParse(data);

    if (!result.success) {
        const formatted = result.error.flatten();
        const fieldErrors = Object.entries(formatted.fieldErrors)
            .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
            .join(' | ');

        console.error("Validation Error:", fieldErrors);
        throw new Error(`Invalid Data: ${fieldErrors}`);
    }

    const { title, summary, lessonPlan, gameUrl, pdfUrl, article, media, quizzes, flashcards } = result.data;
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    try {
        // Create Lesson with nested relations
        await prisma.lesson.create({
            data: {
                title,
                slug,
                summary,
                lessonPlan,
                gameUrl,
                pdfUrl,
                courseId,
                articleContent: article,
                media: {
                    create: media?.map((m, index) => ({
                        url: m.url,
                        type: m.type,
                        order: index
                    }))
                },
                quizzes: {
                    create: quizzes?.map(q => ({
                        question: q.question,
                        options: JSON.stringify(q.options),
                        correctOption: q.correctOption
                    }))
                },
                flashcards: {
                    create: flashcards?.map(f => ({
                        front: f.front,
                        back: f.back,
                        color: f.color || "bg-blue-100",
                        image: f.image
                    }))
                }
            }
        });

        // Create Notification
        await prisma.notification.create({
            data: {
                userId: session.user.id,
                title: "Lesson Posted",
                message: `You successfully posted the lesson: "${title}"`,
            }
        });

    } catch (error) {
        console.error("Failed to create lesson:", error);
        return { message: "Database Error: Failed to Create Lesson" }; // Return object, don't throw, to match frontend expect
    }

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true };
}

export async function deleteLesson(lessonId: string, courseId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership via course
    const lesson = await prisma.lesson.findFirst({
        where: {
            id: lessonId,
            course: {
                teacherId: session.user.id
            }
        }
    });

    if (!lesson) throw new Error("Lesson not found or unauthorized");

    await prisma.lesson.delete({
        where: { id: lessonId }
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true };
}

export async function updateLesson(lessonId: string, courseId: string, data: any) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const existingLesson = await prisma.lesson.findFirst({
        where: { id: lessonId, course: { teacherId: session.user.id } }
    });

    if (!existingLesson) throw new Error("Unauthorized");

    const result = LessonSchema.safeParse(data);
    if (!result.success) throw new Error("Invalid Data");

    const { title, summary, lessonPlan, gameUrl, pdfUrl, article, media, quizzes, flashcards } = result.data;
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    await prisma.lesson.update({
        where: { id: lessonId },
        data: {
            title,
            slug,
            summary,
            lessonPlan,
            gameUrl,
            pdfUrl,
            articleContent: article,
            media: {
                deleteMany: {},
                create: media?.map((m, index) => ({
                    url: m.url,
                    type: m.type,
                    order: index
                }))
            },
            quizzes: {
                deleteMany: {},
                create: quizzes?.map(q => ({
                    question: q.question,
                    options: JSON.stringify(q.options),
                    correctOption: q.correctOption
                }))
            },
            flashcards: {
                deleteMany: {},
                create: flashcards?.map(f => ({
                    front: f.front,
                    back: f.back,
                    color: f.color || "bg-blue-100",
                    image: f.image
                }))
            }
        }
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/dashboard/courses/${courseId}/lessons/${lessonId}`);
    return { success: true };
}
