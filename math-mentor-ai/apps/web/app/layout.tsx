import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'MathMentor AI',
  description: 'AI-powered math tutor',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/mascot.svg" alt="MathMentor" className="h-9 w-9" />
              <span className="font-semibold text-primary-600">MathMentor AI</span>
            </div>
            <nav className="text-sm flex gap-3 items-center">
              <a href="/dashboard" className="hover:text-primary-600">Dashboard</a>
              <a href="/practice" className="hover:text-primary-600">Practice</a>
              <a href="/learn" className="hover:text-primary-600">Learn</a>
              <a href="/progress" className="hover:text-primary-600">Progress</a>
              <a href="/parent" className="hover:text-primary-600">Parent</a>
              <a href="/subscription" className="hover:text-primary-600">Subscription</a>
              <a href="/api/auth/login" className="ml-3 rounded border border-primary-500 px-2 py-1 text-primary-600">Log in</a>
              <a href="/api/auth/logout" className="rounded bg-primary-500 px-2 py-1 text-white">Log out</a>
            </nav>
          </header>
          <main className="py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}