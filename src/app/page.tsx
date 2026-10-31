import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { EmptyState } from "@/components/empty-state";
import { HeroSection } from "@/components/hero-section";
import { PostCard } from "@/components/post-card";
import { PostListSkeleton } from "@/components/post-list-skeleton";
import { SiteShell } from "@/components/site-shell";
import { createPublicClient } from "@/lib/supabase/public";
import type { PostListItem } from "@/types/post";

async function getLatestPosts(): Promise<PostListItem[]> {
  "use cache";
  cacheTag("posts");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, created_at, content")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Không thể tải bài viết mới nhất:", error.message);
    return [];
  }

  return data ?? [];
}

async function LatestEntries() {
  const posts = await getLatestPosts();

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Chưa có journal entry nào"
        description="Những trang đầu tiên của hành trình sẽ sớm xuất hiện tại đây."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="text-center font-serif text-3xl font-bold tracking-normal text-ink sm:text-4xl lg:text-5xl">
          Latest Journal Entries
        </h2>
        <div className="mt-10">
          <Suspense fallback={<PostListSkeleton />}>
            <LatestEntries />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}
