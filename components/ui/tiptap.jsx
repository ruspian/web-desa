"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect } from "react";

const Toolbar = ({ editor }) => {
  if (!editor) return null;

  // Fungsi Helper untuk tombol aktif
  const isActive = (type, opts) =>
    editor.isActive(type, opts)
      ? "bg-slate-200 text-black"
      : "text-slate-500 hover:bg-slate-100";
  const baseBtn = "p-2 rounded transition-colors";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${baseBtn} ${isActive("bold")}`}
        type="button"
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${baseBtn} ${isActive("italic")}`}
        type="button"
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${baseBtn} ${isActive("underline")}`}
        type="button"
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

      {/* TOMBOL LIST */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${baseBtn} ${isActive("bulletList")}`}
        type="button"
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${baseBtn} ${isActive("orderedList")}`}
        type="button"
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${baseBtn} ${isActive("blockquote")}`}
        type="button"
        title="Quote"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={`${baseBtn} disabled:opacity-30`}
        type="button"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={`${baseBtn} disabled:opacity-30`}
        type="button"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Konfigurasi list agar behavior-nya standar
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        // Class 'prose' penting agar styling global list di globals.css bekerja
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 max-w-none text-gray-700",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sinkronisasi konten jika prop berubah (misal saat Edit data)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      // Cek sederhana biar gak infinite loop saat ngetik
      if (editor.getText() === "" && content !== "<p></p>") {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white w-full shadow-sm flex flex-col">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto max-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
