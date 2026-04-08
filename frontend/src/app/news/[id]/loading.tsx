export default function NewsDetailLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6">
      <div className="h-4 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <article className="mt-4 rounded-2xl border border-zinc-200 bg-panel p-5 dark:border-zinc-800">
        <div className="h-5 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-4 h-8 w-11/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-8 w-9/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-6 h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-10/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-9/12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </article>
    </main>
  );
}
