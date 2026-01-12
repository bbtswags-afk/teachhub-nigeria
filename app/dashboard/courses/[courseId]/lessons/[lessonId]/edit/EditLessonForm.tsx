"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, Upload, Video, FileText, HelpCircle, Layers, Plus, Trash, Image as ImageIcon, Check, Gamepad2, AlignLeft, GripVertical, Move, X, ImagePlus } from "lucide-react";
import { updateLesson } from "@/app/actions/lesson";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/ui/RichTextEditor";
import BlockRenderer, { ContentBlock } from "@/components/ui/BlockRenderer";
import QuizPlayer from "@/components/ui/QuizPlayer";
import FlashcardDeck from "@/components/ui/FlashcardDeck";

// Types
type QuizParams = {
    question: string;
    options: string[];
    correctOption: number;
};
type FlashcardParams = {
    front: string;
    back: string;
    color: string;
    image?: string;
};

type MediaItem = {
    id: string;
    url: string;
    type: 'video' | 'image';
    file?: File; // For preview/upload handling
};


type FormData = {
    title: string;
    summary: string;
    lessonPlan: string;
    contentBlocks: ContentBlock[];
    gameUrl: string;
    quizzes: QuizParams[];
    flashcards: FlashcardParams[];
};

export default function EditLessonForm({ lesson }: { lesson: any }) {
    const params = useParams();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mediaInputType, setMediaInputType] = useState<'url' | 'upload'>('url');
    const [tempMediaUrl, setTempMediaUrl] = useState("");

    // Initialize state
    const [formData, setFormData] = useState<FormData>(() => {
        // Parse initial content
        let initialBlocks: ContentBlock[] = [];
        try {
            const parsed = JSON.parse(lesson.articleContent || "[]");
            if (Array.isArray(parsed)) {
                initialBlocks = parsed;
            } else {
                // Fallback for empty or invalid JSON that isn't legacy string
                initialBlocks = lesson.articleContent ? [{ id: "legacy-1", type: "text", content: lesson.articleContent }] : [];
            }
        } catch (e) {
            // Legacy content (plain HTML string)
            initialBlocks = lesson.articleContent ? [{ id: "legacy-1", type: "text", content: lesson.articleContent }] : [];
        }

        // If blocks are empty but we have legacy media, append them? 
        // Decision: Let's not auto-merge legacy media to avoid duplication if we re-save. 
        // But for better UX, if no blocks exist, we might want to start fresh.

        return {
            title: lesson.title || "",
            summary: lesson.summary || "",
            lessonPlan: lesson.lessonPlan || "",
            contentBlocks: initialBlocks.length > 0 ? initialBlocks : [{ id: "start-1", type: "text", content: "" }],
            gameUrl: lesson.gameUrl || "",
            quizzes: lesson.quizzes?.length > 0 ? lesson.quizzes.map((q: any) => ({
                question: q.question,
                options: JSON.parse(q.options),
                correctOption: q.correctOption
            })) : [{ question: "", options: ["", "", "", ""], correctOption: 0 }],
            flashcards: lesson.flashcards?.length > 0 ? lesson.flashcards.map((f: any) => ({
                front: f.front,
                back: f.back,
                color: f.color || "bg-blue-100"
            })) : [{ front: "", back: "", color: "bg-blue-100" }]
        };
    });

    const steps = [
        { id: 1, title: "Basics", icon: FileText },
        { id: 2, title: "Lesson Plan", icon: AlignLeft },
        { id: 3, title: "Lesson Content", icon: Layers },
        // { id: 4, title: "Media", icon: Video }, // Merged
        { id: 4, title: "Game", icon: Gamepad2 },
        { id: 5, title: "Quiz", icon: HelpCircle },
        { id: 6, title: "Flashcards", icon: Layers },
        { id: 7, title: "Review", icon: Check },
    ];

    const updateField = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Quiz Helpers
    const handleAuditQuiz = (index: number, field: string, value: any) => {
        const newQuizzes = [...formData.quizzes];
        if (field === "question") newQuizzes[index].question = value;
        if (field === "correctOption") newQuizzes[index].correctOption = value;
        if (field.startsWith("option-")) {
            const optIndex = parseInt(field.split("-")[1]);
            newQuizzes[index].options[optIndex] = value;
        }
        updateField("quizzes", newQuizzes);
    };

    const addQuiz = () => updateField("quizzes", [...formData.quizzes, { question: "", options: ["", "", "", ""], correctOption: 0 }]);
    const removeQuiz = (index: number) => updateField("quizzes", formData.quizzes.filter((_, i) => i !== index));

    // Flashcard Helpers
    const handleFlashcardChange = (index: number, field: keyof FlashcardParams, value: any) => {
        const newCards = [...formData.flashcards];
        newCards[index] = { ...newCards[index], [field]: value };
        updateField("flashcards", newCards);
    };

    const addFlashcard = () => updateField("flashcards", [...formData.flashcards, { front: "", back: "", color: "bg-blue-100" }]);
    const removeFlashcard = (index: number) => updateField("flashcards", formData.flashcards.filter((_, i) => i !== index));

    // Media Helpers
    // Content Block Helpers
    const addTextBlock = () => {
        updateField("contentBlocks", [...formData.contentBlocks, { id: Math.random().toString(36).substr(2, 9), type: 'text', content: '' }]);
    };

    const addMediaBlock = (url: string, type: 'video' | 'image') => {
        if (!url) return;
        let finalUrl = url;
        if (url.includes("<iframe")) {
            const match = url.match(/src="([^"]+)"/);
            if (match && match[1]) finalUrl = match[1];
        }
        const newBlock: ContentBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'media',
            url: finalUrl,
            mediaType: type
        };
        updateField("contentBlocks", [...formData.contentBlocks, newBlock]);
        setTempMediaUrl("");
    };

    const removeBlock = (id: string) => {
        updateField("contentBlocks", formData.contentBlocks.filter(b => b.id !== id));
    };

    const updateBlockContent = (id: string, content: string) => {
        const newBlocks = formData.contentBlocks.map(b => b.id === id ? { ...b, content } : b);
        updateField("contentBlocks", newBlocks);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Determine type before upload for UI feedback if needed
                const type = file.type.startsWith('video') ? 'video' : 'image';

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();

                if (data.success) {
                    addMediaBlock(data.url, type);
                } else {
                    alert("Upload failed: " + (data.message || "Unknown error"));
                }
            } catch (error) {
                console.error("Upload error:", error);
                alert("Upload failed. Please try again.");
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            alert("Please provide a lesson title (Step 1)");
            setStep(1);
            return;
        }
        setLoading(true);
        try {
            // Extract media for the legacy relation (optional, but good for DB stats if needed)
            const extractedMedia = formData.contentBlocks
                .filter(b => b.type === 'media')
                .map(b => ({ url: (b as any).url, type: (b as any).mediaType }));

            const cleanData = {
                ...formData,
                article: JSON.stringify(formData.contentBlocks), // Save blocks as JSON string
                media: extractedMedia
            };
            await updateLesson(lesson.id, params.courseId as string, cleanData);
            setSuccess(true);
        } catch (e) {
            console.error(e);
            alert("Failed to update lesson");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Success!</h2>
                    <p className="text-slate-500 mb-8 text-lg">Lesson has been updated successfully.</p>
                    <button
                        onClick={() => router.push(`/dashboard/courses/${params.courseId}`)}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                        Return to Course
                    </button>
                </div>
            </div>
        );
    }

    // Render Steps
    const renderStep1 = () => (
        <div className="space-y-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Lesson Basics</h2>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Lesson Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-lg font-semibold"
                    placeholder="e.g. Introduction to Photosynthesis"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Lesson Summary (Teacher Notes)</label>
                <textarea
                    value={formData.summary}
                    onChange={(e) => updateField("summary", e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none h-32"
                    placeholder="Brief overview of what you will teach..."
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Lesson Plan</h2>
            <p className="text-slate-500 text-sm mb-4">Detailed step-by-step plan for delivering this lesson.</p>
            <RichTextEditor
                content={formData.lessonPlan}
                onChange={(html) => updateField("lessonPlan", html)}
            />
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Lesson Content Builder</h2>
                <p className="text-slate-500 text-sm">Combine text and media blocks to create an engaging lesson.</p>
            </div>

            <Reorder.Group axis="y" values={formData.contentBlocks} onReorder={(newOrder) => updateField("contentBlocks", newOrder)} className="space-y-6">
                {formData.contentBlocks.map((block, index) => (
                    <Reorder.Item key={block.id} value={block} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group relative">
                        {/* Drag Handle & Remove */}
                        <div className="absolute top-0 right-0 p-2 flex items-center gap-2 z-20">
                            <div className="cursor-move p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                                <GripVertical size={16} />
                            </div>
                            <button onClick={() => removeBlock(block.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Block {index + 1}: {block.type}</span>

                            {block.type === 'text' ? (
                                <RichTextEditor
                                    content={block.content}
                                    onChange={(html) => updateBlockContent(block.id, html)}
                                />
                            ) : (
                                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                                    {(block as any).mediaType === 'video' ? (
                                        (block as any).url.startsWith('blob:') ? (
                                            <video src={(block as any).url} controls className="w-full h-full object-cover" />
                                        ) : (
                                            <iframe
                                                src={(block as any).url}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        )
                                    ) : (
                                        <img src={(block as any).url} alt="Media" className="w-full h-full object-cover" />
                                    )}
                                </div>
                            )}
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {/* Add Block Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
                <button
                    onClick={addTextBlock}
                    className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-indigo-50 text-slate-500 hover:text-primary transition-all flex flex-col items-center gap-2"
                >
                    <FileText size={24} />
                    <span className="font-bold">Add Text Block</span>
                </button>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase text-center">Add Media Block</p>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setMediaInputType('url')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${mediaInputType === 'url' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>Link</button>
                        <button onClick={() => setMediaInputType('upload')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${mediaInputType === 'upload' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>Upload</button>
                    </div>

                    {mediaInputType === 'url' ? (
                        <div className="flex gap-2">
                            <input
                                key="media-url-input"
                                type="text"
                                value={tempMediaUrl}
                                onChange={(e) => setTempMediaUrl(e.target.value)}
                                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                placeholder="Paste YouTube link..."
                            />
                            <button onClick={() => addMediaBlock(tempMediaUrl, 'video')} className="bg-slate-900 text-white px-3 rounded-lg text-xs font-bold">Add</button>
                        </div>
                    ) : (
                        <div className="relative p-2 border-2 border-dashed border-slate-300 rounded-lg text-center hover:bg-slate-50">
                            <input key="media-file-input" type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="video/*,image/*" />
                            <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1"><Upload size={12} /> Select File</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Game Integration</h2>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Wordwall/Game Embed URL</label>
                <div className="relative">
                    <Gamepad2 className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={formData.gameUrl}
                        onChange={(e) => {
                            let val = e.target.value;
                            // Extract src if iframe code is pasted
                            if (val.includes("<iframe")) {
                                const match = val.match(/src="([^"]+)"/);
                                if (match && match[1]) {
                                    val = match[1];
                                }
                            }
                            updateField("gameUrl", val);
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        placeholder="Paste Wordwall Embed Code or URL..."
                    />
                </div>
                <p className="text-xs text-slate-500">Paste the embed link or public URL of the game.</p>
            </div>
            {formData.gameUrl && (
                <div className="mt-4 aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <iframe src={formData.gameUrl} className="w-full h-full" />
                </div>
            )}
        </div>
    );

    const renderStep6 = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Create Quiz</h2>
                <button onClick={addQuiz} className="text-primary text-sm font-bold hover:underline flex items-center gap-1"><Plus size={16} /> Add</button>
            </div>
            {formData.quizzes.map((quiz, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                    <button onClick={() => removeQuiz(i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash size={18} /></button>
                    <div className="mb-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Question {i + 1}</label>
                        <input
                            value={quiz.question}
                            onChange={(e) => handleAuditQuiz(i, "question", e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                            placeholder="Question..."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quiz.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                                <div onClick={() => handleAuditQuiz(i, "correctOption", optIdx)} className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${quiz.correctOption === optIdx ? "border-green-500 bg-green-50 text-green-600" : "border-slate-300"}`}>
                                    {quiz.correctOption === optIdx && <Check size={14} />}
                                </div>
                                <input
                                    value={opt}
                                    onChange={(e) => handleAuditQuiz(i, `option-${optIdx}`, e.target.value)}
                                    className={`flex-1 p-2 bg-white border border-slate-200 rounded-lg ${quiz.correctOption === optIdx ? "border-green-500 bg-green-50" : ""}`}
                                    placeholder={`Option ${optIdx + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderStep7 = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Flashcards</h2>
                <button onClick={addFlashcard} className="text-primary text-sm font-bold hover:underline flex items-center gap-1"><Plus size={16} /> Add</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formData.flashcards.map((card, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
                        <button onClick={() => removeFlashcard(i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash size={18} /></button>
                        <div className="space-y-4 mb-4">
                            <input value={card.front} onChange={(e) => handleFlashcardChange(i, "front", e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg" placeholder="Front" />
                            <textarea value={card.back} onChange={(e) => handleFlashcardChange(i, "back", e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg h-20 resize-none" placeholder="Back" />
                        </div>
                        <div className="flex gap-2">
                            {["bg-white", "bg-blue-100", "bg-green-100", "bg-orange-100"].map(c => (
                                <div key={c} onClick={() => handleFlashcardChange(i, "color", c)} className={`w-6 h-6 rounded-full cursor-pointer border ${c === card.color ? "ring-2 ring-primary" : ""} ${c}`} />
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Image</label>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                id={`file-upload-${i}`}
                                className="hidden"
                                onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const formData = new FormData();
                                        formData.append("file", file);

                                        // Set a temp loading state or just optimistic UI if needed, 
                                        // but here we wait for upload
                                        try {
                                            const res = await fetch("/api/upload", {
                                                method: "POST",
                                                body: formData,
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                                handleFlashcardChange(i, "image", data.url);
                                            } else {
                                                alert("Upload failed");
                                            }
                                        } catch (err) {
                                            console.error("Upload error", err);
                                            alert("Upload failed");
                                        }
                                    }
                                }}
                            />

                            <div className="flex gap-2">
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={card.image || ""}
                                        onChange={(e) => handleFlashcardChange(i, "image", e.target.value)}
                                        placeholder="Image URL or upload..."
                                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                    />
                                    <label
                                        htmlFor={`file-upload-${i}`}
                                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                                        title="Upload Image"
                                    >
                                        <ImagePlus size={18} className="text-slate-600" />
                                    </label>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400">Upload an image or paste a URL.</p>
                        </div>

                        {/* Preview */}
                        <div className="mt-6">
                            <p className="text-xs font-bold text-slate-400 text-center mb-2">PREVIEW (HOVER/TAP TO FLIP)</p>
                            <div className="perspective-1000 w-full h-40 cursor-pointer group/card">
                                <div className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover/card:rotate-y-180">
                                    {/* Front */}
                                    <div className={`absolute w-full h-full backface-hidden ${card.color} rounded-xl border-2 border-slate-900 border-b-4 flex flex-col items-center justify-center p-4 text-center shadow-sm`}>
                                        {card.image && <img src={card.image} alt="Flashcard" className="w-24 h-24 object-contain mb-2 rounded-md bg-white/50" />}
                                        <span className="font-bold text-slate-800 text-lg">{card.front || "Front Side"}</span>
                                    </div>
                                    {/* Back */}
                                    <div className={`absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl border-2 border-primary border-b-4 flex items-center justify-center p-4 text-center shadow-sm`}>
                                        <span className="font-medium text-slate-600">{card.back || "Back Side"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );






    const renderStep8 = () => (
        <div className="space-y-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Review & Update</h2>
                <p className="text-slate-500 mt-2">Preview how your lesson allows students to learn effectively.</p>
            </div>

            {/* Teacher Section: Lesson Plan */}
            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <AlignLeft className="text-indigo-200" size={100} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><AlignLeft size={20} /></span>
                        Teacher's Lesson Plan
                    </h3>
                    <p className="text-indigo-600/80 text-sm mb-6">Internal guide for lesson delivery. Not visible to students.</p>
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 shadow-sm whitespace-pre-wrap font-serif text-sm text-slate-700">
                        {formData.lessonPlan ? (
                            <div className="prose prose-sm prose-indigo max-w-none" dangerouslySetInnerHTML={{ __html: formData.lessonPlan }} />
                        ) : "No lesson plan added."}
                    </div>
                </div>
                <button onClick={() => setStep(2)} className="absolute top-6 right-6 text-indigo-400 hover:text-indigo-600 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit Plan <ArrowRight size={14} />
                </button>
            </div>

            {/* Student Section: Live Preview */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="bg-slate-100 p-2 rounded-lg text-slate-600"><Video size={20} /></span>
                            Student Dashboard Preview
                        </h3>
                        <p className="text-slate-500 text-sm">This is exactly what students will see.</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
                    {/* Fake Browser Header */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                        </div>
                        <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-1.5 text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            teachhub.com/courses/{params.courseId}/lesson
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="p-8 md:p-12 space-y-16">
                        {/* Header */}
                        <div>
                            <div className="inline-flex items-center gap-2 text-slate-400 mb-4 text-sm font-medium">
                                <ArrowLeft size={16} /> Back to Course
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{formData.title || "Untitled Lesson"}</h1>
                        </div>

                        {/* Game Embed */}
                        {formData.gameUrl && (
                            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-900/5 relative group">
                                <button onClick={() => setStep(5)} className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">Edit Game</button>
                                <iframe src={formData.gameUrl} className="w-full h-full" />
                            </div>
                        )}

                        {/* Block Content (Article + Media) */}
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    <Layers className="text-slate-400" />
                                    Lesson Content
                                </h2>
                                <button onClick={() => setStep(3)} className="text-primary text-sm font-bold hover:underline">Edit Content</button>
                            </div>

                            <BlockRenderer content={JSON.stringify(formData.contentBlocks)} />
                        </div>

                        {/* Quizzes */}
                        {formData.quizzes.length > 0 && (
                            <div className="pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2"><HelpCircle size={20} className="text-primary" /> Knowledge Check</h4>
                                    <button onClick={() => setStep(6)} className="text-primary text-xs font-bold hover:underline">Edit Quiz</button>
                                </div>
                                <QuizPlayer quizzes={formData.quizzes} />
                            </div>
                        )}

                        {/* Flashcards */}
                        {formData.flashcards.length > 0 && (
                            <div className="pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2"><Layers size={20} className="text-primary" /> Flashcards</h4>
                                    <button onClick={() => setStep(7)} className="text-primary text-xs font-bold hover:underline">Edit Flashcards</button>
                                </div>
                                <FlashcardDeck cards={formData.flashcards} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 pb-20">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"><ArrowLeft size={20} /></button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Lesson</h1>
                    <p className="text-slate-500">Step {step} of {steps.length}: {steps[step - 1].title}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${(step / steps.length) * 100}%` }}
                        className="h-full bg-primary absolute left-0 top-0"
                    />
                </div>
                <div className="flex justify-between mt-2 px-1">
                    {steps.map(s => (
                        <div key={s.id} className={`flex flex-col items-center ${step >= s.id ? 'text-primary' : 'text-slate-300'}`}>
                            <s.icon size={16} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[500px]"
            >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep5()}
                {step === 5 && renderStep6()}
                {step === 6 && renderStep7()}
                {step === 7 && renderStep8()}
            </motion.div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                    >
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => step < steps.length ? setStep(s => s + 1) : handleSubmit()}
                            disabled={loading}
                            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {step === steps.length ? (loading ? "Updating..." : "Update Lesson") : "Next Step"}
                            {!loading && step < steps.length && <ArrowRight size={20} />}
                            {!loading && step === steps.length && <Save size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
