import type { SupabaseClient } from "@supabase/supabase-js";

export const BLOG_FILES_BUCKET = "blog-files";

/** Upload PDF ebook lên bucket blog-files. */
export async function uploadBlogPdf(
  supabase: SupabaseClient,
  file: File,
  folder = "ebooks",
): Promise<{ url: string } | { error: string }> {
  if (!file || file.size === 0) {
    return { error: "Không có file PDF để tải lên." };
  }

  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return { error: "Vui lòng chọn file PDF hợp lệ." };
  }

  // Giới hạn ~20MB
  if (file.size > 20 * 1024 * 1024) {
    return { error: "File quá lớn. Vui lòng chọn PDF dưới 20MB." };
  }

  const path = `${folder}/${crypto.randomUUID()}.pdf`;

  const { error } = await supabase.storage.from(BLOG_FILES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: "application/pdf",
  });

  if (error) {
    console.error("Upload blog PDF failed:", error.message);
    return {
      error: `Không thể tải PDF lên Storage: ${error.message}`,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BLOG_FILES_BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}
