import { cacheTag } from "next/cache";
import type { Metadata } from "next";
import { Suspense } from "react";
import { EbookCard } from "@/components/ebook-card";
import { EmptyState } from "@/components/empty-state";
import { SiteShell } from "@/components/site-shell";
import { createPublicClient } from "@/lib/supabase/public";
import type { Ebook } from "@/types/ebook";

export const metadata: Metadata = {
  title: "Ebooks & Guides",
  description: "Tài liệu và ebook miễn phí từ Little Journal.",
};

async function getEbooks(): Promise<Ebook[]> {
  "use cache";
  cacheTag("ebooks");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("ebooks")
    .select("id, title, category, cover_image_url, file_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Không thể tải ebooks:", error.message);
    return [];
  }

  return data ?? [];
}

async function EbookGrid() {
  const ebooks = await getEbooks();

  if (ebooks.length === 0) {
    return (
      <EmptyState
        title="Chưa có ebook nào"
        description="Các guide và tài liệu sẽ sớm được đăng tại đây để bạn tải về miễn phí."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {ebooks.map((ebook) => (
        <EbookCard key={ebook.id} ebook={ebook} />
      ))}
    </div>
  );
}

function EbookSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-sage px-6 py-10 ring-1 ring-ink/8">
          <div className="mx-auto h-3 w-20 rounded bg-ink/10" />
          <div className="mx-auto mt-4 h-7 w-2/3 rounded bg-ink/15" />
          <div className="mx-auto mt-8 aspect-[3/4] w-full max-w-[220px] max-h-[360px] rounded-md bg-white/40 shadow-xl" />
          <div className="mx-auto mt-10 h-10 w-44 rounded-md bg-ink/20" />
        </div>
      ))}
    </div>
  );
}

export default function EbooksPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <header className="mb-12 text-center sm:mb-14">
          <h1 className="font-serif text-4xl font-bold tracking-normal text-ink sm:text-5xl lg:text-6xl">
            Ebooks & Guides
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-sans text-[15px] font-light leading-relaxed text-muted">
            Tài liệu miễn phí — tải thẳng về, không cần đăng nhập.
          </p>
        </header>

        <Suspense fallback={<EbookSkeleton />}>
          <EbookGrid />
        </Suspense>
      </div>
    </SiteShell>
  );
}
