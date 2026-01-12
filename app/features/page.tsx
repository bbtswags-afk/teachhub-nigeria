import StaticPage from "@/components/layout/StaticPage";
import { CheckCircle } from "lucide-react";

export default function FeaturesPage() {
    return (
        <StaticPage title="Platform Features">
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-primary">Lesson Planning</h2>
                    <p className="text-slate-600 mb-4">Create engaging lessons in minutes, not hours. Our intuitive builder lets you combine text, video, and interactive elements seamlessly.</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Rich Text Editor", "Video Integration", "Curriculum Mapping", "Resource Library"].map(i => (
                            <li key={i} className="flex items-center gap-2 text-slate-700">
                                <CheckCircle size={16} className="text-green-500" /> {i}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-primary">Student Engagement</h2>
                    <p className="text-slate-600 mb-4">Keep students motivated with gamified learning tools designed for the modern classroom.</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Interactive Quizzes", "Graphical Flashcards", "Leaderboards", "Instant Feedback"].map(i => (
                            <li key={i} className="flex items-center gap-2 text-slate-700">
                                <CheckCircle size={16} className="text-green-500" /> {i}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-primary">Administration</h2>
                    <p className="text-slate-600 mb-4">Manage your school's digital transition with robust admin tools.</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Teacher Analytics", "Student Progress Tracking", "Attendance Management", "Bulk Data Import"].map(i => (
                            <li key={i} className="flex items-center gap-2 text-slate-700">
                                <CheckCircle size={16} className="text-green-500" /> {i}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </StaticPage>
    );
}
