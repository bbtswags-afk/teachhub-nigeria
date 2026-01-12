"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLibraryItem(courseId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "Unauthorized" };
    }

    try {
        const existingItem = await prisma.libraryItem.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId,
                },
            },
        });

        if (existingItem) {
            await prisma.libraryItem.delete({
                where: { id: existingItem.id },
            });
            revalidatePath("/resources");
            return { saved: false };
        } else {
            await prisma.libraryItem.create({
                data: {
                    userId: session.user.id,
                    courseId: courseId,
                },
            });
            revalidatePath("/resources");
            return { saved: true };
        }
    } catch (error) {
        console.error("Library Toggle Error:", error);
        return { message: "Failed to update library" };
    }
}
