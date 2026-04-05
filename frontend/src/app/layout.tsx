import type { Metadata } from 'next';
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Newsora',
  description: 'AI-powered smart news feed'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header className="mx-auto flex w-full max-w-3xl items-center justify-end gap-2 px-4 pt-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-full border border-zinc-300 bg-panel px-3 py-1 text-sm dark:border-zinc-700">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,106,46,0.35)]">
                  Join Newsora
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
