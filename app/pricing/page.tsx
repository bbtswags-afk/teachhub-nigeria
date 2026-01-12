import StaticPage from "@/components/layout/StaticPage";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <StaticPage title="Simple, Transparent Pricing">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose">
                    {/* Free Tier */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900">Basic</h3>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-900">₦0</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <p className="mt-4 text-slate-500 text-sm">For individual teachers just getting started.</p>
                        <ul className="mt-8 space-y-3">
                            {["Up to 3 Courses", "Basic Lesson Builder", "50 Students", "Community Support"].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-primary" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-8 w-full py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Current Plan</button>
                    </div>

                    {/* Pro Tier */}
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden text-white transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary to-transparent w-20 h-20 opacity-50"></div>
                        <h3 className="text-xl font-bold">Pro Teacher</h3>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold">₦5,000</span>
                            <span className="text-slate-400">/month</span>
                        </div>
                        <p className="mt-4 text-slate-400 text-sm">For power users who want full access.</p>
                        <ul className="mt-8 space-y-3">
                            {["Unlimited Courses", "Advanced Analytics", "Unlimited Students", "Priority Support", "AI Quiz Generation"].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                                    <Check size={16} className="text-primary" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-8 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/50">Upgrade Now</button>
                    </div>

                    {/* School Tier */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900">Schools</h3>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-900">Custom</span>
                        </div>
                        <p className="mt-4 text-slate-500 text-sm">For entire institutions.</p>
                        <ul className="mt-8 space-y-3">
                            {["Admin Dashboard", "Teacher Management", "Custom Domain", "Onboarding Training", "SLA Support"].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-primary" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-8 w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">Contact Sales</button>
                    </div>
                </div>
            </StaticPage>
        </div>
    );
}
