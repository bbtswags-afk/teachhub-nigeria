import { AppLayout } from "@/components/layout/AppLayout";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function GamesLayout({
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
