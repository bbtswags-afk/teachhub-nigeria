"use client";

import { useState, useTransition } from "react";
import { Globe, Lock } from "lucide-react";
import { toggleCourseVisibility } from "@/app/actions/course";
import clsx from "clsx";

type VisibilityToggleProps = {
    courseId: string;
    initialIsPublic: boolean;
};

export default function VisibilityToggle({ courseId, initialIsPublic }: VisibilityToggleProps) {
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const newState = !isPublic;
        setIsPublic(newState); // Optimistic update

        startTransition(async () => {
            const result = await toggleCourseVisibility(courseId, newState);
            if (!result.success) {
                setIsPublic(!newState); // Revert on failure
                alert("Failed to update visibility");
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border",
                isPublic
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            )}
            title={isPublic ? "Public: Visible to everyone" : "Private: Visible only to you"}
        >
            {isPublic ? <Globe size={16} /> : <Lock size={16} />}
            {isPublic ? "Global (Public)" : "Private"}
        </button>
    );
}
