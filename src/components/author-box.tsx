import Image from "next/image";
import { SITE_AUTHOR } from "@/lib/author";
import { formatPostDate } from "@/lib/format-date";

type AuthorBoxProps = {
  publishedAt: string;
};

export function AuthorBox({ publishedAt }: AuthorBoxProps) {
  return (
    <aside className="mt-14 bg-sage px-5 py-7 sm:px-8 sm:py-8">
      <div className="flex gap-4 sm:gap-5">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-white/50 sm:size-[4.5rem]">
          {SITE_AUTHOR.avatarUrl ? (
            <Image
              src={SITE_AUTHOR.avatarUrl}
              alt={SITE_AUTHOR.name}
              fill
              className="object-cover"
              sizes="72px"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-serif text-lg font-bold tracking-normal text-ink/50">
              {SITE_AUTHOR.initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-sans text-xs font-light uppercase tracking-[0.14em] text-ink/55">
            Viết bởi
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold tracking-normal text-ink sm:text-2xl">
            {SITE_AUTHOR.name}
          </h2>
          <p className="mt-2 font-sans text-[15px] font-light leading-relaxed text-ink/75">
            {SITE_AUTHOR.bio}
          </p>
          <p className="mt-3 font-sans text-sm font-light leading-relaxed text-ink/55">
            Đăng ngày{" "}
            <time dateTime={publishedAt}>{formatPostDate(publishedAt)}</time>
          </p>
        </div>
      </div>
    </aside>
  );
}
