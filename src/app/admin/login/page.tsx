import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Đăng nhập",
};

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-normal text-ink transition-opacity hover:opacity-70"
          >
            Little Journal
          </Link>
          <p className="mt-2 text-sm text-muted">Khu vực riêng của bạn</p>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-white px-6 py-8 shadow-sm shadow-stone-200/40">
          <h1 className="font-serif text-xl font-bold tracking-normal text-ink">Đăng nhập</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
