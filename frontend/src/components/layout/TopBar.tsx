'use client';

import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { defaultLanguageCode, languageOptions } from '@/lib/languages';
import { t } from '@/lib/i18n';

const navItems = [
  { key: 'nav.trending' as const, href: '/?category=Trending', category: 'Trending' },
  { key: 'nav.world' as const, href: '/?category=World', category: 'World' },
  { key: 'nav.election' as const, href: '/?category=Election', category: 'Election' },
  { key: 'nav.state' as const, href: '/?category=State%20News', category: 'State News' }
];

const moreItems = [
  { key: 'nav.sports' as const, href: '/?category=Sports', category: 'Sports' },
  { key: 'nav.tech' as const, href: '/?category=Tech', category: 'Tech' },
  { key: 'nav.business' as const, href: '/?category=Financial', category: 'Financial' },
  { key: 'nav.health' as const, href: '/?category=Health', category: 'Health' },
  { key: 'nav.entertainment' as const, href: '/?category=Entertainment', category: 'Entertainment' }
];

export function TopBar() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([defaultLanguageCode]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get('category');

  const activeLanguage = searchParams.get('lang') || selectedLanguages[0] || defaultLanguageCode;

  useEffect(() => {
    const saved = window.localStorage.getItem('newsora-theme');
    const shouldBeDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem('newsora-languages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.filter((code) => languageOptions.some((option) => option.code === code));
          if (sanitized.length > 0) {
            setSelectedLanguages(sanitized);
          }
        }
      } catch (error) {
        setSelectedLanguages([defaultLanguageCode]);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    const darkEnabled = root.classList.contains('dark');
    setIsDark(darkEnabled);
    window.localStorage.setItem('newsora-theme', darkEnabled ? 'dark' : 'light');
  };

  const toggleLanguage = (languageCode: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(languageCode)) {
        if (prev.length === 1) return prev;
        return prev.filter((code) => code !== languageCode);
      }
      return [...prev, languageCode];
    });
  };

  const applyLanguages = () => {
    const finalSelection = selectedLanguages.length > 0 ? selectedLanguages : [defaultLanguageCode];
    window.localStorage.setItem('newsora-languages', JSON.stringify(finalSelection));

    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', finalSelection[0]);
    router.push(`${pathname}?${params.toString()}`);
    setLanguageModalOpen(false);
  };

  const withLang = (href: string) => {
    const [base, query = ''] = href.split('?');
    const params = new URLSearchParams(query);
    params.set('lang', activeLanguage);
    return `${base}?${params.toString()}`;
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-zinc-200/70 bg-panel/75 px-4 backdrop-blur-xl dark:border-zinc-800">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="inline-block shrink-0">
          <h2 className="text-base font-bold tracking-wide text-accent">Newsora</h2>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-zinc-200/80 bg-panel/80 p-1 md:flex dark:border-zinc-700/80">
          {navItems.map((item) => {
            const itemUrl = new URL(item.href, 'http://localhost');
            const itemCategory = itemUrl.searchParams.get('category');
            const active =
              pathname === itemUrl.pathname &&
              itemCategory === activeCategory;

            return (
              <Link
                key={item.key}
                href={withLang(item.href)}
                className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? 'text-accent' : 'text-zinc-700 hover:text-accent dark:text-zinc-200'
                }`}
              >
                {t(activeLanguage, item.key)}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-200 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                moreMenuOpen ? 'text-accent' : 'text-zinc-700 hover:text-accent dark:text-zinc-200'
              }`}
            >
              {t(activeLanguage, 'nav.more')}
              <span
                className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-200 ${
                  moreMenuOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {moreMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-zinc-200/80 bg-panel/95 backdrop-blur-xl shadow-lg dark:border-zinc-700/80 z-50">
                {moreItems.map((item) => {
                  const itemUrl = new URL(item.href, 'http://localhost');
                  const itemCategory = itemUrl.searchParams.get('category');
                  const active =
                    pathname === itemUrl.pathname &&
                    itemCategory === activeCategory;

                  return (
                    <Link
                      key={item.key}
                      href={withLang(item.href)}
                      onClick={() => setMoreMenuOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        active
                          ? 'bg-accentSoft text-accent'
                          : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {t(activeLanguage, item.key)}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguageModalOpen(true)}
            className="rounded-full border border-zinc-300 bg-panel px-3 py-1 text-sm dark:border-zinc-700"
          >
            {activeLanguage.toUpperCase()}
          </button>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hidden rounded-full border border-zinc-300 bg-panel px-3 py-1 text-sm dark:border-zinc-700 sm:inline-flex">
                {t(activeLanguage, 'auth.signIn')}
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="hidden rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,106,46,0.35)] sm:inline-flex">
                {t(activeLanguage, 'auth.join')}
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button
            onClick={toggleDarkMode}
            className="rounded-full border border-zinc-300 bg-panel px-3 py-1 text-sm dark:border-zinc-700"
          >
            {isDark ? t(activeLanguage, 'theme.light') : t(activeLanguage, 'theme.dark')}
          </button>
        </div>
      </div>
      </header>

      {languageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setLanguageModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-panel p-4 dark:border-zinc-800" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-semibold">{t(activeLanguage, 'lang.selectTitle')}</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {languageOptions.map((language) => {
                const active = selectedLanguages.includes(language.code);
                return (
                  <button
                    key={language.code}
                    onClick={() => toggleLanguage(language.code)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${
                      active ? 'border-accent bg-accentSoft text-accent' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {language.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setLanguageModalOpen(false)}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
              >
                {t(activeLanguage, 'common.cancel')}
              </button>
              <button onClick={applyLanguages} className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white">
                {t(activeLanguage, 'common.apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
