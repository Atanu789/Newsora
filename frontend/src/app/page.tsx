import { BottomNav } from '@/components/layout/BottomNav';
import { TopBar } from '@/components/layout/TopBar';
import { NewsFeed } from '@/components/news/NewsFeed';
import { FloatingDock } from '@/components/ui/FloatingDock';
import { GradientHero } from '@/components/ui/GradientHero';

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen pb-20 md:pb-8">
      <TopBar />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4">
        <GradientHero />
        <NewsFeed initialCategory={params.category || ''} />
      </div>
      <BottomNav />
      <FloatingDock />
    </main>
  );
}
