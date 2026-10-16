import { ArrowLeft, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { AdminCommentRow } from "@/components/admin/admin-comment-row";
import { LogoutButton } from "@/components/admin/logout-button";
import { createClient } from "@/lib/supabase/server";
import type { AdminCommentListItem } from "@/types/comment";

export const metadata = {
  title: "Quản lý bình luận",
};

async function getAdminComments(): Promise<AdminCommentListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, post_id, parent_id, author_name, author_email, content, created_at, posts(id, title, slug)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Không thể tải bình luận admin:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const rawPost = row.posts as
      | { id: string; title: string; slug: string }
      | { id: string; title: string; slug: string }[]
      | null;

    const posts = Array.isArray(rawPost) ? (rawPost[0] ?? null) : rawPost;

    return {
      id: row.id,
      post_id: row.post_id,
      parent_id: row.parent_id,
      author_name: row.author_name,
      author_email: row.author_email,
      content: row.content,
      created_at: row.created_at,
      posts,
    };
  });
}

export default async function AdminCommentsPage() {
  const comments = await getAdminComments();

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Quản trị
            </Link>
          </p>
          <h1 className="mt-1 flex items-center gap-2 font-serif text-3xl tracking-tight text-ink">
            <MessagesSquare className="size-7 text-sage" aria-hidden />
            Bình luận
          </h1>
          <p className="mt-1 text-sm text-muted">
            {comments.length} bình luận trên toàn bộ bài viết
          </p>
        </div>
        <LogoutButton />
      </header>

      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white/60 px-6 py-14 text-center">
          <p className="font-serif text-xl text-ink">Chưa có bình luận nào</p>
          <p className="mt-2 text-sm text-muted">
            Khi độc giả để lại lời nhắn, chúng sẽ hiện ở đây.
          </p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-lg border border-border bg-white">
          {comments.map((comment) => (
            <AdminCommentRow key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </div>
  );
}
