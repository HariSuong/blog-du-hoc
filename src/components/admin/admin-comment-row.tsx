"use client";

import { MessageSquareReply } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminReplyForm } from "@/components/admin/admin-reply-form";
import { DeleteCommentButton } from "@/components/admin/delete-comment-button";
import { isAuthorComment } from "@/lib/author";
import { formatPostDate } from "@/lib/format-date";
import type { AdminCommentListItem } from "@/types/comment";

type AdminCommentRowProps = {
  comment: AdminCommentListItem;
};

export function AdminCommentRow({ comment }: AdminCommentRowProps) {
  const [replying, setReplying] = useState(false);
  const postTitle = comment.posts?.title || "Không tiêu đề";
  const postSlug = comment.posts?.slug ?? "";
  const fromAuthor = isAuthorComment(comment);

  return (
    <li className="border-b border-border px-4 py-5 last:border-b-0 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-ink">{comment.author_name}</span>
            {fromAuthor ? (
              <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-medium text-sage">
                Tác giả
              </span>
            ) : null}
            {comment.parent_id ? (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-muted">
                Trả lời
              </span>
            ) : null}
          </div>

          {comment.author_email ? (
            <p className="mt-0.5 text-xs text-muted">{comment.author_email}</p>
          ) : (
            <p className="mt-0.5 text-xs text-muted/70">Không có email</p>
          )}

          <p className="mt-1 text-xs text-muted">
            <time dateTime={comment.created_at}>
              {formatPostDate(comment.created_at)}
            </time>
            {" · "}
            {postSlug ? (
              <Link
                href={`/posts/${postSlug}`}
                className="text-sage transition-opacity hover:opacity-80"
                target="_blank"
              >
                {postTitle}
              </Link>
            ) : (
              postTitle
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setReplying((v) => !v)}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <MessageSquareReply className="size-3.5" aria-hidden />
            {replying ? "Đóng" : "Trả lời"}
          </button>
          <DeleteCommentButton
            commentId={comment.id}
            authorName={comment.author_name}
          />
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink">
        {comment.content}
      </p>

      {replying && postSlug ? (
        <AdminReplyForm
          postId={comment.post_id}
          postSlug={postSlug}
          parentId={comment.id}
          onCancel={() => setReplying(false)}
        />
      ) : null}
    </li>
  );
}
