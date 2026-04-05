export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-panel p-4 dark:border-zinc-800">
      <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-3 h-4 w-11/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-2 h-4 w-9/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-4 h-3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-2 h-3 w-10/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}
