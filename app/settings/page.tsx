import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsForm from "./settings-form";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, role: true, school: true, avatar: true, address: true, id: true }
    });

    if (!user) redirect("/login");

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
            <SettingsForm user={user} />
        </div>
    );
}
