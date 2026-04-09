'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useInfiniteNews } from '@/hooks/useInfiniteNews';
import { NewsCard } from './NewsCard';
import { SkeletonCard } from './SkeletonCard';
import { t } from '@/lib/i18n';

const primaryTabs = [
  { key: 'feed.recommended' as const, value: 'recommended' },
  { key: 'feed.home' as const, value: '' },
  { key: 'nav.tech' as const, value: 'Tech' },
  { key: 'nav.world' as const, value: 'World' },
  { key: 'feed.business' as const, value: 'Financial' }
];

const moreTabs = [
  { label: 'World', value: 'World' },
  { label: 'Environmental', value: 'Environmental' },
  { label: 'Election', value: 'Election' },
  { label: 'Health', value: 'Health' },
  { label: 'Sports', value: 'Sports' },
  { label: 'State News', value: 'State News' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Campaigning', value: 'Campaigning' }
];

export function NewsFeed({
  initialCategory = '',
  initialLanguage = 'en'
}: {
  initialCategory?: string;
  initialLanguage?: string;
}) {
  const { getToken } = useAuth();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [token, setToken] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState(initialLanguage || 'en');
  const [showMore, setShowMore] = useState(false);
  const [backgroundRetryCount, setBackgroundRetryCount] = useState(0);
  const [hiddenNewsIds, setHiddenNewsIds] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;
    getToken()
      .then((value) => {
        if (mounted) {
          setToken(value || null);
        }
      })
      .catch(() => {
        if (mounted) {
          setToken(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [getToken]);

  const { items, loading, error, hasMore, autoLoadStopped, isInitialLoad, sentinelRef, retry, loadMore } = useInfiniteNews({
    category: activeCategory && activeCategory !== 'recommended' ? activeCategory : undefined,
    recommended: activeCategory === 'recommended',
    token,
    lang: activeLanguage
  });

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveLanguage(initialLanguage || 'en');
    setHiddenNewsIds([]);
  }, [initialCategory, initialLanguage]);

  const visibleItems = items.filter((item) => !hiddenNewsIds.includes(item.id));

  useEffect(() => {
    if (!error) {
      setBackgroundRetryCount(0);
      return;
    }

    // Retry transient feed failures in the background instead of requiring manual clicks.
    const shouldRetry = !error.toLowerCase().includes('sign in');
    if (!shouldRetry || backgroundRetryCount >= 3) {
      return;
    }

    const delay = 1200 * (backgroundRetryCount + 1);
    const timer = window.setTimeout(() => {
      setBackgroundRetryCount((count) => count + 1);
      retry();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [error, retry, backgroundRetryCount]);

  return (
    <section id="feed" className="mt-3 space-y-4">
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {primaryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveCategory(tab.value);
              setShowMore(false);
            }}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === tab.value
                ? 'bg-accent text-white shadow-[0_8px_20px_rgba(255,106,46,0.3)]'
                : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
            {t(activeLanguage, tab.key)}
          </button>
        ))}
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
            showMore ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
        >
          {t(activeLanguage, 'feed.more')}
        </button>
      </div>

      {showMore && (
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-zinc-200 bg-panel p-3 dark:border-zinc-800 sm:grid-cols-3">
          {moreTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setActiveCategory(tab.value);
                setShowMore(false);
              }}
              className={`rounded-xl px-3 py-2 text-left text-sm font-medium ${
                activeCategory === tab.value ? 'bg-accent text-white' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {isInitialLoad ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="group/cards grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              className="transition duration-300 group-hover/cards:blur-[2px] hover:!blur-0 focus-within:!blur-0"
            >
              <NewsCard
                item={item}
                index={index}
                token={token}
                onHide={(id) => setHiddenNewsIds((prev) => (prev.includes(id) ? prev : [...prev, id]))}
              />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <p>
            {error} {t(activeLanguage, 'feed.error')}
          </p>
          {!error.toLowerCase().includes('sign in') && backgroundRetryCount < 3 && (
            <p className="mt-1 text-xs opacity-80">Retrying in background...</p>
          )}
        </div>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-panel p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          {t(activeLanguage, 'feed.empty')}
        </div>
      )}

      {loading && !isInitialLoad && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {autoLoadStopped && hasMore && !loading && (
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={loadMore}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,106,46,0.3)]"
          >
            Load more stories
          </button>
        </div>
      )}

      {!autoLoadStopped && <div ref={sentinelRef} className="h-6" />}
    </section>
  );
}
