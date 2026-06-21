"use client";
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import { Youtube } from "@tiptap/extension-youtube";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Unlink, Image as ImageIcon,
  Video as YoutubeIcon, Table as TableIcon, Minus, Undo, Redo,
} from "lucide-react";
import { readImageFile, uploadImageToCloud } from "../_lib/admin";

function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={!!active}
      className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${active ? "bg-amber-100 text-amber-700" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="w-px h-6 bg-gray-200 mx-1 self-center" aria-hidden="true" />;

export default function RichEditor({ defaultValue = "", onChange, onAuthExpire, variant = "full", ariaLabel = "Rich text editor" }) {
  const fileRef = useRef(null);
  const [, force] = useState(0);

  const editor = useEditor({
    immediatelyRender: false, // required for Next.js App Router (avoids SSR hydration mismatch)
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
        },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ controls: true, nocookie: true, width: 640, height: 360 }),
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose max-w-none focus:outline-none px-4 py-3 min-h-[14rem]",
        "aria-label": ariaLabel,
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  // Re-render the toolbar on every transaction so active states stay in sync.
  useEffect(() => {
    if (!editor) return;
    const update = () => force((n) => n + 1);
    editor.on("transaction", update);
    return () => editor.off("transaction", update);
  }, [editor]);

  if (!editor) {
    return <div className="border border-gray-200 rounded-xl min-h-[18rem] bg-gray-50 animate-pulse" aria-hidden="true" />;
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL (leave blank to remove)", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube video URL");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };

  const addTable = () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

  const onImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      const { url } = await uploadImageToCloud(dataUrl, onAuthExpire);
      if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      alert(err.message);
    } finally {
      e.target.value = "";
    }
  };

  const full = variant === "full";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={16} /></Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={16} /></Btn>
        <Divider />
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></Btn>
        <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></Btn>
        <Btn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></Btn>
        <Btn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></Btn>
        {full && (
          <>
            <Divider />
            <Btn title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={16} /></Btn>
            <Btn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Btn>
            <Btn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Btn>
          </>
        )}
        <Divider />
        <Btn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Btn>
        <Btn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
        <Btn title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></Btn>
        {full && <Btn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={16} /></Btn>}
        <Divider />
        <Btn title="Add link" active={editor.isActive("link")} onClick={setLink}><LinkIcon size={16} /></Btn>
        <Btn title="Remove link" disabled={!editor.isActive("link")} onClick={() => editor.chain().focus().unsetLink().run()}><Unlink size={16} /></Btn>
        {full && (
          <>
            <Divider />
            <Btn title="Insert image" onClick={() => fileRef.current?.click()}><ImageIcon size={16} /></Btn>
            <Btn title="Embed YouTube video" onClick={addYoutube}><YoutubeIcon size={16} /></Btn>
            <Btn title="Insert table" onClick={addTable}><TableIcon size={16} /></Btn>
            <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></Btn>
          </>
        )}
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onImageFile} className="hidden" />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
