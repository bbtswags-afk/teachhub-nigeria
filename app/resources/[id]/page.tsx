"use client";

import { use } from "react";
import { RESOURCES } from "@/data/mocks";
import { ArrowLeft, Download, Share2, Play, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const resource = RESOURCES.find(r => r.id === parseInt(unwrappedParams.id));

    if (!resource) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/resources" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to Library
            </Link>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Hero / Preview */}
                <div className={`h-64 md:h-80 ${resource.color} flex flex-col items-center justify-center relative`}>
                    <div className="text-8xl mb-4">{resource.thumbnail}</div>
                    <button className="bg-white/90 hover:bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg backdrop-blur-sm transition-transform hover:scale-105 flex items-center gap-2">
                        <Play size={20} className="fill-current" />
                        Start Learning
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                    {resource.subject}
                                </span>
                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                    {resource.grade}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{resource.title}</h1>
                            <p className="text-slate-500 text-lg leading-relaxed">{resource.description}</p>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-3 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors" title="Share">
                                <Share2 size={20} />
                            </button>
                            <button className="p-3 text-white bg-primary hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-colors flex items-center gap-2 font-medium">
                                <Download size={20} />
                                <span className="hidden md:inline">Download Materials</span>
                            </button>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Lesson Objectives</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0">
                            {[1, 2, 3, 4].map((item) => (
                                <li key={item} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                    <span className="text-slate-700">Understand key concepts and terminology related to the topic.</span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Related Materials</h3>
                        <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Worksheet: Practice Exercises</p>
                                    <p className="text-xs text-slate-500">PDF • 2.4 MB</p>
                                </div>
                            </div>
                            <Download size={18} className="text-slate-400 group-hover:text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
