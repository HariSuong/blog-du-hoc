"use client";

import type { Editor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorToolbar } from "@/components/admin/editor-toolbar";
import { createClient } from "@/lib/supabase/client";
import { uploadBlogImage } from "@/lib/upload-image";

type RichTextEditorProps = {
  name?: string;
  initialContent?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function RichTextEditor({
  name = "content",
  initialContent = "",
  disabled = false,
  placeholder = "Viết những gì bạn muốn giữ lại…",
}: RichTextEditorProps) {
  const [html, setHtml] = useState(initialContent);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const insertUploadedImage = useCallback(async (file: File, ed: Editor) => {
    setUploadError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const result = await uploadBlogImage(supabase, file, "content");
      if ("error" in result) {
        setUploadError(result.error);
        return;
      }
      ed.chain().focus().setImage({ src: result.url, alt: file.name }).run();
    } finally {
      setUploading(false);
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: false,
      }),
      Placeholder.configure({ placeholder }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-sage-deep underline underline-offset-2",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center"],
      }),
    ],
    content: initialContent || "",
    editable: !disabled,
    onCreate: ({ editor: ed }) => {
      editorRef.current = ed;
    },
    onDestroy: () => {
      editorRef.current = null;
    },
    onUpdate: ({ editor: current }) => {
      setHtml(current.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[22rem] px-3.5 py-3 text-[16px] leading-relaxed text-ink outline-none sm:min-h-[28rem] focus:outline-none",
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        const ed = editorRef.current;
        if (!items || !ed) return false;

        for (const item of items) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) void insertUploadedImage(file, ed);
            return true;
          }
        }
        return false;
      },
      handleDrop: (_view, event) => {
        const files = event.dataTransfer?.files;
        const ed = editorRef.current;
        if (!files?.length || !ed) return false;

        const image = Array.from(files).find((f) =>
          f.type.startsWith("image/"),
        );
        if (!image) return false;

        event.preventDefault();
        void insertUploadedImage(image, ed);
        return true;
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  return (
    <div className="space-y-2">
      <div
        className={`overflow-hidden rounded-md border border-border bg-white transition-shadow focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/25 ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <EditorToolbar
          editor={editor}
          disabled={disabled}
          uploading={uploading}
          onInsertImage={(file) => {
            if (editor) void insertUploadedImage(file, editor);
          }}
        />
        <EditorContent editor={editor} />
        <input type="hidden" name={name} value={html} readOnly />
      </div>
      {uploading ? (
        <p className="text-xs text-muted">Đang tải ảnh lên…</p>
      ) : null}
      {uploadError ? (
        <p role="alert" className="text-xs text-red-600">
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}
