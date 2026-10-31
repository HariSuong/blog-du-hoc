export const SITE_AUTHOR = {
  name: "Little Journal",
  /** Email dùng để đánh dấu bình luận / trả lời của tác giả trên trang công khai. */
  email: "admin@support.com",
  bio: "Góc nhỏ của riêng mình — vài dòng về những ngày thường khi ở xa nhà, viết chậm để giữ lại điều bình dị.",
  /** Ảnh chân dung hero / contact — thay bằng ảnh thật khi có. */
  avatarUrl:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  initials: "LJ",
  heroTitle: "Journey",
  heroQuote:
    "Những chuyến đi không chỉ thay đổi bản đồ — chúng viết lại cách ta nhìn về nhà.",
  heroIntro:
    "Little Journal là góc tạp chí cá nhân về du học, hành trình và những khoảnh khắc nhỏ giữa đường. Viết chậm, giữ lại điều bình dị.",
  socials: {
    email: "hello@littlejournal.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
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
