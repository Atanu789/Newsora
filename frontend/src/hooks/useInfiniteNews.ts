import { useCallback, useEffect, useRef, useState } from 'react';
import { NewsItem } from '@/lib/types';
import { fetchNews, fetchNewsByCategory, fetchRecommendedNews } from '@/services/api';

export function useInfiniteNews(params?: { category?: string; recommended?: boolean; token?: string | null; lang?: string }) {
  const category = params?.category;
  const recommended = Boolean(params?.recommended);
  const token = params?.token;
  const lang = params?.lang || 'en';
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
      const data = recommended
        ? token
          ? await fetchRecommendedNews(token, nextPage, 8, lang)
          : (() => {
              throw new Error('Sign in required');
            })()
        : category
          ? await fetchNewsByCategory(category, nextPage, 8, lang)
          : await fetchNews(nextPage, 8, lang);

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
      if (recommended && !token) {
        setError('Sign in to unlock your recommended feed.');
      } else {
        setError('Unable to load news feed right now.');
      }
      setAutoLoadEnabled(false);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore, autoLoadEnabled, category, recommended, token, lang]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    latestRequestIdRef.current += 1;
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setAutoLoadEnabled(true);
    loadMore(true, 1);
  }, [category, recommended, token, lang]);

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
