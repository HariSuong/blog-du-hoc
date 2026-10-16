"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Strikethrough,
} from "lucide-react";
import { useRef, useState } from "react";
import { LinkPopover } from "@/components/admin/link-popover";

type EditorToolbarProps = {
  editor: Editor | null;
  disabled?: boolean;
  uploading?: boolean;
  onInsertImage: (file: File) => void;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors disabled:opacity-40 ${
        active
          ? "bg-sage/15 text-ink"
          : "text-muted hover:bg-stone-100 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-border" aria-hidden />;
}

export function EditorToolbar({
  editor,
  disabled,
  uploading,
  onInsertImage,
}: EditorToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);

  if (!editor) return null;

  const currentHref = editor.getAttributes("link").href as string | undefined;

  return (
    <div className="relative flex flex-wrap items-center gap-0.5 border-b border-border bg-stone-50/80 px-2 py-1.5">
      <ToolbarButton
        label="In đậm"
        disabled={disabled}
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="In nghiêng"
        disabled={disabled}
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Gạch ngang"
        disabled={disabled}
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Tiêu đề H2"
        disabled={disabled}
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Tiêu đề H3"
        disabled={disabled}
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Danh sách dấu chấm"
        disabled={disabled}
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Danh sách đánh số"
        disabled={disabled}
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Trích dẫn"
        disabled={disabled}
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Đường kẻ ngang"
        disabled={disabled}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Căn trái"
        disabled={disabled}
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Căn giữa"
        disabled={disabled}
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Chèn liên kết"
        disabled={disabled}
        active={editor.isActive("link") || linkOpen}
        onClick={() => setLinkOpen((v) => !v)}
      >
        <Link2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Chèn ảnh"
        disabled={disabled || uploading}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImagePlus className="size-4" />
        )}
      </ToolbarButton>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onInsertImage(file);
          e.target.value = "";
        }}
      />

      <LinkPopover
        open={linkOpen}
        initialUrl={currentHref ?? ""}
        onClose={() => setLinkOpen(false)}
        onSubmit={(url) => {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url, target: "_blank" })
            .run();
          setLinkOpen(false);
        }}
        onRemove={() => {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          setLinkOpen(false);
        }}
      />
    </div>
  );
}
