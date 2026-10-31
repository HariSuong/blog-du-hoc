import { stripHtml } from "@/lib/html";

const WORDS_PER_MINUTE = 200;

/** Ước lượng thời gian đọc từ HTML/plain text (tối thiểu 1 phút). */
export function estimateReadingTime(content: string | null | undefined): number {
  const text = stripHtml(content ?? "");
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
