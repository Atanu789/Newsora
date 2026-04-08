'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue
} from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DockItem {
  title: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

function DockIcon({
  item,
  mouseX,
  magnify
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  magnify: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    if (!ref.current || !magnify) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-120, 0, 120], [40, 64, 40]);
  const heightTransform = useTransform(distance, [-120, 0, 120], [40, 64, 40]);
  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 180, damping: 16 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 180, damping: 16 });

  const yTransform = useTransform(distance, [-120, 0, 120], [0, -10, 0]);
  const y = useSpring(yTransform, { mass: 0.1, stiffness: 180, damping: 16 });

  const iconSize = magnify ? undefined : 42;
  const iconLift = magnify ? y : 0;

  const inner = (
    <motion.div
      ref={ref}
      style={{ width: iconSize ?? width, height: iconSize ?? height, y: iconLift }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex cursor-pointer items-center justify-center rounded-xl transition-colors',
        'bg-slate-100/90 border border-slate-200 shadow-sm hover:bg-slate-200',
        item.active && 'bg-indigo-50 border-indigo-300',
        'dark:bg-slate-800/80 dark:border-slate-700/80 dark:hover:bg-slate-700/90',
        item.active && 'dark:bg-indigo-500/20 dark:border-indigo-400/45'
      )}
    >
      {item.active && <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-indigo-500 dark:bg-indigo-300" />}

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-white pointer-events-none backdrop-blur-sm dark:bg-black/80"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-5 w-5 text-slate-700 dark:text-slate-100">{item.icon}</div>
    </motion.div>
  );

  if (item.href) {
    return (
      <Link href={item.href} onClick={item.onClick}>
        {inner}
      </Link>
    );
  }

  return <div onClick={item.onClick}>{inner}</div>;
}

export function FloatingDock({ items }: { items?: DockItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [magnify, setMagnify] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
    const sync = () => setMagnify(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const mouseX = useMotionValue(Infinity);

  const withLang = (href: string) => {
    const lang = searchParams.get('lang');
    const [base, query = ''] = href.split('?');
    const params = new URLSearchParams(query);
    if (lang) {
      params.set('lang', lang);
    }
    const q = params.toString();
    return q ? `${base}?${q}` : base;
  };

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    const darkEnabled = root.classList.contains('dark');
    window.localStorage.setItem('newsora-theme', darkEnabled ? 'dark' : 'light');
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push(withLang('/'));
  };

  const defaultItems: DockItem[] = [
    {
      title: 'Home',
      onClick: handleHomeClick,
      active: pathname === '/' && !searchParams.get('category'),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M6.5 9.5V20h11V9.5" />
        </svg>
      )
    },
    {
      title: 'Theme',
      onClick: toggleDarkMode,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )
    },
    {
      title: 'Verify',
      href: withLang('/submit'),
      active: pathname === '/submit',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L15.09 8.26H22L17.55 12.79L19.64 19.04L12 14.71L4.36 19.04L6.45 12.79L2 8.26H8.91L12 2Z" />
        </svg>
      )
    },
    {
      title: 'Profile',
      href: withLang('/profile'),
      active: pathname === '/profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="3.4" />
          <path d="M4.5 20c1.2-3.6 4-5.2 7.5-5.2s6.3 1.6 7.5 5.2" />
        </svg>
      )
    }
  ];

  const renderItems = items && items.length > 0 ? items : defaultItems;

  return (
    <motion.nav
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2',
        'hidden md:flex items-end gap-1.5 rounded-2xl px-3 py-2 md:gap-2 md:px-4 md:py-3',
        'bg-white/88 border border-slate-200/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,8,23,0.15)]',
        'dark:bg-slate-950/68 dark:border-slate-800/85 dark:shadow-[0_10px_34px_rgba(2,8,23,0.55)]'
      )}
    >
      {renderItems.map((item) => (
        <DockIcon key={item.title} item={item} mouseX={mouseX} magnify={magnify} />
      ))}
    </motion.nav>
  );
}
