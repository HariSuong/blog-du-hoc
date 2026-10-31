import { isEmptyHtml } from "@/lib/html";

type PostContentHtmlProps = {
  html: string;
};

const proseClasses = [
  "prose prose-stone prose-lg max-w-none",
  "prose-journal",
  "font-sans font-normal text-[17px] leading-relaxed text-neutral-800 sm:text-lg",
  // Đoạn văn
  "prose-p:my-6 prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-800",
  // Tiêu đề con
  "prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-normal prose-headings:text-neutral-900",
  "prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[1.55rem] prose-h2:leading-snug",
  "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-[1.25rem] prose-h3:leading-snug",
  // Ảnh
  "prose-img:mx-auto prose-img:my-8 prose-img:rounded-xl prose-img:shadow-sm",
  // Liên kết
  "prose-a:text-sage-deep prose-a:underline prose-a:underline-offset-[3px] prose-a:decoration-sage/40",
  // Trích dẫn
  "prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:pl-4",
  "prose-blockquote:font-light prose-blockquote:italic prose-blockquote:leading-relaxed prose-blockquote:text-neutral-600 prose-blockquote:my-6",
  // Danh sách & strong
  "prose-li:font-light prose-li:leading-relaxed prose-li:marker:text-neutral-400",
  "prose-strong:font-semibold prose-strong:text-neutral-900",
  "prose-hr:my-10 prose-hr:border-neutral-200",
].join(" ");

/**
 * Render HTML từ TipTap. Nội dung chỉ do admin soạn — không nhận HTML từ người đọc.
 */
export function PostContentHtml({ html }: PostContentHtmlProps) {
  if (isEmptyHtml(html)) {
    return null;
  }

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(html);

  if (!looksLikeHtml) {
    return (
      <div className={proseClasses}>
        <p className="whitespace-pre-line">{html}</p>
      </div>
    );
  }

  return (
    <div
      className={proseClasses}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
