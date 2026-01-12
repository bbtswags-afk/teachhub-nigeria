"use client";

import React from "react";
import { Video } from "lucide-react";

export type ContentBlock =
    | { id: string; type: 'text'; content: string }
    | { id: string; type: 'media'; url: string; mediaType: 'video' | 'image' };

interface BlockRendererProps {
    content: string; // Can be JSON string of blocks or legacy HTML
}

export default function BlockRenderer({ content }: BlockRendererProps) {
    let blocks: ContentBlock[] = [];
    let isLegacy = false;

    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            blocks = parsed;
        } else {
            isLegacy = true;
        }
    } catch (e) {
        isLegacy = true;
    }

    if (isLegacy) {
        return (
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        );
    }

    return (
        <div className="space-y-8">
            {blocks.map((block) => {
                if (block.type === 'text') {
                    return (
                        <div key={block.id} className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: block.content }} />
                    );
                } else if (block.type === 'media') {
                    return (
                        <div key={block.id} className="w-full">
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative">
                                {block.mediaType === 'video' ? (
                                    block.url.startsWith('blob:') ? (
                                        <video src={block.url} controls className="w-full h-full object-cover" />
                                    ) : (
                                        <iframe
                                            src={block.url}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )
                                ) : (
                                    <img src={block.url} alt="Lesson Media" className="w-full h-full object-cover" />
                                )}
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
}
