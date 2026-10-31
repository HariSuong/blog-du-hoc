import { cacheTag } from "next/cache";
import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { PostListSkeleton } from "@/components/post-list-skeleton";
import { SiteShell } from "@/components/site-shell";
import { createPublicClient } from "@/lib/supabase/public";
import type { PostListItem } from "@/types/post";

export const metadata: Metadata = {
  title: "Blog",
  description: "Toàn bộ journal entries của Little Journal.",
};

async function getAllPosts(): Promise<PostListItem[]> {
  "use cache";
  cacheTag("posts");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, created_at, content")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Không thể tải danh sách blog:", error.message);
    return [];
  }

  return data ?? [];
}

async function BlogList() {
  const posts = await getAllPosts();

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Blog còn trống"
        description="Hãy quay lại khi có bài viết mới được đăng."
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

export default function BlogPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <header className="mb-12 text-center sm:mb-14">
          <h1 className="font-serif text-5xl font-bold tracking-normal text-ink sm:text-6xl lg:text-7xl">
            Blog
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-sans text-[15px] font-light leading-relaxed text-muted">
            Tất cả những trang nhật ký — đọc chậm, giữ lại điều nhỏ.
          </p>
        </header>

        <Suspense fallback={<PostListSkeleton count={6} />}>
          <BlogList />
        </Suspense>
      </div>
    </SiteShell>
  );
}
