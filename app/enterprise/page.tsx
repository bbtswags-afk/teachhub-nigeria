import StaticPage from "@/components/layout/StaticPage";
import { Building2 } from "lucide-react";

export default function EnterprisePage() {
    return (
        <StaticPage title="TeachHub for Enterprise">
            <div className="text-center mb-12">
                <Building2 size={64} className="mx-auto text-primary mb-6" />
                <h2 className="text-2xl font-bold mb-4">Transform Your Entire Institution</h2>
                <p className="text-slate-600 text-lg">Deploy TeachHub across your school network or state with our enterprise-grade solutions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className="font-bold text-xl mb-2">Centralized Management</h3>
                    <p className="text-slate-600">Control curriculum, monitor performance, and manage staff access from a single dashboard.</p>
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-2">Data Security</h3>
                    <p className="text-slate-600">Enterprise-grade security ensuring student data privacy and compliance with local regulations.</p>
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-2">Custom Integration</h3>
                    <p className="text-slate-600">Connect with your existing SIS (Student Information Systems) and LMS infrastructure.</p>
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-2">Dedicated Support</h3>
                    <p className="text-slate-600">24/7 priority support and dedicated account management for your institution.</p>
                </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-2xl text-center">
                <h3 className="font-bold text-xl mb-4">Ready to modernize your school?</h3>
                <p className="mb-6">Contact our sales team for a custom demo and quote.</p>
                <a href="mailto:enterprise@teachhub.ng" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">Contact Enterprise Sales</a>
            </div>
        </StaticPage>
    );
}
