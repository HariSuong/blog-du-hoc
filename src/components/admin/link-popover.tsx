"use client";

import { useEffect, useRef, useState } from "react";

type LinkPopoverProps = {
  open: boolean;
  initialUrl?: string;
  onClose: () => void;
  onSubmit: (url: string) => void;
  onRemove?: () => void;
};

export function LinkPopover({
  open,
  initialUrl = "",
  onClose,
  onSubmit,
  onRemove,
}: LinkPopoverProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, initialUrl]);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    onSubmit(withProtocol);
  }

  return (
    <div className="absolute left-2 top-full z-20 mt-1 w-[min(100%,18rem)] rounded-md border border-border bg-white p-3 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-2">
        <label htmlFor="link-url" className="block text-xs font-medium text-ink">
          Đường dẫn
        </label>
        <input
          ref={inputRef}
          id="link-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm text-ink outline-none focus:border-sage focus:ring-2 focus:ring-sage/25"
        />
        <div className="flex items-center justify-between gap-2 pt-1">
          {onRemove && initialUrl ? (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-red-600 transition-opacity hover:opacity-80"
            >
              Gỡ liên kết
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2.5 py-1 text-xs text-muted hover:text-ink"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-sage px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
