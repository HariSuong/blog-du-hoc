"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createExcerpt } from "@/lib/excerpt";
import { isEmptyHtml } from "@/lib/html";
import { createSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { uploadBlogImage } from "@/lib/upload-image";

function revalidatePosts(slug?: string) {
  revalidateTag("posts", "max");
  revalidatePath("/");
  revalidatePath("/admin");
  if (slug) {
    revalidateTag(`post-${slug}`, "max");
    revalidatePath(`/posts/${slug}`);
  }
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("invalid login") ||
    lower.includes("invalid credentials") ||
    lower.includes("email not confirmed")
  ) {
    return "Email hoặc mật khẩu không đúng.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Bạn thử quá nhiều lần. Hãy đợi một chút rồi thử lại.";
  }
  return `Không thể đăng nhập: ${message}`;
}

function formatDbError(context: string, message: string): string {
  return `${context}: ${message}`;
}

export type AuthResult = { error: string } | undefined;

export async function login(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type PostActionResult = { error: string } | undefined;

export async function createPost(formData: FormData): Promise<PostActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const titleRaw = String(formData.get("title") ?? "").trim();
  const title = titleRaw || "Không tiêu đề";
  const content = String(formData.get("content") ?? "").trim();
  const coverFile = formData.get("cover_image");

  if (isEmptyHtml(content)) {
    return { error: "Nội dung bài viết không được để trống." };
  }

  let coverImageUrl: string | null = null;
  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await uploadBlogImage(supabase, coverFile, "covers");
    if ("error" in uploaded) return { error: uploaded.error };
    coverImageUrl = uploaded.url;
  }

  const slug = createSlug(title);
  const excerpt = createExcerpt(content);

  // Khớp đúng schema Supabase: cover_image_url (không phải cover_image)
  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    content,
    excerpt,
    cover_image_url: coverImageUrl,
  });

  if (error) {
    console.error("Create post failed:", error.message, error.details, error.hint);
    return {
      error: formatDbError(
        "Không thể đăng bài",
        error.message + (error.hint ? ` (${error.hint})` : ""),
      ),
    };
  }

  revalidatePosts(slug);
  redirect("/admin");
}

export async function updatePost(
  id: string,
  formData: FormData,
): Promise<PostActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const titleRaw = String(formData.get("title") ?? "").trim();
  const title = titleRaw || "Không tiêu đề";
  const content = String(formData.get("content") ?? "").trim();
  const existingCover = String(formData.get("existing_cover") ?? "").trim();
  const removeCover = String(formData.get("remove_cover") ?? "") === "true";
  const coverFile = formData.get("cover_image");

  if (isEmptyHtml(content)) {
    return { error: "Nội dung bài viết không được để trống." };
  }

  let coverImageUrl: string | null = removeCover ? null : existingCover || null;

  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await uploadBlogImage(supabase, coverFile, "covers");
    if ("error" in uploaded) return { error: uploaded.error };
    coverImageUrl = uploaded.url;
  }

  const excerpt = createExcerpt(content);

  const { data: updated, error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      excerpt,
      cover_image_url: coverImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) {
    console.error("Update post failed:", error.message, error.details, error.hint);
    return {
      error: formatDbError(
        "Không thể cập nhật bài viết",
        error.message + (error.hint ? ` (${error.hint})` : ""),
      ),
    };
  }

  revalidatePosts(updated?.slug);
  redirect("/admin");
}

export async function deletePost(id: string): Promise<PostActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Delete post failed:", error.message);
    return {
      error: formatDbError("Không thể xóa bài viết", error.message),
    };
  }

  revalidatePosts();
  return undefined;
}
