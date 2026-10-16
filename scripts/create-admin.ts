import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const ADMIN_EMAIL = "admin@support.com";
const ADMIN_PASSWORD = "admin!123";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local",
    );
    process.exit(1);
  }

  // Node < 22 chưa có WebSocket native — truyền ws để @supabase/supabase-js khởi tạo được.
  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: WebSocket as unknown as typeof globalThis.WebSocket,
    },
  });

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists") ||
      message.includes("duplicate")
    ) {
      console.log(`Tài khoản ${ADMIN_EMAIL} đã tồn tại — bỏ qua tạo mới.`);
      process.exit(0);
    }

    console.error("Không thể tạo admin:", error.message);
    process.exit(1);
  }

  console.log("Đã tạo tài khoản admin thành công.");
  console.log(`  Email: ${data.user?.email}`);
  console.log(`  ID:    ${data.user?.id}`);
  console.log("  Email đã được xác nhận (email_confirm: true).");
}

main().catch((err) => {
  console.error("Lỗi không mong đợi:", err);
  process.exit(1);
});
