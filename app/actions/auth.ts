"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    school: z.string().min(2, "School name is required"),
});

export async function registerTeacher(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Register.",
        };
    }

    const { name, email, password, school } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { message: "Email already in use." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "TEACHER",
                school,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            },
        });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return { message: `Database Error: ${error.message || "Failed to Create User."}` };
    }

    redirect("/login");
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        console.log("Attempting sign in via server action...");
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/dashboard',
        });
        console.log("Sign in successful (should redirect)");
    } catch (error) {
        // If it's a specific AuthError, verify it.
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }

        // For everything else (including redirects), rethrow it.
        // Don't try to parse the error message potentially inaccurately.
        throw error;
    }
}
