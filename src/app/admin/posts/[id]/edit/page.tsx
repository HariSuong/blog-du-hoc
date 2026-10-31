import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { updatePost } from "@/app/admin/actions";
import { PostForm } from "@/components/admin/post-form";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/post";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Chỉnh sửa bài viết",
};

async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image_url, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Không thể tải bài viết để sửa:", error.message);
    return null;
  }

  return data;
}

function FormFallback() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-11 animate-pulse rounded-md border border-border bg-white" />
      <div className="aspect-[16/9] animate-pulse rounded-lg border border-dashed border-border bg-white/70" />
      <div className="min-h-[22rem] animate-pulse rounded-md border border-border bg-white sm:min-h-[28rem]">
        <div className="h-11 border-b border-border bg-stone-50/80" />
      </div>
    </div>
  );
}

async function EditPostForm({ id }: { id: string }) {
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const updateAction = updatePost.bind(null, post.id);

  return (
    <>
      <header className="mb-8">
        <p className="text-sm text-muted">
          <Link href="/admin" className="transition-colors hover:text-ink">
            ← Quay lại quản trị
          </Link>
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-normal text-ink">
          Chỉnh sửa bài viết
        </h1>
        <p className="mt-1 truncate text-sm text-muted">
          {post.title || "Không tiêu đề"}
        </p>
      </header>

      <Suspense fallback={<FormFallback />}>
        <PostForm mode="edit" post={post} action={updateAction} />
      </Suspense>
    </>
  );
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
      <Suspense fallback={<FormFallback />}>
        <EditPostForm id={id} />
      </Suspense>
    </div>
  );
}
