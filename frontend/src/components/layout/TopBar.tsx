'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Feed', href: '/' },
  { label: 'Profile', href: '/profile' },
  { label: 'Tech', href: '/?category=Tech' },
  { label: 'Finance', href: '/?category=Financial' }
];

export function TopBar() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = window.localStorage.getItem('newsora-theme');
    const shouldBeDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    const darkEnabled = root.classList.contains('dark');
    setIsDark(darkEnabled);
    window.localStorage.setItem('newsora-theme', darkEnabled ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-panel/75 px-4 py-3 backdrop-blur-xl dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="inline-block shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Newsora</p>
          <h2 className="text-lg font-bold">Signal Feed</h2>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-zinc-200/80 bg-panel/80 p-1 md:flex dark:border-zinc-700/80">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href === '/' && pathname === '/');

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? 'text-accent' : 'text-zinc-700 hover:text-accent dark:text-zinc-200'
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-200 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="rounded-full border border-zinc-300 bg-panel px-3 py-1 text-sm dark:border-zinc-700"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
}
