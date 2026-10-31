import { Suspense } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function HeaderFallback() {
  return (
    <header className="border-b border-border/70 bg-background/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <span className="font-serif text-xl font-bold tracking-normal text-ink sm:text-2xl">
          Little Journal
        </span>
        <div className="h-4 w-48 animate-pulse rounded bg-stone-200/60" aria-hidden />
      </div>
    </header>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
