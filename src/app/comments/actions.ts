"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Comment } from "@/types/comment";

export type CommentActionResult =
  | { error: string }
  | { comment: Comment };

export async function createComment(formData: FormData): Promise<CommentActionResult> {
  const postId = String(formData.get("post_id") ?? "").trim();
  const postSlug = String(formData.get("post_slug") ?? "").trim();
  const parentIdRaw = String(formData.get("parent_id") ?? "").trim();
  const authorName = String(formData.get("author_name") ?? "").trim();
  const authorEmail = String(formData.get("author_email") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!postId) {
    return { error: "Thiếu thông tin bài viết." };
  }

  if (!authorName) {
    return { error: "Vui lòng nhập tên của bạn." };
  }

  if (authorName.length > 80) {
    return { error: "Tên quá dài (tối đa 80 ký tự)." };
  }

  if (!content) {
    return { error: "Vui lòng nhập nội dung bình luận." };
  }

  if (content.length > 2000) {
    return { error: "Bình luận quá dài (tối đa 2000 ký tự)." };
  }

  if (authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
    return { error: "Email không hợp lệ." };
  }

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      parent_id: parentIdRaw || null,
      author_name: authorName,
      author_email: authorEmail || null,
      content,
    })
    .select(
      "id, post_id, parent_id, author_name, author_email, content, created_at",
    )
    .single();

  if (error) {
    console.error("Create comment failed:", error.message);
    return { error: `Không thể gửi bình luận: ${error.message}` };
  }

  revalidateTag("posts", "max");
  if (postSlug) {
    revalidateTag(`post-${postSlug}`, "max");
    revalidateTag(`comments-${postId}`, "max");
    revalidatePath(`/posts/${postSlug}`);
  }

  return { comment: data };
}
