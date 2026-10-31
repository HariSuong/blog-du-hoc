import Image from "next/image";
import { DownloadGuideButton } from "@/components/download-guide-button";
import type { Ebook } from "@/types/ebook";

type EbookCardProps = {
  ebook: Ebook;
};

export function EbookCard({ ebook }: EbookCardProps) {
  return (
    <article className="flex h-full flex-col bg-sage px-6 py-10 text-center ring-1 ring-ink/8 sm:px-8 sm:py-12">
      {ebook.category ? (
        <p className="font-sans text-[11px] font-light uppercase tracking-[0.18em] text-ink/55">
          {ebook.category}
        </p>
      ) : (
        <p className="font-sans text-[11px] font-light uppercase tracking-[0.18em] text-ink/40">
          Guide
        </p>
      )}

      <h2 className="mt-3 font-serif text-2xl font-bold leading-snug tracking-normal text-ink sm:text-[1.65rem]">
        {ebook.title}
      </h2>

      <div className="mx-auto mt-8 flex w-full flex-1 items-center justify-center px-2">
        {ebook.cover_image_url ? (
          <Image
            src={ebook.cover_image_url}
            alt={`Bìa ${ebook.title}`}
            width={440}
            height={587}
            className="h-auto w-full max-h-[360px] max-w-[220px] rounded-md object-contain shadow-xl transition duration-300 hover:shadow-2xl"
            sizes="(max-width: 768px) 60vw, 220px"
          />
        ) : (
          <div className="flex aspect-[3/4] w-full max-h-[360px] max-w-[220px] items-center justify-center rounded-md bg-white/45 px-4 shadow-xl transition duration-300 hover:shadow-2xl">
            <span className="font-serif text-lg font-bold leading-snug tracking-normal text-ink/40">
              {ebook.title}
            </span>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <DownloadGuideButton fileUrl={ebook.file_url} title={ebook.title} />
      </div>
    </article>
  );
}
