import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PlayCircle, Clock, CheckCircle, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getDashboardData(userId: string, query?: string) {
    const courses = await prisma.course.findMany({
        where: {
            teacherId: userId,
            title: query ? { contains: query } : undefined
        },
        include: { _count: { select: { lessons: true } } }
    });

    // Real stats calculation could go here
    return { courses };
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { q } = await searchParams; // Await the params
    const { courses } = await getDashboardData(session.user.id, q);
    const hasCourses = courses.length > 0;

    return (
        <div className="space-y-8 w-full max-w-[1600px] mx-auto">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Welcome back, {session.user.name || "Teacher"}! 👋</h1>
                    <p className="text-slate-500 mt-2">Here's what's happening with your classes today.</p>
                </div>
                <Link
                    href="/dashboard/create-course"
                    className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                >
                    <Plus size={20} />
                    Create Course
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Courses</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{courses.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Lessons Created</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {courses.reduce((acc: number, c: any) => acc + c._count.lessons, 0)}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Students Active</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">--</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PlayCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Your Courses</h2>
                </div>

                {!hasCourses ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No courses yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">Create your first course to start adding lessons and quizzes.</p>
                        <Link
                            href="/dashboard/create-course"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                        >
                            Create a Course <PlayCircle size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <Link href={`/dashboard/courses/${course.id}`} key={course.id} className="block group">
                                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                                    <div className={`h-32 ${course.color || "bg-blue-100 text-blue-600"} flex items-center justify-center text-4xl`}>
                                        {course.thumbnail || "📚"}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                                {course.grade || "General"}
                                            </span>
                                            <span className="text-xs text-slate-400">{course._count.lessons} Lessons</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{course.subject}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Activity Section could be added back if we track Lesson History */}
        </div>
    );
}
