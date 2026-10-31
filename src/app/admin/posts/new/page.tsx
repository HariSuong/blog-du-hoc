import Link from "next/link";
import { Suspense } from "react";
import { createPost } from "@/app/admin/actions";
import { PostForm } from "@/components/admin/post-form";

export const metadata = {
  title: "Viết bài mới",
};

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

export default function NewPostPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-sm text-muted">
          <Link href="/admin" className="transition-colors hover:text-ink">
            ← Quay lại quản trị
          </Link>
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-normal text-ink">
          Viết bài mới
        </h1>
        <p className="mt-1 text-sm text-muted">
          Viết chậm một chút — mọi thứ sẽ được lưu lại.
        </p>
      </header>

      <Suspense fallback={<FormFallback />}>
        <PostForm mode="create" action={createPost} />
      </Suspense>
    </div>
  );
}
