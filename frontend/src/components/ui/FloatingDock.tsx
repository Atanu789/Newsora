'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const dockItems = [
  { label: 'Feed', href: '/', icon: 'home' },
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'Tech', href: '/?category=Tech', icon: 'bolt' },
  { label: 'Finance', href: '/?category=Financial', icon: 'chart' }
];

function DockIcon({ type }: { type: string }) {
  if (type === 'home') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M6.5 9.5V20h11V9.5" />
      </svg>
    );
  }

  if (type === 'user') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.4" />
        <path d="M4.5 20c1.2-3.6 4-5.2 7.5-5.2s6.3 1.6 7.5 5.2" />
      </svg>
    );
  }

  if (type === 'bolt') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13.5 2L5 13h6l-1 9 9-12h-6l.5-8z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-3" />
    </svg>
  );
}

export function FloatingDock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get('category');

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 hidden justify-center md:flex">
      <nav className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-orange-200/70 bg-panel/70 px-3 py-2 shadow-[0_20px_42px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:border-zinc-700/80">
        {dockItems.map((item) => {
          const active =
            (item.href === '/' && pathname === '/' && !category) ||
            (item.href.includes('category=Tech') && category === 'Tech') ||
            (item.href.includes('category=Financial') && category === 'Financial') ||
            (item.href === '/profile' && pathname === '/profile');

          return (
            <Link
              key={item.label}
              href={item.href}
              className="group relative flex flex-col items-center"
              aria-label={item.label}
            >
              <span className="pointer-events-none absolute -top-8 rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                {item.label}
              </span>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm transition duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-125 ${
                  active
                    ? 'border-accent bg-accent text-white shadow-[0_10px_24px_rgba(255,106,46,0.35)]'
                    : 'border-zinc-200 bg-panel-muted text-zinc-700 group-hover:border-accent group-hover:text-accent dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                }`}
              >
                <DockIcon type={item.icon} />
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
