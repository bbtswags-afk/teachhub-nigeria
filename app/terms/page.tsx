import StaticPage from "@/components/layout/StaticPage";

export default function TermsPage() {
    return (
        <StaticPage title="Terms of Service">
            <div className="text-slate-600 space-y-4">
                <p className="text-sm text-slate-400">Last updated: January 10, 2026</p>

                <h3 className="text-lg font-bold text-slate-900 mt-6">1. Agreement to Terms</h3>
                <p>By accessing our website and engaging with our services, you agree to be bound by these Terms of Service. If you do not agree to any part of the terms, then you may not access the Service.</p>

                <h3 className="text-lg font-bold text-slate-900 mt-6">2. Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on TeachHub's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

                <h3 className="text-lg font-bold text-slate-900 mt-6">3. Content Liability</h3>
                <p>Teacher-created content on TeachHub is the sole responsibility of the account holder. We do not endorse or guarantee the accuracy of any user-generated content.</p>

                <h3 className="text-lg font-bold text-slate-900 mt-6">4. Termination</h3>
                <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </div>
        </StaticPage>
    );
}
