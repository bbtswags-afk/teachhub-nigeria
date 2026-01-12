import { AppLayout } from "@/components/layout/AppLayout";
import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: 'Dashboard | TeachHub Lagos',
    description: 'Teacher Dashboard',
};

import { auth } from "@/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    let user = session?.user;

    if (user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { name: true, email: true, avatar: true }
        });
        if (dbUser) {
            user = { ...user, ...dbUser };
        }
    }

    return <AppLayout user={user}>{children}</AppLayout>;
}
