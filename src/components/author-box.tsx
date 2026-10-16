import { SITE_AUTHOR } from "@/lib/author";
import { formatPostDate } from "@/lib/format-date";

type AuthorBoxProps = {
  publishedAt: string;
};

export function AuthorBox({ publishedAt }: AuthorBoxProps) {
  return (
    <aside className="mt-12 rounded-lg border border-border bg-white px-5 py-6 sm:px-6">
      <div className="flex gap-4 sm:gap-5">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-sage/20 sm:size-16">
          {SITE_AUTHOR.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={SITE_AUTHOR.avatarUrl}
              alt={SITE_AUTHOR.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-serif text-lg text-sage">
              {SITE_AUTHOR.initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-muted">
            Viết bởi
          </p>
          <h2 className="mt-0.5 font-serif text-xl text-ink">
            {SITE_AUTHOR.name}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {SITE_AUTHOR.bio}
          </p>
          <p className="mt-3 text-sm text-muted">
            Đăng ngày{" "}
            <time dateTime={publishedAt}>{formatPostDate(publishedAt)}</time>
          </p>
        </div>
      </div>
    </aside>
  );
}
