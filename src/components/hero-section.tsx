import Image from "next/image";
import { SITE_AUTHOR } from "@/lib/author";

export function HeroSection() {
  return (
    <section
      aria-label="Giới thiệu"
      className="grid min-h-[70vh] grid-cols-1 lg:grid-cols-2"
    >
      <div className="flex flex-col justify-center bg-sage px-8 py-14 sm:px-12 sm:py-20 lg:px-16 xl:px-20">
        <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-normal text-ink sm:text-6xl lg:text-7xl">
          {SITE_AUTHOR.heroTitle}
        </h1>
        <blockquote className="mt-8 max-w-md border-l-2 border-ink/20 pl-5 font-serif text-lg font-normal italic leading-relaxed text-ink/80 sm:text-xl">
          “{SITE_AUTHOR.heroQuote}”
        </blockquote>
        <p className="mt-6 max-w-md font-sans text-[15px] font-light leading-relaxed text-ink/70 sm:text-base">
          {SITE_AUTHOR.heroIntro}
        </p>
      </div>

      <div className="relative min-h-[52vh] bg-ink/5 lg:min-h-full">
        {SITE_AUTHOR.avatarUrl ? (
          <Image
            src={SITE_AUTHOR.avatarUrl}
            alt={`Chân dung ${SITE_AUTHOR.name}`}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-sage/60">
            <span className="font-serif text-6xl font-bold tracking-normal text-ink/25">
              {SITE_AUTHOR.initials}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
