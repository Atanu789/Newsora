import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Signed in as Clerk user: {userId}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/submit" className="rounded-2xl border border-zinc-200 bg-panel p-4 text-sm font-semibold dark:border-zinc-800">
          Submit a Story
          <p className="mt-1 text-xs font-normal text-zinc-600 dark:text-zinc-300">Share citizen reports for moderation.</p>
        </Link>
        <Link
          href="/admin/submissions"
          className="rounded-2xl border border-zinc-200 bg-panel p-4 text-sm font-semibold dark:border-zinc-800"
        >
          Admin Dashboard
          <p className="mt-1 text-xs font-normal text-zinc-600 dark:text-zinc-300">Review and approve pending submissions.</p>
        </Link>
      </div>
    </main>
  );
}
