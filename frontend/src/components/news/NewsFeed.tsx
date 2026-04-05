'use client';

import { useEffect, useState } from 'react';
import { useInfiniteNews } from '@/hooks/useInfiniteNews';
import { NewsCard } from './NewsCard';
import { SkeletonCard } from './SkeletonCard';

const tabs = [
  { label: 'For You', value: '' },
  { label: 'Tech', value: 'Tech' },
  { label: 'Financial', value: 'Financial' },
  { label: 'Social', value: 'Social' },
  { label: 'Environmental', value: 'Environmental' }
];

export function NewsFeed({ initialCategory = '' }: { initialCategory?: string }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { items, loading, error, isInitialLoad, sentinelRef, retry } = useInfiniteNews(activeCategory || undefined);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  return (
    <section id="feed" className="mt-3 space-y-4">
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveCategory(tab.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === tab.value
                ? 'bg-accent text-white shadow-[0_8px_20px_rgba(255,106,46,0.3)]'
                : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isInitialLoad ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <p>{error}</p>
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
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      <div ref={sentinelRef} className="h-6" />
    </section>
  );
}
