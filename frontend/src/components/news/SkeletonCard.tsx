export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-panel p-4 dark:border-zinc-800 sm:p-5">
      <div className="flex items-center gap-2">
        <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="ml-auto h-4 w-14 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="mt-4 h-5 w-11/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-2 h-5 w-10/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-4 h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-2 h-4 w-10/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-5 h-9 w-32 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}
