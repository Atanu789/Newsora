'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useInfiniteNews } from '@/hooks/useInfiniteNews';
import { NewsCard } from './NewsCard';
import { SkeletonCard } from './SkeletonCard';

const primaryTabs = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Home', value: '' },
  { label: 'Tech', value: 'Tech' },
  { label: 'World', value: 'Social' },
  { label: 'Business', value: 'Financial' }
];

const moreTabs = [
  { label: 'Social', value: 'Social' },
  { label: 'Environmental', value: 'Environmental' },
  { label: 'Political', value: 'Political' },
  { label: 'Health', value: 'Health' },
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

  const { items, loading, error, isInitialLoad, sentinelRef, retry } = useInfiniteNews({
    category: activeCategory && activeCategory !== 'recommended' ? activeCategory : undefined,
    recommended: activeCategory === 'recommended',
    token,
    lang: activeLanguage
  });

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveLanguage(initialLanguage || 'en');
  }, [initialCategory, initialLanguage]);

  return (
    <section id="feed" className="mt-3 space-y-4">
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {primaryTabs.map((tab) => (
          <button
            key={tab.label}
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
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
            showMore ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
        >
          More
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
          {items.map((item, index) => (
            <div
              key={item.id}
              className="transition duration-300 group-hover/cards:blur-[2px] hover:!blur-0 focus-within:!blur-0"
            >
              <NewsCard item={item} index={index} token={token} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <p>{error} Check your connection and try again.</p>
          <button onClick={retry} className="mt-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-panel p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          No stories found in this category yet. Try another category.
        </div>
      )}

      {loading && !isInitialLoad && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      <div ref={sentinelRef} className="h-6" />
    </section>
  );
}
