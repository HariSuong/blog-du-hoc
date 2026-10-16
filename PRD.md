# Product Requirements Document (PRD) — Little Journal

## 1. Tổng quan sản phẩm
- **Tên dự án:** Little Journal (Góc nhỏ của riêng mình).
- **Mục tiêu:** Xây dựng blog/nhật ký trực tuyến cá nhân tối giản dành cho du học sinh chia sẻ trải nghiệm thường ngày và lưu giữ kỷ niệm.
- **Đối tượng sử dụng:**
  - **Admin (Tác giả):** Đăng nhập để viết bài mới, sửa/xóa bài viết, tải ảnh cover.
  - **Người đọc:** Gia đình, bạn bè và khách vãng lai chỉ đọc bài viết mà không cần tài khoản.

---

## 2. Yêu cầu tính năng (Functional Requirements)

### 2.1. Khu vực công khai (Public)
1. **Trang chủ (`/`):**
   - Header: Tên blog "Little Journal", câu bio ngắn gọn, nút dẫn tới `/admin` (tinh tế, kín đáo).
   - Danh sách bài viết: Lấy từ database Supabase, sắp xếp bài mới nhất lên đầu (`created_at DESC`).
   - Card bài viết: Hiển thị ảnh cover (nếu có), tiêu đề, ngày đăng định dạng thân thiện, đoạn trích ngắn (`excerpt`).
   - Trạng thái trống (Empty State): Khi chưa có bài viết, hiển thị thông điệp nhẹ nhàng, ấm áp.
2. **Trang chi tiết bài viết (`/posts/[slug]`):**
   - Nút quay lại trang chủ.
   - Tiêu đề bài viết (font serif), ngày đăng.
   - Ảnh cover kích thước lớn, bo góc nhẹ (nếu có).
   - Nội dung bài viết: Giữ định dạng xuống dòng (`whitespace-pre-line`), độ rộng tối đa đọc thoải mái (`max-w-2xl` hoặc `max-w-prose`), cỡ chữ 17-18px.
   - Trang 404 tùy chỉnh khi bài viết không tồn tại.

### 2.2. Khu vực quản trị (Admin)
1. **Trang đăng nhập (`/admin/login`):**
   - Form đăng nhập tối giản: Email và Password.
   - Đăng nhập qua Supabase Auth. Không có nút đăng ký công khai.
   - Đăng nhập thành công chuyển hướng đến `/admin`.
2. **Trang Dashboard quản trị (`/admin`):**
   - Nút "Viết bài mới" nổi bật.
   - Nút "Đăng xuất".
   - Bảng/danh sách quản lý toàn bộ bài viết: Hiển thị Tiêu đề, Ngày đăng, nút "Chỉnh sửa" (`/admin/posts/[id]/edit`) và nút "Xóa" bài (kèm popup xác nhận).
3. **Trang viết bài mới (`/admin/posts/new`):**
   - Ô nhập Tiêu đề (nếu để trống tự điền "Không tiêu đề").
   - Ô tải ảnh bìa (`cover_image`): Tải ảnh trực tiếp lên bucket `blog-images` của Supabase Storage, preview ảnh ngay sau khi chọn.
   - Ô nội dung bài viết (Textarea lớn, thoải mái gõ bài dài).
   - Nút "Đăng bài" (có loading spinner khi đang lưu) và nút "Hủy".
   - Tự động sinh `slug` duy nhất không dấu kết hợp ký tự ngẫu nhiên hoặc timestamp để tránh trùng URL.
4. **Trang chỉnh sửa bài viết (`/admin/posts/[id]/edit`):**
   - Tải dữ liệu bài viết hiện tại vào form.
   - Cho phép cập nhật tiêu đề, ảnh bìa, nội dung.
   - Nút "Cập nhật" và "Hủy".

---

## 3. Kiến trúc dữ liệu & Bảo mật

### 3.1. Database Schema (`posts`)
- `id`: UUID (Primary Key).
- `title`: TEXT.
- `slug`: TEXT (Unique, đánh index).
- `content`: TEXT (Bắt buộc).
- `cover_image_url`: TEXT (Nullable, link ảnh từ Supabase Storage).
- `created_at`: TIMESTAMPTZ (Mặc định `now()`).
- `updated_at`: TIMESTAMPTZ (Tự động cập nhật).

### 3.2. Bảo mật & Middleware
- Sử dụng Next.js Middleware (`middleware.ts`) chặn toàn bộ route `/admin/*` nếu chưa đăng nhập (ngoại trừ `/admin/login`).
- Nếu đã đăng nhập mà truy cập `/admin/login`, tự động chuyển hướng vào `/admin`.
- RLS trên Supabase: Ai cũng có thể `SELECT`, chỉ tài khoản `authenticated` mới được `INSERT`, `UPDATE`, `DELETE`.

---

## 4. UI/UX & Visual Direction
- Phong cách: **Minimalist Personal Journal** (Nhật ký cá nhân mộc mạc, tĩnh lặng, ấm áp).
- Bảng màu:
  - Nền chính: `#FAF7F0` (Cream)
  - Card/Nền phụ: `#FFFFFF`
  - Chữ chính: `#1E293B` (Slate-800)
  - Chữ phụ/Ngày tháng: `#64748B` (Slate-500)
  - Điểm nhấn/Nút chính: `#A3B18A` (Sage Green) hoặc Slate tối giản
  - Viền mỏng: `#E7E5E4` (Stone-200)
- Thiết kế responsive chuẩn chỉnh trên cả điện thoại (320px+) và máy tính.