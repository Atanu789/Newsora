'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const items = [
  { label: 'Feed', href: '/' },
  { label: 'Tech', href: '/?category=Tech' },
  { label: 'Finance', href: '/?category=Financial' },
  { label: 'World', href: '/?category=Social' },
  { label: 'Profile', href: '/profile' }
];

export function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const lang = searchParams.get('lang') || 'en';

  const withLang = (href: string) => {
    const [base, query = ''] = href.split('?');
    const params = new URLSearchParams(query);
    params.set('lang', lang);
    return `${base}?${params.toString()}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 border-t border-zinc-200 bg-panel/95 px-2 py-2 backdrop-blur-xl dark:border-zinc-800 md:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-5 gap-2 text-center text-[11px] font-medium">
        {items.map((item) => (
          <Link
            key={item.label}
            href={withLang(item.href)}
            className={`flex items-center justify-center rounded-xl px-2 ${
              (item.href === '/' && pathname === '/' && !category) ||
              (item.href.includes('category=Tech') && pathname === '/' && category === 'Tech') ||
              (item.href.includes('category=Financial') && pathname === '/' && category === 'Financial') ||
              (item.href === '/profile' && pathname === '/profile')
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
