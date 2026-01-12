"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-primary' : 'text-slate-600'}`}
                type="button"
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-primary' : 'text-slate-600'}`}
                type="button"
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('underline') ? 'bg-slate-200 text-primary' : 'text-slate-600'}`}
                type="button"
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-primary' : 'text-slate-600'}`}
                type="button"
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-primary' : 'text-slate-600'}`}
                type="button"
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-primary' : 'text-slate-600'}`}
                type="button"
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 text-primary' : 'text-slate-600'}`}
                type="button"
                title="Numbered List"
            >
                <ListOrdered size={18} />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
    });

    return (
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
