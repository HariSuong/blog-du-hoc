"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adminReplyComment } from "@/app/admin/comments/actions";

type AdminReplyFormProps = {
  postId: string;
  postSlug: string;
  parentId: string;
  onCancel: () => void;
};

export function AdminReplyForm({
  postId,
  postSlug,
  parentId,
  onCancel,
}: AdminReplyFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await adminReplyComment(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onCancel();
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-2 rounded-md border border-border bg-background/80 p-3"
    >
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="post_slug" value={postSlug} />
      <input type="hidden" name="parent_id" value={parentId} />

      <label className="block text-xs font-medium text-ink" htmlFor={`reply-${parentId}`}>
        Trả lời với tư cách Tác giả
      </label>
      <textarea
        id={`reply-${parentId}`}
        name="content"
        required
        rows={3}
        disabled={pending}
        placeholder="Viết phản hồi của bạn…"
        className="w-full resize-y rounded-md border border-border bg-white px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-sage focus:ring-2 focus:ring-sage/25 disabled:opacity-60"
      />

      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-md bg-cta px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : null}
          Gửi trả lời
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={onCancel}
          className="text-xs text-muted transition-colors hover:text-ink disabled:opacity-60"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
