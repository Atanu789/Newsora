'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-2xl border border-red-300 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm">{error.message || 'Unexpected error while loading this page.'}</p>
        <button
          onClick={reset}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
