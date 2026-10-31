"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useState, useTransition } from "react";
import type { PostActionResult } from "@/app/admin/actions";
import { CoverImageField } from "@/components/admin/cover-image-field";
import type { Post } from "@/types/post";

const RichTextEditor = dynamic(
  () =>
    import("@/components/admin/rich-text-editor").then(
      (mod) => mod.RichTextEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[22rem] animate-pulse rounded-md border border-border bg-white sm:min-h-[28rem]"
        aria-hidden
      >
        <div className="h-11 border-b border-border bg-stone-50/80" />
      </div>
    ),
  },
);

type PostFormProps = {
  mode: "create" | "edit";
  post?: Post;
  action: (formData: FormData) => Promise<PostActionResult>;
};

export function PostForm({ mode, post, action }: PostFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  const submitLabel = mode === "create" ? "Đăng bài" : "Cập nhật";
  const pendingLabel = mode === "create" ? "Đang đăng…" : "Đang lưu…";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Tiêu đề
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={post?.title ?? ""}
          disabled={pending}
          placeholder="Để trống sẽ thành “Không tiêu đề”"
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 font-serif text-lg font-bold tracking-normal text-ink outline-none transition-shadow placeholder:font-sans placeholder:text-sm placeholder:font-light placeholder:text-muted/60 focus:border-sage focus:ring-2 focus:ring-sage/25 disabled:opacity-60"
        />
      </div>

      <CoverImageField existingUrl={post?.cover_image_url} />

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">
          Nội dung
        </span>
        <Suspense
          fallback={
            <div
              className="min-h-[22rem] animate-pulse rounded-md border border-border bg-white sm:min-h-[28rem]"
              aria-hidden
            >
              <div className="h-11 border-b border-border bg-stone-50/80" />
            </div>
          }
        >
          <RichTextEditor
            initialContent={post?.content ?? ""}
            disabled={pending}
          />
        </Suspense>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-cta px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
        <Link
          href="/admin"
          className={`rounded-md border border-border bg-white px-4 py-2.5 text-sm text-muted transition-colors hover:text-ink ${pending ? "pointer-events-none opacity-60" : ""}`}
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
