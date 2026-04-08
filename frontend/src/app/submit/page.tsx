'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { submitNews } from '@/services/api';

const categories = ['Environmental', 'Social', 'Financial', 'Political', 'Campaigning', 'Tech', 'Health'];

export default function SubmitPage() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remaining = useMemo(() => Math.max(0, 40 - content.trim().length), [content]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!isSignedIn) {
      setError('Please sign in to submit news.');
      return;
    }

    if (content.trim().length < 40) {
      setError('Please enter at least 40 characters of content.');
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        setError('Could not verify your session. Please sign in again.');
        return;
      }

      await submitNews(
        {
          content: content.trim(),
          mediaUrl: mediaUrl.trim() || undefined,
          category: category || undefined
        },
        token
      );

      setContent('');
      setMediaUrl('');
      setCategory('');
      setMessage('Submission sent. It is now pending admin approval.');
    } catch (e) {
      setError('Could not submit right now. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 pb-24 md:pb-8">
      <div className="glass-panel rounded-2xl p-5">
        <h1 className="text-2xl font-bold">Submit a Story</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Share what is happening in your area. Your report will be reviewed before publishing.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Story content</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              className="w-full rounded-xl border border-zinc-300 bg-panel px-3 py-2 text-sm outline-none ring-accent/40 focus:ring dark:border-zinc-700"
              placeholder="Describe the story, what happened, where, and when..."
            />
            <span className="mt-1 block text-xs text-zinc-500">{remaining > 0 ? `${remaining} more chars needed` : 'Looks good'}</span>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Media URL (optional)</span>
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              type="url"
              className="w-full rounded-xl border border-zinc-300 bg-panel px-3 py-2 text-sm outline-none ring-accent/40 focus:ring dark:border-zinc-700"
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Category (optional)</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-panel px-3 py-2 text-sm outline-none ring-accent/40 focus:ring dark:border-zinc-700"
            >
              <option value="">Auto-detect with AI</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
          {message && <p className="rounded-xl bg-green-100 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-200">{message}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Submitting...' : 'Submit Story'}
            </button>
            <Link href="/" className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Back to feed
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
