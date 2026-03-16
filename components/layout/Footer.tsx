'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-brand-border bg-brand-card mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold mb-3">
              SOPHEAP<span className="text-brand-gold">.</span><span className="text-brand-gold">AI</span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
              AI Thinking for Cambodia's Future. Weekly insights, strategic depth, and local clarity.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://t.me/+85595666788" target="_blank" rel="noopener noreferrer"
                className="text-brand-muted hover:text-brand-gold transition-colors text-sm font-mono">
                Telegram
              </a>
              <a href="mailto:sopheap.hin@gmail.com"
                className="text-brand-muted hover:text-brand-gold transition-colors text-sm font-mono">
                Email
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-brand-cream font-mono text-xs uppercase tracking-widest mb-4">Navigate</h4>
            <ul className="space-y-2">
              {[
                { href: '/blog', label: t('nav.blog') },
                { href: '/services', label: t('nav.services') },
                { href: '/about', label: t('nav.about') },
                { href: '/contact', label: t('nav.contact') },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-muted hover:text-brand-cream transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Writing */}
          <div>
            <h4 className="text-brand-cream font-mono text-xs uppercase tracking-widest mb-4">Writing</h4>
            <ul className="space-y-2">
              <li><Link href="/blog?category=ai-frontier-brief" className="text-brand-muted hover:text-brand-gold transition-colors text-sm">AI Frontier Brief</Link></li>
              <li><Link href="/blog?category=the-long-view" className="text-brand-muted hover:text-brand-blue transition-colors text-sm">The Long View</Link></li>
              <li><Link href="/blog?category=thought-leadership" className="text-brand-muted hover:text-brand-red transition-colors text-sm">Thought Leadership</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-muted text-xs font-mono">
            © {new Date().getFullYear()} HIN Sopheap. {t('footer.rights')}
          </p>
          <p className="text-brand-muted text-xs font-mono">{t('footer.built')}</p>
        </div>
      </div>
    </footer>
  );
}
