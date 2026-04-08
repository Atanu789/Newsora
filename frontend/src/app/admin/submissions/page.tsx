'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { approveSubmission, fetchPendingSubmissions, rejectSubmission } from '@/services/api';

type Submission = {
  id: number;
  user_id: number | null;
  content: string;
  media_url: string | null;
  status: string;
  category: string | null;
  moderation_notes: string | null;
  created_at: string;
};

export default function AdminSubmissionsPage() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError('Sign in required to view admin dashboard.');
        return;
      }
      const data = await fetchPendingSubmissions(token);
      setItems(data);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        setError('Access denied. You are not an admin.');
      } else if (e?.response?.status === 401) {
        setError('Session invalid. Please sign in again.');
      } else {
        setError('Could not load submissions right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const pendingCount = useMemo(() => items.length, [items]);

  const decide = async (id: number, action: 'approve' | 'reject') => {
    setBusyId(id);
    try {
      const token = await getToken();
      if (!token) {
        setError('Session invalid. Please sign in again.');
        return;
      }

      if (action === 'approve') {
        await approveSubmission(id, token);
      } else {
        await rejectSubmission(id, token);
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(`Could not ${action} submission. Please retry.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-6 pb-24 md:pb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Moderation</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Pending submissions: {pendingCount}</p>
        </div>
        <Link href="/" className="text-sm font-semibold text-accent">
          Back to feed
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border border-zinc-200 bg-panel p-5 text-sm dark:border-zinc-800">Loading submissions...</div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <p>{error}</p>
          <button onClick={load} className="mt-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-panel p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          No pending submissions right now.
        </div>
      )}

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-zinc-200 bg-panel p-4 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="rounded-full bg-accentSoft px-2 py-1 text-accent">#{item.id}</span>
              <span>{new Date(item.created_at).toLocaleString()}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{item.category || 'Uncategorized'}</span>
            </div>
            <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">{item.content}</p>
            {item.media_url && (
              <a href={item.media_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-accent">
                Open media
              </a>
            )}
            <div className="mt-4 flex gap-2">
              <button
                disabled={busyId === item.id}
                onClick={() => decide(item.id, 'approve')}
                className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-70"
              >
                Approve
              </button>
              <button
                disabled={busyId === item.id}
                onClick={() => decide(item.id, 'reject')}
                className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-70"
              >
                Reject
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
