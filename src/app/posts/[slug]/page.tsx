import { ArrowLeft } from "lucide-react";
import { cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuthorBox } from "@/components/author-box";
import { CommentsSection } from "@/components/comments/comments-section";
import { PostContentHtml } from "@/components/post-content";
import { RecentPosts } from "@/components/recent-posts";
import { SiteShell } from "@/components/site-shell";
import {
  estimateReadingTime,
  formatReadingTime,
} from "@/lib/reading-time";
import { formatPostDate } from "@/lib/format-date";
import { createPublicClient } from "@/lib/supabase/public";
import type { Comment } from "@/types/comment";
import type { Post, PostListItem } from "@/types/post";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag("posts");
  cacheTag(`post-${slug}`);

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image_url, created_at, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Không thể tải bài viết:", error.message);
    return null;
  }

  return data;
}

async function getComments(postId: string): Promise<Comment[]> {
  "use cache";
  cacheTag(`comments-${postId}`);

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, post_id, parent_id, author_name, author_email, content, created_at",
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Không thể tải bình luận:", error.message);
    return [];
  }

  return data ?? [];
}

async function getRecentPosts(
  excludeId: string,
): Promise<PostListItem[]> {
  "use cache";
  cacheTag("posts");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, created_at, content")
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Không thể tải recent posts:", error.message);
    return [];
  }

  return data ?? [];
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Không tìm thấy bài viết" };
  }

  return {
    title: post.title || "Không tiêu đề",
    description: post.excerpt ?? undefined,
  };
}

async function PostBody({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [comments, recentPosts] = await Promise.all([
    getComments(post.id),
    getRecentPosts(post.id),
  ]);

  const readingTime = formatReadingTime(estimateReadingTime(post.content));

  return (
    <>
      <article>
        <header className="mb-10 text-center sm:mb-12">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-sm font-light tracking-wide text-muted">
            <time dateTime={post.created_at}>
              {formatPostDate(post.created_at)}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime}</span>
          </div>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-[1.85rem] font-bold leading-snug tracking-normal text-ink sm:text-4xl sm:leading-[1.2] lg:text-5xl">
            {post.title || "Không tiêu đề"}
          </h1>
        </header>

        {post.cover_image_url ? (
          <figure className="mb-10 sm:mb-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-sage/40 sm:aspect-[16/10]">
              <Image
                src={post.cover_image_url}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </figure>
        ) : null}

        <PostContentHtml html={post.content} />
      </article>

      <AuthorBox publishedAt={post.created_at} />

      <CommentsSection
        postId={post.id}
        postSlug={post.slug}
        initialComments={comments}
      />

      <RecentPosts posts={recentPosts} />

      <footer className="mt-14 border-t border-border pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Về Blog
        </Link>
      </footer>
    </>
  );
}

function PostSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="mx-auto mb-3 h-3 w-40 rounded bg-stone-200/60" />
      <div className="mx-auto h-12 w-4/5 rounded bg-stone-200/70" />
      <div className="mt-8 aspect-[16/10] rounded-lg bg-stone-200/60" />
      <div className="mt-10 space-y-4">
        <div className="h-4 w-full rounded bg-stone-200/50" />
        <div className="h-4 w-full rounded bg-stone-200/50" />
        <div className="h-4 w-5/6 rounded bg-stone-200/50" />
        <div className="h-4 w-full rounded bg-stone-200/50" />
        <div className="h-4 w-3/4 rounded bg-stone-200/50" />
      </div>
    </div>
  );
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Quay lại Blog
        </Link>

        <Suspense fallback={<PostSkeleton />}>
          <PostBody params={params} />
        </Suspense>
      </div>
    </SiteShell>
  );
}
