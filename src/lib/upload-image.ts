import type { SupabaseClient } from "@supabase/supabase-js";

export const BLOG_IMAGES_BUCKET = "blog-images";

export async function uploadBlogImage(
  supabase: SupabaseClient,
  file: File,
  folder = "uploads",
): Promise<{ url: string } | { error: string }> {
  if (!file || file.size === 0) {
    return { error: "Không có file ảnh để tải lên." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WebP…)." };
  }

  // Giới hạn ~5MB
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload blog image failed:", error.message);
    return {
      error: `Không thể tải ảnh lên Storage: ${error.message}`,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}
