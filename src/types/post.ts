export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PostListItem = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "cover_image_url" | "created_at"
>;
