"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const CourseSchema = z.object({
    title: z.string().min(3, "Title too short"),
    description: z.string().optional(),
    subject: z.string().min(2, "Subject required"),
    grade: z.string().min(1, "Grade required"),
    isPublic: z.coerce.boolean().optional(),
});

export async function createCourse(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "Unauthorized" };
    }

    const validatedFields = CourseSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields",
        };
    }

    const { title, description, subject, grade, isPublic } = validatedFields.data;
    let courseId;

    try {
        const course = await prisma.course.create({
            data: {
                title,
                description: description || "",
                subject,
                grade,
                isPublic: isPublic || false,
                teacherId: session.user.id,
                color: "bg-blue-100 text-blue-600", // Default
                thumbnail: "📚", // Default
                published: true,
            },
        });
        courseId = course.id;

        // Auto-add to creator's library
        await prisma.libraryItem.create({
            data: {
                userId: session.user.id,
                courseId: course.id
            }
        });
    } catch (error) {
        console.error("Create Course Error:", error);
        return { message: "Database Error: Failed to Create Course." };
    }

    revalidatePath("/dashboard");
    redirect(`/dashboard/courses/${courseId}`);
}

export async function deleteCourse(courseId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.course.delete({
        where: {
            id: courseId,
            teacherId: session.user.id
        }
    });

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateCourse(courseId: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validatedFields = CourseSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields",
        };
    }

    const { title, description, subject, grade, isPublic } = validatedFields.data;

    try {
        await prisma.course.update({
            where: {
                id: courseId,
                teacherId: session.user.id
            },
            data: {
                title,
                description,
                subject,
                grade,
                isPublic: isPublic || false
            }
        });
    } catch (error) {
        return { message: "Database Error" };
    }

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath("/dashboard");
    return { success: true };
}

export async function toggleCourseVisibility(courseId: string, isPublic: boolean) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await prisma.course.update({
            where: {
                id: courseId,
                teacherId: session.user.id
            },
            data: { isPublic }
        });
        revalidatePath(`/dashboard/courses/${courseId}`);
        revalidatePath("/dashboard");
        revalidatePath("/resources"); // Update library views
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle visibility:", error);
        return { success: false, message: "Database Error" };
    }
}
