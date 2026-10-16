import { stripHtml } from "@/lib/html";

/** Tạo đoạn trích ngắn từ nội dung HTML/plain text (khoảng 120–150 ký tự). */
export function createExcerpt(content: string, maxLength = 140): string {
  const cleaned = stripHtml(content).replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  if (cleaned.length <= maxLength) return cleaned;

  const sliced = cleaned.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trim()}…`;
}
