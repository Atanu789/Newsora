import { auth } from '@clerk/nextjs/server';
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
    </main>
  );
}
