import Image from "next/image";
import Link from "next/link";
import { formatPostDate } from "@/lib/format-date";
import type { PostListItem } from "@/types/post";

type PostCardProps = {
  post: PostListItem;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border-b border-border py-8 first:pt-0 last:border-b-0">
      <Link href={`/posts/${post.slug}`} className="block">
        {post.cover_image_url ? (
          <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg bg-white">
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        ) : null}

        <time
          dateTime={post.created_at}
          className="text-sm text-muted"
        >
          {formatPostDate(post.created_at)}
        </time>

        <h2 className="mt-2 font-serif text-2xl tracking-tight text-ink transition-colors group-hover:text-sage sm:text-[1.65rem]">
          {post.title || "Không tiêu đề"}
        </h2>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">
            {post.excerpt}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
