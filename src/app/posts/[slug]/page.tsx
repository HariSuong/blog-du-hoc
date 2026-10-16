import { ArrowLeft } from "lucide-react";
import { cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuthorBox } from "@/components/author-box";
import { CommentsSection } from "@/components/comments/comments-section";
import { PostContentHtml } from "@/components/post-content";
import { formatPostDate } from "@/lib/format-date";
import { createPublicClient } from "@/lib/supabase/public";
import type { Comment } from "@/types/comment";
import type { Post } from "@/types/post";

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

  const comments = await getComments(post.id);

  return (
    <>
      <article>
        <header className="mb-10 text-center sm:mb-12 sm:text-left">
          <time
            dateTime={post.created_at}
            className="text-sm tracking-wide text-stone-500"
          >
            {formatPostDate(post.created_at)}
          </time>
          <h1 className="mt-3 font-serif text-[1.85rem] leading-snug tracking-tight text-stone-900 sm:text-4xl sm:leading-[1.2]">
            {post.title || "Không tiêu đề"}
          </h1>
        </header>

        {post.cover_image_url ? (
          <figure className="mb-10 sm:mb-12">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white shadow-sm">
              <Image
                src={post.cover_image_url}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
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

      <footer className="mt-14 border-t border-stone-200 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Về trang chủ
        </Link>
      </footer>
    </>
  );
}

function PostSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="mb-3 h-3 w-28 rounded bg-stone-200/60" />
      <div className="h-10 w-4/5 rounded bg-stone-200/70" />
      <div className="mt-8 aspect-[16/10] rounded-xl bg-stone-200/60" />
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
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Quay lại trang chủ
        </Link>

        <Suspense fallback={<PostSkeleton />}>
          <PostBody params={params} />
        </Suspense>
      </main>
    </div>
  );
}
