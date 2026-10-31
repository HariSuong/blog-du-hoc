/** Tạo tên file PDF an toàn từ tiêu đề ebook. */
export function ebookFilename(title: string): string {
  const base =
    title
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "guide";

  return base.endsWith(".pdf") ? base : `${base}.pdf`;
}

/**
 * Thêm ?download=filename vào URL Supabase Storage
 * để trình duyệt tải file thay vì mở xem PDF.
 */
export function withDownloadParam(fileUrl: string, filename: string): string {
  try {
    const url = new URL(fileUrl);
    url.searchParams.set("download", filename);
    return url.toString();
  } catch {
    const joiner = fileUrl.includes("?") ? "&" : "?";
    return `${fileUrl}${joiner}download=${encodeURIComponent(filename)}`;
  }
}
