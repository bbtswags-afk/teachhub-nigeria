import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppLayout } from "@/components/layout/AppLayout";
import { Bell, CheckCircle, Info } from "lucide-react";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const [user, notifications] = await Promise.all([
        prisma.user.findUnique({ where: { id: session.user.id } }),
        prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return (
        <AppLayout user={user}>
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="text-center p-8 text-slate-400">
                            <Bell className="mx-auto mb-2 opacity-50" size={32} />
                            <p>No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((note) => (
                            <div key={note.id} className={`bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 ${note.isRead ? 'opacity-60' : ''}`}>
                                <div className="w-10 h-10 bg-indigo-50 text-primary rounded-full flex items-center justify-center shrink-0">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{note.title}</p>
                                    <p className="text-sm text-slate-500">{note.message}</p>
                                    <span className="text-xs text-slate-400 mt-2 block">
                                        {new Date(note.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
