"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { EbookActionResult } from "@/app/admin/ebooks/actions";
import { CoverImageField } from "@/components/admin/cover-image-field";

type EbookFormProps = {
  action: (formData: FormData) => Promise<EbookActionResult>;
};

export function EbookForm({ action }: EbookFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      form.reset();
      // CoverImageField giữ preview bằng state riêng — remount để xóa ảnh cũ
      setResetKey((key) => key + 1);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-border bg-white p-5 sm:p-6"
    >
      <div>
        <label
          htmlFor="ebook-title"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Tiêu đề
        </label>
        <input
          id="ebook-title"
          name="title"
          type="text"
          required
          disabled={pending}
          placeholder="Ví dụ: Study Abroad Starter Pack"
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-sage-deep focus:ring-2 focus:ring-sage/40 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="ebook-category"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Thể loại
        </label>
        <input
          id="ebook-category"
          name="category"
          type="text"
          disabled={pending}
          placeholder="Guide, Checklist, Destinations…"
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:border-sage-deep focus:ring-2 focus:ring-sage/40 disabled:opacity-60"
        />
      </div>

      <CoverImageField key={resetKey} />

      <div>
        <label
          htmlFor="ebook-pdf"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          File PDF
        </label>
        <input
          key={`pdf-${resetKey}`}
          id="ebook-pdf"
          name="pdf_file"
          type="file"
          accept="application/pdf,.pdf"
          required
          disabled={pending}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-sage file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:opacity-90 disabled:opacity-60"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-cta px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Đang tải lên…
          </>
        ) : (
          "Đăng ebook"
        )}
      </button>
    </form>
  );
}
