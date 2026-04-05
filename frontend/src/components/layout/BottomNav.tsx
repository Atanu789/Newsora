'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Feed', href: '/' },
  { label: 'Tech', href: '/?category=Tech' },
  { label: 'Finance', href: '/?category=Financial' },
  { label: 'Profile', href: '/profile' }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-panel/95 px-2 py-2 backdrop-blur-xl dark:border-zinc-800 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-2 text-center text-xs font-medium">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`rounded-xl py-2 ${
              pathname === item.href || (item.href === '/' && pathname === '/')
                ? 'bg-accent text-white'
                : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
