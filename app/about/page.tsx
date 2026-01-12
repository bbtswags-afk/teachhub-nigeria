import StaticPage from "@/components/layout/StaticPage";

export default function AboutPage() {
    return (
        <StaticPage title="About TeachHub">
            <div className="prose prose-lg text-slate-600">
                <img src="/about-image.png" alt="Team" className="w-full h-64 object-cover rounded-2xl mb-8" />

                <h3>Our Mission</h3>
                <p>
                    At TeachHub, we believe that technology is the great equalizer. Our mission is to empower African educators with world-class digital tools that are accessible, affordable, and relevant to the local context.
                </p>

                <h3>Who We Are</h3>
                <p>
                    Founded in Lagos in 2024, we are a team of educators, engineers, and designers passionate about the future of learning. We witnessed firsthand the challenges faced by teachers—overcrowded classrooms, lack of resources, and administrative burnout—and decided to build a solution.
                </p>

                <h3>Our Values</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Empathy First:</strong> We build for the teacher in the classroom, not just the administrator in the office.</li>
                    <li><strong>Accessibility:</strong> Our tools must work in low-bandwidth and offline environments.</li>
                    <li><strong>Community:</strong> Education is a collective effort. We foster a community of practice among our users.</li>
                </ul>
            </div>
        </StaticPage>
    );
}
