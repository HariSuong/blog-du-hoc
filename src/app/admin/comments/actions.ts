"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_AUTHOR } from "@/lib/author";
import { createClient } from "@/lib/supabase/server";
import type { Comment } from "@/types/comment";

function revalidateCommentCaches(postId: string, postSlug?: string | null) {
  revalidateTag(`comments-${postId}`, "max");
  revalidateTag("posts", "max");
  revalidatePath("/admin");
  revalidatePath("/admin/comments");
  if (postSlug) {
    revalidateTag(`post-${postSlug}`, "max");
    revalidatePath(`/posts/${postSlug}`);
  }
}

export type AdminCommentResult =
  | { error: string }
  | { success: true; comment?: Comment };

/** Xóa bình luận và toàn bộ câu trả lời con (đệ quy). */
export async function deleteComment(
  commentId: string,
): Promise<AdminCommentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn." };
  }

  const { data: target, error: fetchError } = await supabase
    .from("comments")
    .select("id, post_id, posts(slug)")
    .eq("id", commentId)
    .maybeSingle();

  if (fetchError || !target) {
    return {
      error: fetchError
        ? `Không tìm thấy bình luận: ${fetchError.message}`
        : "Bình luận không tồn tại.",
    };
  }

  const postId = target.post_id as string;
  const relatedPost = target.posts as { slug: string } | { slug: string }[] | null;
  const postSlug = Array.isArray(relatedPost)
    ? relatedPost[0]?.slug ?? null
    : relatedPost?.slug ?? null;

  async function deleteTree(id: string) {
    const { data: children } = await supabase
      .from("comments")
      .select("id")
      .eq("parent_id", id);

    for (const child of children ?? []) {
      await deleteTree(child.id);
    }

    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
  }

  try {
    await deleteTree(commentId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định";
    return { error: `Không thể xóa bình luận: ${message}` };
  }

  revalidateCommentCaches(postId, postSlug);
  return { success: true };
}

/** Admin trả lời bình luận — gắn parent_id và danh tính tác giả. */
export async function adminReplyComment(
  formData: FormData,
): Promise<AdminCommentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn." };
  }

  const postId = String(formData.get("post_id") ?? "").trim();
  const postSlug = String(formData.get("post_slug") ?? "").trim();
  const parentId = String(formData.get("parent_id") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!postId || !parentId) {
    return { error: "Thiếu thông tin bình luận cần trả lời." };
  }

  if (!content) {
    return { error: "Vui lòng nhập nội dung trả lời." };
  }

  if (content.length > 2000) {
    return { error: "Nội dung quá dài (tối đa 2000 ký tự)." };
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      parent_id: parentId,
      author_name: SITE_AUTHOR.name,
      author_email: SITE_AUTHOR.email,
      content,
    })
    .select(
      "id, post_id, parent_id, author_name, author_email, content, created_at",
    )
    .single();

  if (error) {
    return { error: `Không thể gửi trả lời: ${error.message}` };
  }

  revalidateCommentCaches(postId, postSlug || null);
  return { success: true, comment: data };
}
