import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ResourcesList from "./ResourcesList"; // We'll create this next

export default async function ResourcesPage() {
    const session = await auth();
    const userId = session?.user?.id;

    // 1. My Library (Courses saved by me)
    const libraryItems = userId ? await prisma.libraryItem.findMany({
        where: { userId: userId },
        include: {
            course: {
                include: { lessons: true, teacher: { select: { id: true, name: true, avatar: true } } }
            }
        },
        orderBy: { savedAt: 'desc' }
    }) : [];

    // Transform library items to simple course list for the UI, but keep reference if needed
    const myLibrary = libraryItems.map(item => ({ ...item.course, savedAt: item.savedAt }));

    // 2. Community Courses (Public courses)
    const communityCourses = await prisma.course.findMany({
        where: {
            isPublic: true,
            published: true,
            // We show all public courses, even my own, in community? Or exclude?
            // User said: "public search... community search... search if anybody has actually posted"
            // Let's exclude my OWN created courses from community if they are already in dashboard?
            // But maybe I want to see how it looks. Let's keep it simple.
        },
        include: {
            lessons: true,
            teacher: { select: { id: true, name: true, avatar: true } },
            savedBy: userId ? { where: { userId } } : undefined // To check if already saved
        },
        orderBy: { updatedAt: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-6">
            <ResourcesList myCourses={myLibrary} communityCourses={communityCourses} />
        </div>
    );
}
