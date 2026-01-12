import { AppLayout } from "@/components/layout/AppLayout";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function CreateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : undefined;

    return <AppLayout user={user}>{children}</AppLayout>;
}
