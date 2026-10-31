type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Chưa có gì ở đây cả",
  description = "Những dòng chữ đầu tiên sẽ sớm xuất hiện. Hãy quay lại khi có chút gì đó để kể.",
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white/70 px-6 py-16 text-center">
      <p className="font-serif text-xl font-bold tracking-normal text-ink">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-md font-sans text-[15px] font-light leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}
