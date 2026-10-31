import Image from "next/image";
import Link from "next/link";
import {
  estimateReadingTime,
  formatReadingTime,
} from "@/lib/reading-time";
import type { PostListItem } from "@/types/post";

type PostCardProps = {
  post: PostListItem & { content?: string | null };
};

export function PostCard({ post }: PostCardProps) {
  const minutes = estimateReadingTime(post.content ?? post.excerpt);

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      <Link href={`/posts/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-sage/40">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-sage">
              <span className="font-serif text-2xl font-bold tracking-normal text-ink/30">
                LJ
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col bg-sage px-5 py-5 sm:px-6 sm:py-6">
          <p className="font-sans text-xs font-light uppercase tracking-[0.14em] text-ink/55">
            {formatReadingTime(minutes)}
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold leading-snug tracking-normal text-ink sm:text-[1.35rem]">
            {post.title || "Không tiêu đề"}
          </h2>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-3 font-sans text-[15px] font-light leading-relaxed text-ink/70">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
