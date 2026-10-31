import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { createEbook } from "@/app/admin/ebooks/actions";
import { DeleteEbookButton } from "@/components/admin/delete-ebook-button";
import { EbookForm } from "@/components/admin/ebook-form";
import { formatPostDate } from "@/lib/format-date";
import { createClient } from "@/lib/supabase/server";
import type { Ebook } from "@/types/ebook";

export const metadata = {
  title: "Quản lý Ebooks",
};

async function getAdminEbooks(): Promise<Ebook[]> {
  await connection();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ebooks")
    .select("id, title, category, cover_image_url, file_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Không thể tải ebooks admin:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function AdminEbooksPage() {
  const ebooks = await getAdminEbooks();

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <p className="text-sm text-muted">
          <Link href="/admin" className="transition-colors hover:text-ink">
            ← Quay lại quản trị
          </Link>
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-normal text-ink">
          Quản lý Ebooks
        </h1>
        <p className="mt-1 text-sm text-muted">
          Upload ảnh bìa + PDF lên Storage, tạo card tải về cho độc giả.
        </p>
      </header>

      <section className="mb-12" aria-label="Thêm ebook mới">
        <h2 className="mb-4 font-serif text-xl font-bold tracking-normal text-ink">Thêm ebook mới</h2>
        <EbookForm action={createEbook} />
      </section>

      <section aria-label="Danh sách ebook">
        <h2 className="mb-4 font-serif text-xl font-bold tracking-normal text-ink">
          Đã đăng ({ebooks.length})
        </h2>

        {ebooks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-white/60 px-6 py-12 text-center">
            <BookOpen className="mx-auto size-8 text-sage-deep" aria-hidden />
            <p className="mt-3 font-serif text-lg font-bold tracking-normal text-ink">Chưa có ebook nào</p>
            <p className="mt-1 text-sm text-muted">
              Dùng form phía trên để đăng guide đầu tiên.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
            {ebooks.map((ebook) => (
              <li
                key={ebook.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-sage sm:size-14">
                  {ebook.cover_image_url ? (
                    <Image
                      src={ebook.cover_image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-ink/40">
                      PDF
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {ebook.category ? (
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {ebook.category}
                    </p>
                  ) : null}
                  <h3 className="truncate font-serif text-lg font-bold tracking-normal text-ink">
                    {ebook.title}
                  </h3>
                  <time
                    dateTime={ebook.created_at}
                    className="text-sm text-muted"
                  >
                    {formatPostDate(ebook.created_at)}
                  </time>
                </div>

                <div className="flex items-center gap-4 sm:shrink-0">
                  <a
                    href={ebook.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    Xem PDF
                  </a>
                  <DeleteEbookButton
                    ebookId={ebook.id}
                    ebookTitle={ebook.title}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
