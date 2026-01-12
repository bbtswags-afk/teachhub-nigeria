"use client";

import { startTransition, useState, useMemo } from "react";
import { Search, Filter, PlayCircle, FileText, BookOpen, Loader2, Globe, Lock, User as UserIcon, Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { seedLibrary } from "@/app/actions/seed";
import { toggleLibraryItem } from "@/app/actions/library";
import { PRIMARY_GRADES, SUBJECTS as ALL_SUBJECTS } from "@/app/lib/constants";

const SUBJECTS = ["All", ...ALL_SUBJECTS];
const GRADES = ["All", ...PRIMARY_GRADES];

// Define types for better clarity
type CourseKey = {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    color: string;
    thumbnail: string;
    isPublic?: boolean;
    teacher?: { id?: string; name: string | null, avatar: string | null };
    savedBy?: any[]; // Check if saved
};
type LessonKey = { id: string; title: string; summary: string; courseId: string };
type ResourceItem =
    | { type: 'course'; data: CourseKey }
    | { type: 'lesson'; data: LessonKey; course: CourseKey };

import { useSearchParams } from "next/navigation";

// ... (imports remain)

export default function ResourcesList({ myCourses, communityCourses }: { myCourses: any[], communityCourses: any[] }) {
    const [activeTab, setActiveTab] = useState<'my' | 'community'>('my');
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q") || ""; // Derived from URL
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [selectedGrade, setSelectedGrade] = useState("All");
    const [seeding, setSeeding] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Switch logical source based on tab
    const currentSource = activeTab === 'my' ? myCourses : communityCourses;

    // 1. Flatten Data: Just use Courses (User requested to hide lessons)
    const allResources = useMemo(() => {
        return currentSource.map(course => ({ type: 'course' as const, data: course }));
    }, [currentSource]);

    // 2. Filter Data
    const filteredResources = useMemo(() => {
        return allResources.filter(item => {
            const data = item.data as any; // Common fields like title

            // Match Search
            const searchContent = searchQuery.toLowerCase();
            const titleMatch = data.title?.toLowerCase().includes(searchContent);
            const descMatch = data.description?.toLowerCase().includes(searchContent);

            const matchesSearch = !searchQuery || titleMatch || descMatch;

            // Match Filters
            const matchesSubject = selectedSubject === "All" || data.subject === selectedSubject;
            const matchesGrade = selectedGrade === "All" || data.grade === selectedGrade;

            return matchesSearch && matchesSubject && matchesGrade;
        });
    }, [allResources, searchQuery, selectedSubject, selectedGrade]);

    const handleSeed = async () => {
        setSeeding(true);
        try {
            await seedLibrary();
            alert("Library populated successfully!");
            window.location.reload(); // simple reload to see new data
        } catch (e) {
            alert("Failed to seed library");
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Resource Library</h1>
                    <p className="text-slate-500">Access curriculum-mapped teaching materials.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Only show Seed button on My Library if empty */}
                    {activeTab === 'my' && myCourses.length === 0 && (
                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
                        >
                            {seeding ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
                            Populate Library
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('my')}
                    className={clsx(
                        "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === 'my' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    My Library
                </button>
                <button
                    onClick={() => setActiveTab('community')}
                    className={clsx(
                        "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === 'community' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Community
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-between w-full md:cursor-default"
                >
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Filter size={18} />
                        <span>Filters</span>
                        {(selectedSubject !== "All" || selectedGrade !== "All") && (
                            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full md:hidden">
                                Active
                            </span>
                        )}
                    </div>
                    {showFilters ? <ChevronUp className="md:hidden text-slate-400" /> : <ChevronDown className="md:hidden text-slate-400" />}
                </button>

                <div className={clsx("space-y-4 md:block mt-4 md:mt-4", showFilters ? "block" : "hidden")}>
                    <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={clsx(
                                    "px-4 py-1.5 text-sm rounded-full transition-colors border",
                                    selectedSubject === subject
                                        ? "bg-indigo-50 border-indigo-200 text-primary font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                        {GRADES.map(grade => (
                            <button
                                key={grade}
                                onClick={() => setSelectedGrade(grade)}
                                className={clsx(
                                    "px-4 py-1.5 text-sm rounded-full transition-colors border",
                                    selectedGrade === grade
                                        ? "bg-indigo-50 border-indigo-200 text-primary font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((item, idx) => {
                    const uniqueKey = `c-${item.data.id}`;
                    const resource = item.data as CourseKey;

                    return (
                        <Link href={`/dashboard/courses/${resource.id}?back=/resources`} key={uniqueKey} className="block group">
                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all h-full flex flex-col hover:-translate-y-1">
                                <div className={`h-40 ${resource.color || 'bg-slate-100'} flex items-center justify-center text-5xl relative`}>
                                    {resource.thumbnail}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold shadow-sm text-slate-700">
                                        Course
                                    </div>
                                    {activeTab === 'my' && (
                                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full text-slate-700 shadow-sm" title={resource.isPublic ? "Shared Online" : "Private"}>
                                            {resource.isPublic ? <Globe size={14} className="text-green-600" /> : <Lock size={14} />}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                        <span className="bg-slate-100 px-2 py-1 rounded-md">{resource.grade}</span>
                                        <span>•</span>
                                        <span>{resource.subject}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors mb-2">{resource.title}</h3>

                                    {/* Attribution for Community */}
                                    {activeTab === 'community' && resource.teacher && (
                                        <div className="flex flex-col gap-1 text-xs text-slate-500 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                                    <UserIcon size={12} />
                                                </div>
                                                <span className="font-medium">{resource.teacher.name || "Teacher"}</span>
                                            </div>
                                            {resource.teacher.id && (
                                                <span className="text-[10px] text-slate-400 pl-7 font-mono">ID: {resource.teacher.id}</span>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{resource.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center text-primary text-sm font-medium hover:underline">
                                            View Course <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                        {activeTab === 'community' && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent navigation
                                                    startTransition(async () => {
                                                        await toggleLibraryItem(resource.id);
                                                    });
                                                }}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors z-20"
                                                title={resource.savedBy && resource.savedBy.length > 0 ? "Remove from Library" : "Save to Library"}
                                            >
                                                {resource.savedBy && resource.savedBy.length > 0 ? (
                                                    <BookmarkCheck size={20} className="text-indigo-600 fill-indigo-50" />
                                                ) : (
                                                    <Bookmark size={20} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredResources.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <BookOpen className="mx-auto mb-4 text-slate-300" size={48} />
                    <p className="text-lg font-medium">No resources found in {activeTab === 'my' ? "your library" : "the community"}.</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                    {activeTab === 'my' && (
                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-colors"
                        >
                            {seeding ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
                            Populate Library
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
