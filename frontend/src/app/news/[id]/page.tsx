import Link from 'next/link';
import { notFound } from 'next/navigation';

import { NewsDetail } from '@/lib/types';
import { NewsPreviewImage } from '@/components/news/NewsPreviewImage';
import { t } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

async function getNewsDetail(id: string, lang: string): Promise<NewsDetail | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  const response = await fetch(`${baseUrl}/news/${id}?lang=${encodeURIComponent(lang)}`, {
    cache: 'no-store'
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to load news detail');

  return response.json();
}

export default async function NewsDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const lang = query.lang || 'en';
  const article = await getNewsDetail(id, lang);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6">
      <Link href={`/?lang=${encodeURIComponent(lang)}`} className="text-sm font-semibold text-accent">
        {t(lang, 'detail.backToFeed')}
      </Link>

      <article className="glass-panel mt-4 rounded-2xl p-5">
        <div className="mb-4 h-52 overflow-hidden rounded-xl sm:h-72">
          <NewsPreviewImage src={article.image_url} alt={article.title} category={article.category} priority />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-accentSoft px-3 py-1 font-semibold text-accent">{article.category}</span>
          <span>{new Date(article.created_at).toLocaleString()}</span>
        </div>

        <h1 className="text-2xl font-bold leading-tight">{article.title}</h1>

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{t(lang, 'detail.aiSummary')}</h2>
          <p className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-200">{article.summary}</p>
        </section>

        {article.tags?.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{t(lang, 'detail.tags')}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <a
          href={article.source_url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          {t(lang, 'detail.readOriginal')}
        </a>
      </article>
    </main>
  );
}
