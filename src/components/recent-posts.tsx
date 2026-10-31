import { PostCard } from "@/components/post-card";
import type { PostListItem } from "@/types/post";

type RecentPostsProps = {
  posts: PostListItem[];
};

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12" aria-label="Bài viết gần đây">
      <h2 className="text-center font-serif text-3xl font-bold tracking-normal text-ink sm:text-4xl">
        Recent Posts
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
