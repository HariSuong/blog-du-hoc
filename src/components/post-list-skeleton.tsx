export function PostListSkeleton() {
  return (
    <div className="space-y-8" aria-hidden>
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse border-b border-border py-8 first:pt-0">
          <div className="mb-5 aspect-[16/9] rounded-lg bg-stone-200/60" />
          <div className="h-3 w-24 rounded bg-stone-200/60" />
          <div className="mt-3 h-7 w-3/4 rounded bg-stone-200/70" />
          <div className="mt-3 h-4 w-full rounded bg-stone-200/50" />
          <div className="mt-2 h-4 w-2/3 rounded bg-stone-200/50" />
        </div>
      ))}
    </div>
  );
}
