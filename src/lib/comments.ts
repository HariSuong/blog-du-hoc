import type { Comment, CommentNode } from "@/types/comment";

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>();

  for (const comment of comments) {
    nodes.set(comment.id, { ...comment, replies: [] });
  }

  const roots: CommentNode[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id)!;
    if (comment.parent_id && nodes.has(comment.parent_id)) {
      nodes.get(comment.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
