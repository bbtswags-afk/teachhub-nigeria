import StaticPage from "@/components/layout/StaticPage";
import { Briefcase } from "lucide-react";

export default function CareersPage() {
    return (
        <StaticPage title="Join Our Mission">
            <div className="text-center mb-12">
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">We're looking for passionate individuals who want to shape the future of education in Africa.</p>
            </div>

            <div className="space-y-6">
                <JobCard
                    title="Senior Frontend Engineer"
                    dept="Engineering"
                    loc="Lagos / Remote"
                    type="Full-time"
                />
                <JobCard
                    title="Curriculum Developer (STEM)"
                    dept="Content"
                    loc="Lagos"
                    type="Contract"
                />
                <JobCard
                    title="School Success Manager"
                    dept="Sales"
                    loc="Abuja"
                    type="Full-time"
                />
            </div>

            <div className="mt-12 text-center text-slate-500">
                <p>Don't see a role that fits? <a href="mailto:careers@teachhub.ng" className="text-primary hover:underline">Email us your CV</a>.</p>
            </div>
        </StaticPage>
    );
}

function JobCard({ title, dept, loc, type }: { title: string, dept: string, loc: string, type: string }) {
    return (
        <div className="flex items-center justify-between p-6 border border-slate-200 rounded-xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer bg-white group">
            <div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
                <div className="flex gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {dept}</span>
                    <span>•</span>
                    <span>{loc}</span>
                </div>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{type}</span>
        </div>
    )
}
