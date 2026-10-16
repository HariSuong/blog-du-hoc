import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mb-12 sm:mb-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
            <Link href="/" className="transition-opacity hover:opacity-70">
              Little Journal
            </Link>
          </h1>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
            Góc nhỏ của riêng mình — vài dòng về ngày thường khi ở xa nhà.
          </p>
        </div>
        <Link
          href="/admin"
          className="shrink-0 pt-1 text-xs text-stone-300 transition-colors hover:text-muted"
          aria-label="Khu vực quản trị"
        >
          ·
        </Link>
      </div>
    </header>
  );
}
