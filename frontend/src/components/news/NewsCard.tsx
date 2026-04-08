import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NewsItem } from '@/lib/types';
import { trackActivity } from '@/services/api';
import { NewsPreviewImage } from './NewsPreviewImage';
import { CometCard } from '@/components/ui/CometCard';
import { langToLocale, t } from '@/lib/i18n';

function formatRelativeTime(isoDate: string, lang: string) {
  const timestamp = new Date(isoDate).getTime();
  if (Number.isNaN(timestamp)) return 'Just now';

  const diffMs = timestamp - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  const rtf = new Intl.RelativeTimeFormat(langToLocale(lang), { numeric: 'auto' });

  const absMinutes = Math.abs(diffMinutes);
  if (absMinutes < 60) return rtf.format(diffMinutes, 'minute');

  const diffHours = Math.round(diffMinutes / 60);
  const absHours = Math.abs(diffHours);
  if (absHours < 24) return rtf.format(diffHours, 'hour');

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, 'day');

  return new Date(isoDate).toLocaleDateString(langToLocale(lang));
}

export function NewsCard({
  item,
  index,
  token,
  onHide
}: {
  item: NewsItem;
  index: number;
  token?: string | null;
  onHide?: (id: number) => void;
}) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const detailHref = `/news/${item.id}?lang=${encodeURIComponent(lang)}`;
  const summary = item.summary?.trim() || t(lang, 'card.summaryFallback');

  const track = (action: 'click' | 'share' | 'save' | 'hide' | 'view') => {
    if (!token) return;
    void trackActivity({ newsId: item.id, action }, token).catch(() => {});
  };

  const shareArticle = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin + detailHref : item.source_url;
    const payload = {
      title: item.title,
      text: summary,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      track('share');
    } catch {
      // Ignore cancelled share flow.
    }
  };

  const getYoutubeUrl = () => {
    const source = item.source_url || '';
    if (source.includes('youtube.com/watch') || source.includes('youtu.be/')) {
      return source;
    }

    const query = `${item.title} ${item.source || ''} news`.trim();
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
  };

  return (
    <CometCard className="h-full p-4 sm:p-5">
      <article>
        <Link href={detailHref} className="mb-3 block h-44 overflow-hidden rounded-xl" onClick={() => track('click')}>
          <NewsPreviewImage src={item.image_url} alt={item.title} category={item.category} />
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-accentSoft px-2.5 py-1 font-semibold text-accent">{item.category}</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">{item.source || t(lang, 'card.unknownSource')}</span>
          <span className="ml-auto">{formatRelativeTime(item.created_at, lang)}</span>
        </div>

        <Link href={detailHref} className="block" onClick={() => track('click')}>
          <h3 className="text-base font-semibold leading-snug md:text-lg">{item.title}</h3>
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags?.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-4 border-t border-zinc-200/80 pt-3 dark:border-zinc-700/90">
          <Link href={detailHref} className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t(lang, 'card.openDetails')}
          </Link>
          <a
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('view')}
            className="text-sm font-semibold text-accent"
          >
            {t(lang, 'card.readSource')}
          </a>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          <button
            onClick={() => track('save')}
            aria-label="Interested"
            title="Interested"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-6.5-4.35-9-8.22C1 9.4 3.1 6 6.77 6c2.12 0 3.3.97 4.23 2.2C11.93 6.97 13.1 6 15.23 6 18.9 6 21 9.4 21 12.78 18.5 16.65 12 21 12 21z" />
            </svg>
            <span className="sr-only">Interested</span>
          </button>

          <button
            onClick={() => {
              track('hide');
              onHide?.(item.id);
            }}
            aria-label="Not interested"
            title="Not interested"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="8" />
              <path d="M8 8l8 8" />
            </svg>
            <span className="sr-only">Not interested</span>
          </button>

          <button
            onClick={shareArticle}
            aria-label="Share"
            title="Share"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="6" cy="12" r="2" />
              <circle cx="18" cy="6" r="2" />
              <circle cx="18" cy="18" r="2" />
              <path d="M8 11l8-4" />
              <path d="M8 13l8 4" />
            </svg>
            <span className="sr-only">Share</span>
          </button>

          <a
            href={getYoutubeUrl()}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('view')}
            aria-label="Open related YouTube video"
            title="Open related YouTube video"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="7" width="18" height="10" rx="3" />
              <path d="M10 10l5 2-5 2v-4z" fill="currentColor" stroke="none" />
            </svg>
            <span className="sr-only">YouTube</span>
          </a>
        </div>
      </article>
    </CometCard>
  );
}
