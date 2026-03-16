'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard, FileText, Inbox, Users, Bot,
  Newspaper, Key, LogOut, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/posts', icon: FileText, label: 'Posts' },
  { href: '/admin/inquiries', icon: Inbox, label: 'Inquiries' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/assistant', icon: Bot, label: 'AI Assistant' },
  { href: '/admin/ai-news', icon: Newspaper, label: 'AI News Feed' },
  { href: '/admin/subscribers', icon: Key, label: 'Subscribers' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-brand-muted font-mono text-sm">Verifying access...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-brand-card border-r border-brand-border flex flex-col">
        <div className="px-6 py-5 border-b border-brand-border">
          <Link href="/" className="font-display text-lg font-bold">
            SOPHEAP<span className="text-brand-gold">.</span><span className="text-brand-gold">AI</span>
          </Link>
          <p className="text-brand-muted text-xs font-mono mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(n => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                    : 'text-brand-muted hover:text-brand-cream hover:bg-brand-border/50'
                )}
              >
                <n.icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-brand-border space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:text-brand-cream text-sm transition-colors rounded-lg">
            <ExternalLink size={14} /> View Site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:text-brand-red text-sm transition-colors rounded-lg w-full">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
