import Link from 'next/link';
import { NewsItem } from '@/lib/types';

export function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <article
      className="animate-rise rounded-2xl border border-orange-200/70 bg-panel p-4 shadow-[0_12px_32px_rgba(0,0,0,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(0,0,0,0.12)] dark:border-zinc-800"
      style={{ animationDelay: `${Math.min(index * 40, 240)}ms` }}
    >
      <div className="mb-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="rounded-full bg-accentSoft px-2 py-1 font-semibold text-accent">{item.category}</span>
        <span>{new Date(item.created_at).toLocaleDateString()}</span>
      </div>

      <Link href={`/news/${item.id}`} className="block">
        <h3 className="text-base font-semibold leading-snug md:text-lg hover:text-accent">{item.title}</h3>
      </Link>
      <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">{item.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <Link href={`/news/${item.id}`} className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Open details
        </Link>
        <a
          href={item.source_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-accent"
        >
          Read from source
        </a>
      </div>
    </article>
  );
}
