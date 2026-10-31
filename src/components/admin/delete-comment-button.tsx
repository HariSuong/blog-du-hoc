"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteComment } from "@/app/admin/comments/actions";

type DeleteCommentButtonProps = {
  commentId: string;
  authorName: string;
};

export function DeleteCommentButton({
  commentId,
  authorName,
}: DeleteCommentButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteComment(commentId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-red-600"
      >
        <Trash2 className="size-3.5" aria-hidden />
        Xóa
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-comment-title"
        >
          <div className="w-full max-w-sm rounded-lg border border-border bg-white p-6 shadow-lg">
            <h2
              id="delete-comment-title"
              className="font-serif text-lg font-bold tracking-normal text-ink"
            >
              Xóa bình luận?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Xóa bình luận của{" "}
              <span className="font-medium text-ink">{authorName}</span>. Các
              câu trả lời con cũng sẽ bị xóa theo.
            </p>

            {error ? (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:text-ink disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                Xóa
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
