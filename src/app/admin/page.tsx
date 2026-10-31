import { BookOpen, MessagesSquare, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { LogoutButton } from "@/components/admin/logout-button";
import { formatPostDate } from "@/lib/format-date";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Quản trị",
};

type AdminPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
  comments: { count: number }[] | null;
};

async function getAdminPosts(): Promise<AdminPostRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image_url, created_at, comments(count)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Không thể tải bài viết admin:", error.message);
    return [];
  }

  return (data ?? []) as AdminPostRow[];
}

export default async function AdminDashboardPage() {
  const posts = await getAdminPosts();
  const totalComments = posts.reduce(
    (sum, post) => sum + (post.comments?.[0]?.count ?? 0),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-ink">
              Little Journal
            </Link>
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-normal text-ink">
            Quản trị
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/comments"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-2.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <MessagesSquare className="size-4" aria-hidden />
            Bình luận
            {totalComments > 0 ? (
              <span className="rounded-full bg-sage px-1.5 py-0.5 text-xs font-medium text-ink">
                {totalComments}
              </span>
            ) : null}
          </Link>
          <Link
            href="/admin/ebooks"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-2.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <BookOpen className="size-4" aria-hidden />
            Ebooks
          </Link>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-cta px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            <Plus className="size-4" aria-hidden />
            Viết bài mới
          </Link>
          <LogoutButton />
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white/60 px-6 py-14 text-center">
          <p className="font-serif text-xl font-bold tracking-normal text-ink">Chưa có bài viết nào</p>
          <p className="mt-2 text-sm text-muted">
            Hãy bắt đầu bằng vài dòng đầu tiên.
          </p>
          <Link
            href="/admin/posts/new"
            className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-cta px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            <Plus className="size-4" aria-hidden />
            Viết bài mới
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
          {posts.map((post) => {
            const commentCount = post.comments?.[0]?.count ?? 0;

            return (
              <li
                key={post.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-sage sm:size-14">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-ink/40">
                      —
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-serif text-lg font-bold tracking-normal text-ink">
                    {post.title || "Không tiêu đề"}
                  </h2>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <time dateTime={post.created_at}>
                      {formatPostDate(post.created_at)}
                    </time>
                    <Link
                      href="/admin/comments"
                      className="inline-flex items-center gap-1 transition-colors hover:text-ink"
                    >
                      <MessagesSquare className="size-3.5" aria-hidden />
                      {commentCount} bình luận
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:shrink-0">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Chỉnh sửa
                  </Link>
                  <DeletePostButton
                    postId={post.id}
                    postTitle={post.title || "Không tiêu đề"}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
