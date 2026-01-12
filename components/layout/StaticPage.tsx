import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StaticPage({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <nav className="bg-white border-b border-slate-200 px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-bold">Back to Home</span>
                    </Link>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{title}</h1>
                <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    {children}
                </div>
            </main>
        </div>
    );
}
