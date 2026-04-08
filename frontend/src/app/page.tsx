import { auth } from '@clerk/nextjs/server';
import { BottomNav } from '@/components/layout/BottomNav';
import { TopBar } from '@/components/layout/TopBar';
import { ScriptumLanding } from '../components/landing/ScriptumLanding';
import { NewsFeed } from '@/components/news/NewsFeed';
import { FloatingDock } from '@/components/ui/FloatingDock';
import { GradientHero } from '@/components/ui/GradientHero';

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; lang?: string }>;
}) {
  const { userId } = await auth();
  const params = await searchParams;

  if (!userId) {
    return <ScriptumLanding />;
  }

  return (
    <main className="min-h-screen pb-20 md:pb-8">
      <TopBar />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-6 xl:px-8">
        <GradientHero />
        <NewsFeed initialCategory={params.category || ''} initialLanguage={params.lang || 'en'} />
      </div>
      <BottomNav />
      <FloatingDock />
    </main>
  );
}
