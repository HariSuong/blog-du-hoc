import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { PostListSkeleton } from "@/components/post-list-skeleton";
import { SiteHeader } from "@/components/site-header";
import { createPublicClient } from "@/lib/supabase/public";
import type { PostListItem } from "@/types/post";

async function getPosts(): Promise<PostListItem[]> {
  "use cache";
  cacheTag("posts");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Không thể tải danh sách bài viết:", error.message);
    return [];
  }

  return data ?? [];
}

async function PostList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <section aria-label="Danh sách bài viết">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6 sm:py-16">
        <SiteHeader />

        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </main>

      <footer className="mx-auto w-full max-w-2xl px-5 pb-10 pt-4 sm:px-6">
        <p className="text-center text-xs text-muted/70">
          Little Journal — viết chậm, giữ lại những điều nhỏ.
        </p>
      </footer>
    </div>
  );
}
