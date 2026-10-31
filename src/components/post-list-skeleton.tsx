export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden bg-white ring-1 ring-black/5">
          <div className="aspect-[4/3] bg-stone-200/60" />
          <div className="space-y-3 bg-sage px-5 py-5">
            <div className="h-3 w-20 rounded bg-ink/10" />
            <div className="h-6 w-4/5 rounded bg-ink/15" />
            <div className="h-4 w-full rounded bg-ink/10" />
            <div className="h-4 w-2/3 rounded bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
