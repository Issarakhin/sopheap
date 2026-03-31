'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mergeSiteContent, type SiteContent } from '@/lib/site-content';

export default function Footer() {
  const [sc, setSc] = useState<SiteContent>(mergeSiteContent(null));

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => setSc(mergeSiteContent(data)))
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-brand-border bg-brand-card mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">

          {/* Brand col */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold mb-3">
              <span className="text-brand-cream">{sc.site_name}</span>
              <span className="text-brand-gold">{sc.site_tld ? '.' + sc.site_tld : ''}</span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed max-w-xs">{sc.footer_tagline}</p>
            <div className="flex gap-4 mt-4">
              <a href={sc.footer_telegram_url} target="_blank" rel="noopener noreferrer"
                className="text-brand-muted hover:text-brand-gold transition-colors text-sm font-mono">Telegram</a>
              <a href={`mailto:${sc.footer_email}`}
                className="text-brand-muted hover:text-brand-gold transition-colors text-sm font-mono">Email</a>
            </div>
          </div>

          {/* Navigate col */}
          <div>
            <h4 className="text-brand-cream font-mono text-xs uppercase tracking-widest mb-4">
              {sc.footer_nav_heading}
            </h4>
            <ul className="space-y-2">
              {sc.footer_nav_links.map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-brand-muted hover:text-brand-cream transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Writing col */}
          <div>
            <h4 className="text-brand-cream font-mono text-xs uppercase tracking-widest mb-4">
              {sc.footer_writing_heading}
            </h4>
            <ul className="space-y-2">
              {sc.footer_writing_links.map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-brand-muted hover:text-brand-gold transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-muted text-xs font-mono">
            © {new Date().getFullYear()} {sc.footer_copyright_name}. All rights reserved.
          </p>
          <p className="text-brand-muted text-xs font-mono">{sc.footer_built_text}</p>
        </div>
      </div>
    </footer>
  );
}
