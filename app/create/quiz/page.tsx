"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { Plus, GripVertical, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Question {
    id: string;
    text: string;
    type: "Multiple Choice" | "True/False";
}

export default function QuizCreatorPage() {
    const [questions, setQuestions] = useState<Question[]>([
        { id: "1", text: "What is the capital of Nigeria?", type: "Multiple Choice" },
        { id: "2", text: "Photosynthesis requires sunlight.", type: "True/False" },
    ]);

    const addQuestion = () => {
        const newId = (questions.length + 1).toString();
        setQuestions([...questions, { id: newId, text: "New Question...", type: "Multiple Choice" }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/create" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">New Quiz</h1>
                        <p className="text-slate-500 text-sm">Drag to reorder questions.</p>
                    </div>
                </div>
                <button className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                    <Save size={18} />
                    Save Quiz
                </button>
            </div>

            <div className="space-y-4">
                <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-4">
                    {questions.map((item) => (
                        <Reorder.Item key={item.id} value={item}>
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-move active:shadow-lg transition-shadow group">
                                <div className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                                    <GripVertical size={24} />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.type}</span>
                                        <button
                                            onClick={() => removeQuestion(item.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        defaultValue={item.text}
                                        className="w-full text-lg font-medium text-slate-900 bg-transparent border-none focus:ring-0 p-0 placeholder-slate-300"
                                    />
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                <button
                    onClick={addQuestion}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium hover:border-primary hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add Question
                </button>
            </div>
        </div>
    );
}
