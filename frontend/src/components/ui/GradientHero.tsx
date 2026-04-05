export function GradientHero() {
  return (
    <section className="glass-panel animate-rise rounded-3xl p-5 md:p-6">
      <div className="mb-2 inline-flex items-center rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
        Newsora AI Digest
      </div>
      <h1 className="text-2xl font-bold leading-tight md:text-3xl">
        The internet is loud. Newsora gives you signal.
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Browse fast summaries, tap into categories, and open the original source when you want full context.
      </p>
      <div className="mt-4 flex gap-2">
        <a href="#feed" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white animate-pulseGlow">
          Explore Feed
        </a>
        <a
          href="/profile"
          className="rounded-full border border-zinc-300 bg-panel px-4 py-2 text-sm font-semibold dark:border-zinc-700"
        >
          Personalize
        </a>
      </div>
    </section>
  );
}
