export const SITE_AUTHOR = {
  name: "Little Journal",
  /** Email dùng để đánh dấu bình luận / trả lời của tác giả trên trang công khai. */
  email: "admin@support.com",
  bio: "Góc nhỏ của riêng mình — vài dòng về những ngày thường khi ở xa nhà, viết chậm để giữ lại điều bình dị.",
  avatarUrl: null as string | null,
  initials: "LJ",
};

export function isAuthorComment(comment: {
  author_email?: string | null;
  author_name?: string | null;
}): boolean {
  const email = comment.author_email?.trim().toLowerCase();
  if (email && email === SITE_AUTHOR.email.toLowerCase()) {
    return true;
  }
  return false;
}
