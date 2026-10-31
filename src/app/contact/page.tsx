import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/site-shell";
import { SITE_AUTHOR } from "@/lib/author";

export const metadata: Metadata = {
  title: "Contact",
  description: "Liên hệ và kết nối với Little Journal.",
};

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: SITE_AUTHOR.socials.instagram,
    description: "Theo dõi hành trình hàng ngày",
  },
  {
    label: "Facebook",
    href: SITE_AUTHOR.socials.facebook,
    description: "Chia sẻ bài viết & cập nhật",
  },
  {
    label: "LinkedIn",
    href: SITE_AUTHOR.socials.linkedin,
    description: "Kết nối chuyên môn",
  },
] as const;

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[48vh] bg-sage/40 lg:min-h-[78vh]">
          {SITE_AUTHOR.avatarUrl ? (
            <Image
              src={SITE_AUTHOR.avatarUrl}
              alt={`Chân dung ${SITE_AUTHOR.name}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <span className="font-serif text-6xl font-bold tracking-normal text-ink/25">
                {SITE_AUTHOR.initials}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center bg-sage px-8 py-14 sm:px-12 sm:py-20 lg:px-14">
          <p className="font-sans text-xs font-light uppercase tracking-[0.18em] text-ink/55">
            Contact
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-normal text-ink sm:text-5xl">
            Hãy gửi lời nhắn
          </h1>
          <p className="mt-5 max-w-md font-sans text-[15px] font-light leading-relaxed text-ink/75 sm:text-base">
            Cảm ơn bạn đã ghé thăm Little Journal. Nếu muốn chào hỏi, góp ý
            hoặc đơn giản là chia sẻ một chuyến đi — mình luôn vui khi nhận được
            tin nhắn.
          </p>

          <a
            href={`mailto:${SITE_AUTHOR.socials.email}`}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-cta px-5 py-2.5 font-sans text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            <Mail className="size-4" aria-hidden />
            {SITE_AUTHOR.socials.email}
          </a>

          <ul className="mt-10 space-y-3 font-sans">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/55 px-5 py-4 transition-colors hover:bg-white/80"
                >
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="mt-0.5 block text-sm font-light leading-relaxed text-ink/65">
                    {item.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SiteShell>
  );
}
