'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/lang-context';
import toast from 'react-hot-toast';
import { mergeSiteContent, type SiteContent } from '@/lib/site-content';

// ── AboutTeaser ────────────────────────────────────────────────────────────────
export function AboutTeaser() {
  const { lang } = useLang();
  const [sc, setSc] = useState<SiteContent>(mergeSiteContent(null));

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => setSc(mergeSiteContent(data)))
      .catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden max-w-sm">
            <Image src="/images/photo_2026-03-16_14-49-43.jpg" alt="HIN Sopheap" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-brand-card border border-brand-gold/30 rounded-xl px-6 py-4 shadow-xl">
            <p className="text-brand-gold font-mono text-2xl font-bold">{sc.home_about_badge_label}</p>
            <p className="text-brand-muted text-xs mt-0.5">{sc.home_about_badge_sub}</p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-4">
            {sc.home_about_eyebrow}
          </span>
          <h2 className="section-title mb-6 leading-tight">
            {sc.home_about_heading}<br />
            <span className="gold-text">{sc.home_about_highlight}</span>
          </h2>
          <p className="text-brand-muted leading-relaxed mb-4">{sc.home_about_para1}</p>
          <p className="text-brand-muted leading-relaxed mb-8">{sc.home_about_para2}</p>

          <div className="flex flex-wrap gap-3 mb-8">
            {sc.about_companies.map(c => (
              <span key={c.name} className="bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-mono px-3 py-1.5 rounded-full">
                {c.name}
              </span>
            ))}
          </div>

          <Link href="/about" className="btn-ghost">{sc.home_about_cta}</Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── SubscribeBanner ────────────────────────────────────────────────────────────
export function SubscribeBanner() {
  const { lang } = useLang();
  const [sc, setSc] = useState<SiteContent>(mergeSiteContent(null));
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => setSc(mergeSiteContent(data)))
      .catch(() => {});
  }, []);

  const subscribe = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: lang }),
      });
      if (res.ok) {
        toast.success("You're subscribed! See you every Tuesday.");
        setEmail('');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-blue/5" />
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-4">
          {sc.home_subscribe_eyebrow}
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-cream mb-4">
          {lang === 'kh' ? sc.home_subscribe_heading_kh : sc.home_subscribe_heading}
        </h2>
        <p className="text-brand-muted text-base mb-8 max-w-md mx-auto">
          {lang === 'kh' ? sc.home_subscribe_sub_kh : sc.home_subscribe_sub}
        </p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={lang === 'kh' ? sc.home_subscribe_placeholder_kh : sc.home_subscribe_placeholder}
            onKeyDown={e => e.key === 'Enter' && subscribe()}
            className="input-base flex-1"
          />
          <button onClick={subscribe} disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? '...' : (lang === 'kh' ? sc.home_subscribe_cta_kh : sc.home_subscribe_cta)}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AboutTeaser;
