import { SkeletonCard } from '@/components/news/SkeletonCard';

export default function AppLoading() {
  return (
    <main className="min-h-screen pb-24 md:pb-8">
      <div className="mx-auto w-full max-w-3xl px-4 py-4">
        <div className="mb-4 h-28 animate-pulse rounded-2xl bg-zinc-200/70 dark:bg-zinc-800" />
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </main>
  );
}
