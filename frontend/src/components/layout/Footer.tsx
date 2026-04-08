'use client';

import Link from 'next/link';

const links = {
  Product: [
    { label: 'Home Feed', href: '/' },
    { label: 'Verify News', href: '/submit' },
    { label: 'Profile', href: '/profile' }
  ],
  Categories: [
    { label: 'Trending', href: '/?category=Trending' },
    { label: 'World', href: '/?category=World' },
    { label: 'Election', href: '/?category=Election' },
    { label: 'State News', href: '/?category=State%20News' }
  ],
  Support: [
    { label: 'Sign In', href: '/sign-in' },
    { label: 'Sign Up', href: '/sign-up' }
  ]
};

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200/70 bg-white/70 backdrop-blur-sm dark:border-white/[0.06] dark:bg-[#08080f]/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-lg">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h16" />
                  <path d="M4 12h10" />
                  <path d="M4 18h7" />
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Newsora</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-white/35">
              Regional-first AI news summaries with trustworthy sources, multilingual reading, and community verification.
            </p>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/30">{group}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-white/40 dark:hover:text-indigo-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200/80 dark:border-white/[0.06]" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-[11px] text-slate-500 dark:text-white/25">© {new Date().getFullYear()} Newsora. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[11px] text-slate-500 transition-colors hover:text-slate-700 dark:text-white/25 dark:hover:text-white/50">
              Privacy Policy
            </a>
            <a href="#" className="text-[11px] text-slate-500 transition-colors hover:text-slate-700 dark:text-white/25 dark:hover:text-white/50">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
