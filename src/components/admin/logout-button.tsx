"use client";

import { Loader2, LogOut } from "lucide-react";
import { useTransition } from "react";
import { logout } from "@/app/admin/actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-2 text-sm text-muted transition-colors hover:border-stone-300 hover:text-ink disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-4" aria-hidden />
      )}
      Đăng xuất
    </button>
  );
}
