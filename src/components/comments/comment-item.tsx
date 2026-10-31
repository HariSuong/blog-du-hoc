"use client";

import { isAuthorComment } from "@/lib/author";
import { formatPostDate } from "@/lib/format-date";
import type { Comment, CommentNode } from "@/types/comment";
import { AuthorBadge } from "./author-badge";
import { CommentForm } from "./comment-form";

type CommentItemProps = {
  comment: CommentNode;
  postId: string;
  postSlug: string;
  depth?: number;
  replyToId: string | null;
  onReply: (id: string | null) => void;
  onCommentAdded: (comment: Comment) => void;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function CommentItem({
  comment,
  postId,
  postSlug,
  depth = 0,
  replyToId,
  onReply,
  onCommentAdded,
}: CommentItemProps) {
  const isReplying = replyToId === comment.id;
  const maxDepth = 4;
  const fromAuthor = isAuthorComment(comment);

  return (
    <li className={depth > 0 ? "mt-4 border-l border-border pl-4 sm:pl-5" : ""}>
      <article className="flex gap-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
            fromAuthor
              ? "bg-ink text-white"
              : "bg-sage text-ink/70"
          }`}
        >
          {initials(comment.author_name) || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <h3 className="font-sans text-sm font-medium text-ink">
              {comment.author_name}
            </h3>
            {fromAuthor ? <AuthorBadge /> : null}
            <time
              dateTime={comment.created_at}
              className="font-sans text-xs font-light text-muted"
            >
              {formatPostDate(comment.created_at)}
            </time>
          </div>
          <p className="mt-1.5 whitespace-pre-line font-sans text-[15px] font-light leading-relaxed text-ink">
            {comment.content}
          </p>
          {depth < maxDepth ? (
            <button
              type="button"
              onClick={() => onReply(isReplying ? null : comment.id)}
              className="mt-2 font-sans text-xs font-medium text-muted transition-colors hover:text-sage-deep"
            >
              {isReplying ? "Đóng" : "Trả lời"}
            </button>
          ) : null}

          {isReplying ? (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                postSlug={postSlug}
                parentId={comment.id}
                replyToName={comment.author_name}
                compact
                onCancelReply={() => onReply(null)}
                onSuccess={(c) => {
                  onCommentAdded(c);
                  onReply(null);
                }}
              />
            </div>
          ) : null}
        </div>
      </article>

      {comment.replies.length > 0 ? (
        <ul className="mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postSlug={postSlug}
              depth={depth + 1}
              replyToId={replyToId}
              onReply={onReply}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
