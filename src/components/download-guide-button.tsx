"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ebookFilename, withDownloadParam } from "@/lib/download-url";

type DownloadGuideButtonProps = {
  fileUrl: string;
  title: string;
};

export function DownloadGuideButton({
  fileUrl,
  title,
}: DownloadGuideButtonProps) {
  const [pending, setPending] = useState(false);
  const filename = ebookFilename(title);
  const downloadUrl = withDownloadParam(fileUrl, filename);

  async function handleDownload() {
    if (pending) return;
    setPending(true);

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: Supabase ?download= buộc Content-Disposition attachment
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = filename;
      anchor.rel = "noopener";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cta px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Downloading…
        </>
      ) : (
        "Download the Guide"
      )}
    </button>
  );
}
