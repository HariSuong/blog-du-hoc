"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type CoverImageFieldProps = {
  existingUrl?: string | null;
};

export function CoverImageField({ existingUrl }: CoverImageFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [removeCover, setRemoveCover] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function applyFile(file: File) {
    if (!file.type.startsWith("image/")) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const dt = new DataTransfer();
    dt.items.add(file);
    if (inputRef.current) {
      inputRef.current.files = dt.files;
    }

    setPreview(URL.createObjectURL(file));
    setRemoveCover(false);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    applyFile(file);
  }

  function handleRemove() {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setRemoveCover(true);
    setFileKey((k) => k + 1);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) applyFile(file);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        Ảnh bìa
      </label>

      <input type="hidden" name="existing_cover" value={existingUrl ?? ""} />
      <input
        type="hidden"
        name="remove_cover"
        value={removeCover ? "true" : "false"}
      />

      {preview ? (
        <div
          className="relative overflow-hidden rounded-lg border border-border bg-white"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Xem trước ảnh bìa"
            className="aspect-[16/9] w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-opacity hover:opacity-80"
            aria-label="Xóa ảnh bìa"
          >
            <X className="size-4" />
          </button>
          {dragging ? (
            <div className="absolute inset-0 flex items-center justify-center bg-sage/20 text-sm font-medium text-ink">
              Thả ảnh để thay thế
            </div>
          ) : null}
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center transition-colors ${
            dragging
              ? "border-sage bg-sage/10"
              : "border-border bg-white/70 hover:border-sage hover:bg-white"
          }`}
        >
          <ImagePlus className="size-6 text-muted" aria-hidden />
          <span className="text-sm text-muted">
            {dragging
              ? "Thả ảnh vào đây"
              : "Chọn ảnh bìa hoặc kéo thả vào đây"}
          </span>
        </label>
      )}

      <input
        key={fileKey}
        ref={inputRef}
        id={inputId}
        name="cover_image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />

      {preview ? (
        <label
          htmlFor={inputId}
          className="mt-2 inline-block cursor-pointer text-sm text-sage transition-opacity hover:opacity-80"
        >
          Đổi ảnh khác
        </label>
      ) : null}
    </div>
  );
}
