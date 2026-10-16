export type Comment = {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  created_at: string;
};

export type CommentNode = Comment & {
  replies: CommentNode[];
};

export type AdminCommentListItem = Comment & {
  posts: {
    id: string;
    title: string;
    slug: string;
  } | null;
};
