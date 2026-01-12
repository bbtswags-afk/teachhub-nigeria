"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const SAMPLE_COURSES = [
    {
        title: "Introduction to Biology",
        subject: "Science",
        grade: "Grade 6",
        lessons: [
            { title: "Cells: The Building Blocks", summary: "Learn about plant and animal cells." },
            { title: "Photosynthesis Explained", summary: "How plants make their own food." },
            { title: "The Human Digestive System", summary: "Journey through the digestive tract." }
        ]
    },
    {
        title: "World History: Ancient Civilizations",
        subject: "Social Studies",
        grade: "Grade 5",
        lessons: [
            { title: "Ancient Egypt: Pyramids & Pharaohs", summary: "Exploration of the Nile valley." },
            { title: "The Roman Empire", summary: "Rise and fall of Rome." },
            { title: "Mesopotamia: Cradle of Civilization", summary: "Life between the rivers." }
        ]
    },
    {
        title: "Mathematics: Fractions & Decimals",
        subject: "Mathematics",
        grade: "Grade 4",
        lessons: [
            { title: "Understanding Fractions", summary: "Basics of parts of a whole." },
            { title: "Adding & Subtracting Fractions", summary: "Common denominators." },
            { title: "Introduction to Decimals", summary: "Converting fractions to decimals." }
        ]
    }
];

export async function seedLibrary() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        for (const courseData of SAMPLE_COURSES) {
            const course = await prisma.course.create({
                data: {
                    title: courseData.title,
                    subject: courseData.subject,
                    grade: courseData.grade,
                    teacherId: session.user.id,
                    published: true,
                    description: `A comprehensive course on ${courseData.subject}.`,
                    thumbnail: ["🧬", "🌍", "➗"][SAMPLE_COURSES.indexOf(courseData)],
                    color: ["bg-green-100", "bg-orange-100", "bg-blue-100"][SAMPLE_COURSES.indexOf(courseData)]
                }
            });

            for (const [index, lesson] of courseData.lessons.entries()) {
                await prisma.lesson.create({
                    data: {
                        title: lesson.title,
                        summary: lesson.summary,
                        order: index,
                        courseId: course.id,
                        slug: lesson.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
                        articleContent: `This is a generated content placeholder for **${lesson.title}**. \n\n In this lesson, we cover key concepts related to ${courseData.subject}. Students will learn about the fundamental principles and apply them in various contexts. \n\n ## Key Takeaways \n - Concept 1 \n - Concept 2 \n - Concept 3`,
                        lessonPlan: "1. Introduction (5 mins)\n2. Core Activity (20 mins)\n3. Assessment (10 mins)",
                        quizzes: {
                            create: {
                                question: `What is the main topic of ${lesson.title}?`,
                                options: JSON.stringify(["Option A", "Option B", "Option C", "Option D"]),
                                correctOption: 0
                            }
                        }
                    }
                });
            }
        }
        revalidatePath("/resources");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Seed Error:", error);
        throw new Error("Failed to seed library");
    }
}
