import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export function ScriptumLanding() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10">
      <section className="glass-panel w-full rounded-3xl p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Newsora</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">The internet is loud. Newsora gives you signal.</h1>
        <p className="mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
          Read concise AI summaries, track what matters to you, and discover stories from citizens in your community.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <SignUpButton mode="modal">
            <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">Get started</button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="rounded-full border border-zinc-300 bg-panel px-5 py-2.5 text-sm font-semibold dark:border-zinc-700">
              Sign in
            </button>
          </SignInButton>
          <Link href="/" className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Explore public feed
          </Link>
        </div>
      </section>
    </main>
  );
}
