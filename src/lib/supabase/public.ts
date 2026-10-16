import { createClient } from "@supabase/supabase-js";

/**
 * Client đọc dữ liệu công khai (không cần session cookie).
 * Dùng cho Server Components trang public để tương thích Cache Components.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
