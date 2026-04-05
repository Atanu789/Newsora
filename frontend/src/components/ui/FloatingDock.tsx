'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const dockItems = [
  { label: 'Feed', href: '/', icon: 'N' },
  { label: 'Profile', href: '/profile', icon: 'P' },
  { label: 'Tech', href: '/?category=Tech', icon: 'T' },
  { label: 'Finance', href: '/?category=Financial', icon: 'F' }
];

export function FloatingDock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get('category');

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 hidden justify-center md:flex">
      <nav className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-orange-200/70 bg-panel/80 p-2 shadow-[0_20px_42px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:border-zinc-700">
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
              className={`group rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-accent text-white shadow-[0_10px_20px_rgba(255,106,46,0.34)]'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
