"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().optional().nullable(),
    avatar: z.string().optional().nullable(),
});

const PasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "Unauthorized" };
    }

    const rawAvatar = formData.get("avatar");
    // If empty string, convert to null to remove from DB
    const avatar = rawAvatar === "" ? null : rawAvatar;

    const data = {
        name: formData.get("name"),
        address: formData.get("address"),
        avatar: avatar,
    };

    const result = ProfileSchema.safeParse(data);

    if (!result.success) {
        return { message: "Invalid Data", errors: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: result.data.name,
                // @ts-ignore: Field exists in schema but Prisma Client is out of sync due to file locking
                address: result.data.address,
                avatar: result.data.avatar,
            }
        });

        revalidatePath("/settings");
        return { message: "Profile Updated Successfully", success: true };
    } catch (error) {
        console.error(error);
        return { message: "Failed to update profile" };
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "Unauthorized" };
    }

    const result = PasswordSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { message: "Invalid Data", errors: result.error.flatten().fieldErrors };
    }

    const { oldPassword, newPassword } = result.data;

    try {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || !user.password) {
            return { message: "User not found" };
        }

        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) {
            return { message: "Incorrect old password" };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        return { message: "Password Changed Successfully", success: true };
    } catch (error) {
        console.error(error);
        return { message: "Failed to change password" };
    }
}
