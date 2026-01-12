import StaticPage from "@/components/layout/StaticPage";

export default function PrivacyPage() {
    return (
        <StaticPage title="Privacy Policy">
            <div className="text-slate-600 space-y-4">
                <p className="text-sm text-slate-400">Last updated: January 10, 2026</p>

                <h3 className="text-lg font-bold text-slate-900 mt-6">1. Introduction</h3>
                <p>TeachHub ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>

                <h3 className="text-lg font-bold text-slate-900 mt-6">2. Data We Collect</h3>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                <ul className="list-disc pl-6">
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                </ul>

                <h3 className="text-lg font-bold text-slate-900 mt-6">3. How We Use Your Data</h3>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul className="list-disc pl-6">
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                </ul>
            </div>
        </StaticPage>
    );
}
