"use client";

import { useMemo, useState } from "react";
import { buildCommentTree } from "@/lib/comments";
import type { Comment } from "@/types/comment";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

type CommentsSectionProps = {
  postId: string;
  postSlug: string;
  initialComments: Comment[];
};

export function CommentsSection({
  postId,
  postSlug,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const tree = useMemo(() => buildCommentTree(comments), [comments]);

  function handleAdded(comment: Comment) {
    setComments((prev) =>
      prev.some((c) => c.id === comment.id) ? prev : [...prev, comment],
    );
  }

  return (
    <section className="mt-12 border-t border-border pt-10" aria-label="Bình luận">
      <h2 className="font-serif text-2xl text-ink">
        Bình luận{" "}
        <span className="text-lg font-sans font-normal text-muted">
          ({comments.length})
        </span>
      </h2>

      <div className="mt-6 rounded-lg border border-border bg-white px-4 py-5 sm:px-5">
        <h3 className="mb-4 text-sm font-medium text-ink">Để lại lời nhắn</h3>
        <CommentForm
          postId={postId}
          postSlug={postSlug}
          onSuccess={handleAdded}
        />
      </div>

      {tree.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {tree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              postSlug={postSlug}
              replyToId={replyToId}
              onReply={setReplyToId}
              onCommentAdded={handleAdded}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
