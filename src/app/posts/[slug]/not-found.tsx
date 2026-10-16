import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-serif text-2xl text-ink">Bài viết không còn ở đây</p>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
        Có lẽ trang này đã được chuyển đi, hoặc đường dẫn chưa đúng.
        Bạn có thể quay về trang chủ để xem những bài khác.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-sage px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
