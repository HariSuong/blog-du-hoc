"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/ebooks", label: "Ebooks" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-normal text-ink transition-opacity hover:opacity-70 sm:text-2xl"
        >
          Little Journal
        </Link>

        <nav
          aria-label="Menu chính"
          className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 font-sans text-sm font-light leading-relaxed sm:gap-x-6 sm:text-[15px]"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "font-medium text-neutral-800"
                    : "text-muted transition-colors hover:text-neutral-800"
                }
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            className="ml-1 text-xs text-stone-300 transition-colors hover:text-muted"
            aria-label="Khu vực quản trị"
          >
            ·
          </Link>
        </nav>
      </div>
    </header>
  );
}
