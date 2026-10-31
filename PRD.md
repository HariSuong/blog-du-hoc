# Product Requirements Document (PRD) — Little Journal (V2 - Magazine & Multi-page)

## 1. Tổng quan sản phẩm
- **Tên dự án:** Little Journal
- **Định hướng phong cách:** Tạp chí du lịch/du học cá nhân (Editorial Journal), lấy cảm hứng từ layout Wix Travel Blog kết hợp tone màu xanh xô thơm `#D1E1D6`.
- **Đối tượng:**
  - Tác giả (Admin): Quản lý bài viết, trả lời/xóa bình luận, đăng tải ebook/tài liệu.
  - Độc giả: Gia đình, bạn bè và người theo dõi đọc blog, bình luận và tải ebook miễn phí không cần đăng nhập.

---

## 2. Cấu trúc trang & Tính năng (Sitemap & Features)

### 2.1. Header & Navigation chung
- Menu cố định: `Home` | `Blog` | `Ebooks` | `Contact`
- Nút truy cập nhanh vào `/admin` (kín đáo).

### 2.2. Trang chủ (`/`) — Gồm đúng 2 phần chính:
1. **Hero Section (Bố cục 2 cột):**
   - Cột trái: Khối nền màu xanh `#D1E1D6` gồm tiêu đề lớn phong cách nghệ thuật (ví dụ "Journey"), trích dẫn (quote) ý nghĩa và đoạn giới thiệu ngắn về tác giả.
   - Cột phải: Khung ảnh chân dung dọc chất lượng cao.
2. **Latest Journal Entries:**
   - Tiêu đề lớn: "Latest Journal Entries".
   - Lưới hiển thị 3 bài viết mới nhất dạng Card 2 tầng: nửa trên ảnh thumbnail, nửa dưới khối màu `#D1E1D6` gồm thời gian đọc (`1 min read`), tiêu đề bài viết và đoạn trích ngắn.

### 2.3. Trang Blog (`/blog`)
- Header căn giữa: Chữ "Blog" to bản.
- Danh sách toàn bộ bài viết phân trang hoặc hiển thị lưới 3 cột đồng bộ phong cách Card 2 tầng.

### 2.4. Trang Đọc bài viết (`/posts/[slug]`)
- Bố cục mở rộng (`max-w-4xl` hoặc `max-w-5xl`), bỏ bóp hẹp padding hai bên để ảnh lớn và chữ thoáng mắt.
- Nội dung rich text: Hỗ trợ ảnh chèn giữa bài bo góc nhẹ, căn giữa, tiêu đề con, quote.
- **Author Box:** Khung tác giả cuối bài (Avatar, tên tác giả, bio ngắn).
- **Comments Section:** Danh sách bình luận phân cấp (hỗ trợ nút Trả lời / Reply) và form gửi bình luận của độc giả.
- **Recent Posts Section:** Dãy 3 bài viết liên quan/ngẫu nhiên khác ở chân trang.

### 2.5. Trang Tài nguyên / Ebook (`/ebooks`)
- Tiêu đề: "Ebooks & Guides" (hoặc "Destinations").
- Grid các thẻ tài liệu: Thể loại nhỏ, tiêu đề to, ảnh mockup bìa sách ở giữa, nút "Download the Guide" màu đen để bấm tải thẳng file PDF.

### 2.6. Trang Liên hệ (`/contact`)
- Cột trái: Ảnh chân dung cá nhân.
- Cột phải: Lời nhắn gửi và các khối liên kết mạng xã hội (Instagram, Facebook, Email, LinkedIn...) trên nền `#D1E1D6`.

### 2.7. Khu vực Quản trị (`/admin`)
- Quản lý bài viết: Thêm / Sửa / Xóa bài viết với Rich Text Editor Tiptap (hỗ trợ upload ảnh bìa và chèn ảnh giữa bài vào Supabase Storage).
- Quản lý bình luận: Xem bình luận theo bài viết, xóa bình luận spam, Admin trả lời trực tiếp.
- Quản lý Ebook: Form tải ảnh bìa, upload file PDF lên bucket `blog-files` và tạo card tải về.

---

## 3. Cơ sở dữ liệu Supabase
- Bảng `posts`: `id`, `title`, `slug`, `content`, `excerpt`, `cover_image_url`, `created_at`, `updated_at`.
- Bảng `comments`: `id`, `post_id`, `parent_id`, `author_name`, `author_email`, `content`, `created_at`.
- Bảng `ebooks`: `id`, `title`, `category`, `cover_image_url`, `file_url`, `created_at`.
- Buckets: `blog-images`, `blog-files`.