import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NewsItem } from '@/lib/types';
import { trackActivity } from '@/services/api';
import { NewsPreviewImage } from './NewsPreviewImage';
import { CometCard } from '@/components/ui/CometCard';

function formatRelativeTime(isoDate: string) {
  const timestamp = new Date(isoDate).getTime();
  if (Number.isNaN(timestamp)) return 'Just now';

  const diffMs = timestamp - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const absMinutes = Math.abs(diffMinutes);
  if (absMinutes < 60) return rtf.format(diffMinutes, 'minute');

  const diffHours = Math.round(diffMinutes / 60);
  const absHours = Math.abs(diffHours);
  if (absHours < 24) return rtf.format(diffHours, 'hour');

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, 'day');

  return new Date(isoDate).toLocaleDateString();
}

export function NewsCard({ item, index, token }: { item: NewsItem; index: number; token?: string | null }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const detailHref = `/news/${item.id}?lang=${encodeURIComponent(lang)}`;
  const summary = item.summary?.trim() || 'Summary unavailable. Open details for key points.';

  const track = (action: 'click' | 'share') => {
    if (!token) return;
    void trackActivity({ newsId: item.id, action }, token).catch(() => {});
  };

  return (
    <CometCard className="h-full p-4 sm:p-5">
      <article>
        <Link href={detailHref} className="mb-3 block h-44 overflow-hidden rounded-xl" onClick={() => track('click')}>
          <NewsPreviewImage src={item.image_url} alt={item.title} category={item.category} />
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-accentSoft px-2.5 py-1 font-semibold text-accent">{item.category}</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">{item.source || 'Unknown source'}</span>
          <span className="ml-auto">{formatRelativeTime(item.created_at)}</span>
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
            Open details
          </Link>
          <a
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('share')}
            className="text-sm font-semibold text-accent"
          >
            Read from source
          </a>
        </div>
      </article>
    </CometCard>
  );
}
