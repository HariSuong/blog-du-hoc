"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { createComment } from "@/app/comments/actions";
import type { Comment } from "@/types/comment";

type CommentFormProps = {
  postId: string;
  postSlug: string;
  parentId?: string | null;
  replyToName?: string | null;
  onCancelReply?: () => void;
  onSuccess: (comment: Comment) => void;
  compact?: boolean;
};

export function CommentForm({
  postId,
  postSlug,
  parentId = null,
  replyToName,
  onCancelReply,
  onSuccess,
  compact = false,
}: CommentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createComment(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      form.reset();
      onSuccess(result.comment);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 font-sans">
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="post_slug" value={postSlug} />
      <input type="hidden" name="parent_id" value={parentId ?? ""} />

      {replyToName ? (
        <p className="text-sm text-muted">
          Đang trả lời{" "}
          <span className="font-medium text-ink">{replyToName}</span>
          {onCancelReply ? (
            <>
              {" · "}
              <button
                type="button"
                onClick={onCancelReply}
                className="text-sage-deep hover:opacity-80"
              >
                Hủy
              </button>
            </>
          ) : null}
        </p>
      ) : null}

      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label
            htmlFor={`author_name_${parentId ?? "root"}`}
            className="mb-1 block text-sm font-medium text-ink"
          >
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            id={`author_name_${parentId ?? "root"}`}
            name="author_name"
            type="text"
            required
            disabled={pending}
            maxLength={80}
            placeholder="Tên của bạn"
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-sage focus:ring-2 focus:ring-sage/25 disabled:opacity-60"
          />
        </div>
        <div>
          <label
            htmlFor={`author_email_${parentId ?? "root"}`}
            className="mb-1 block text-sm font-medium text-ink"
          >
            Email <span className="font-normal text-muted">(tuỳ chọn)</span>
          </label>
          <input
            id={`author_email_${parentId ?? "root"}`}
            name="author_email"
            type="email"
            disabled={pending}
            placeholder="email@example.com"
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-sage focus:ring-2 focus:ring-sage/25 disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`content_${parentId ?? "root"}`}
          className="mb-1 block text-sm font-medium text-ink"
        >
          Bình luận <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`content_${parentId ?? "root"}`}
          name="content"
          required
          disabled={pending}
          rows={compact ? 3 : 4}
          maxLength={2000}
          placeholder="Viết vài dòng chia sẻ…"
          className="w-full resize-y rounded-md border border-border bg-white px-3 py-2 text-sm font-light leading-relaxed text-ink outline-none focus:border-sage focus:ring-2 focus:ring-sage/25 disabled:opacity-60"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-md bg-cta px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Đang gửi…
          </>
        ) : parentId ? (
          "Gửi trả lời"
        ) : (
          "Gửi bình luận"
        )}
      </button>
    </form>
  );
}
