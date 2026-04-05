import { useCallback, useEffect, useRef, useState } from 'react';
import { NewsItem } from '@/lib/types';
import { fetchNews, fetchNewsByCategory } from '@/services/api';

export function useInfiniteNews(category?: string) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);

  const isInitialLoad = items.length === 0 && loading;
  const isLoadingRef = useRef(false);
  const latestRequestIdRef = useRef(0);

  const loadMore = useCallback(async (manual = false, requestedPage?: number) => {
    if (isLoadingRef.current || !hasMore) return;
    if (!manual && !autoLoadEnabled) return;

    const nextPage = requestedPage ?? page;
    const requestId = ++latestRequestIdRef.current;

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = category
        ? await fetchNewsByCategory(category, nextPage, 8)
        : await fetchNews(nextPage, 8);

      // Ignore stale responses from previous category/page requests.
      if (requestId !== latestRequestIdRef.current) return;

      setItems((prev) => {
        const merged = nextPage === 1 ? data.items : [...prev, ...data.items];
        setHasMore(merged.length < data.total && data.items.length > 0);
        return merged;
      });

      setPage(nextPage + 1);
    } catch (e) {
      if (requestId !== latestRequestIdRef.current) return;
      setError('Unable to load news feed right now.');
      setAutoLoadEnabled(false);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore, autoLoadEnabled, category]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    latestRequestIdRef.current += 1;
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setAutoLoadEnabled(true);
    loadMore(true, 1);
  }, [category]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '220px' }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  return {
    items,
    loading,
    error,
    hasMore,
    isInitialLoad,
    sentinelRef,
    retry: () => {
      setAutoLoadEnabled(true);
      return loadMore(true, 1);
    }
  };
}
