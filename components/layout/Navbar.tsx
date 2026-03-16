'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/lang-context';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/blog', label: t('nav.blog') },
    { href: '/services', label: t('nav.services') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-brand-bg/95 backdrop-blur-md border-b border-brand-border' : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="font-display text-xl font-bold text-brand-cream tracking-tight">
            SOPHEAP
            <span className="text-brand-gold">.</span>
            <span className="text-brand-gold">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-brand-muted hover:text-brand-cream transition-colors font-mono tracking-wide"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-brand-border rounded-lg overflow-hidden">
            <button
              onClick={() => setLang('en')}
              className={cn(
                'px-3 py-1.5 text-xs font-mono transition-colors',
                lang === 'en' ? 'bg-brand-gold text-brand-bg' : 'text-brand-muted hover:text-brand-cream'
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLang('kh')}
              className={cn(
                'px-3 py-1.5 text-xs font-mono transition-colors',
                lang === 'kh' ? 'bg-brand-gold text-brand-bg' : 'text-brand-muted hover:text-brand-cream'
              )}
            >
              ខ្មែរ
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link href="/admin" className="text-brand-muted hover:text-brand-gold transition-colors">
                  <Settings size={16} />
                </Link>
              )}
              <Link href="/profile" className="text-brand-muted hover:text-brand-cream transition-colors">
                <User size={16} />
              </Link>
              <button onClick={logout} className="text-brand-muted hover:text-brand-red transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-ghost py-2 px-4 text-sm">
              {t('nav.login')}
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-brand-cream"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-card border-t border-brand-border px-6 py-6 space-y-4">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-brand-muted hover:text-brand-cream font-mono text-sm py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setLang('en')}
              className={cn('px-3 py-1 text-xs font-mono rounded', lang === 'en' ? 'bg-brand-gold text-brand-bg' : 'text-brand-muted border border-brand-border')}
            >
              EN
            </button>
            <button
              onClick={() => setLang('kh')}
              className={cn('px-3 py-1 text-xs font-mono rounded', lang === 'kh' ? 'bg-brand-gold text-brand-bg' : 'text-brand-muted border border-brand-border')}
            >
              ខ្មែរ
            </button>
          </div>
          {!user && (
            <Link href="/auth/login" className="btn-ghost w-full text-center justify-center text-sm mt-2 block">
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
