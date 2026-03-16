'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/lang-context';
import { useState } from 'react';
import toast from 'react-hot-toast';

// ── AboutTeaser ────────────────────────────────────────────────────────────────
export function AboutTeaser() {
  const { t, lang } = useLang();
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
            <Image src="/images/sopheap.jpg" alt="HIN Sopheap" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-brand-card border border-brand-gold/30 rounded-xl px-6 py-4 shadow-xl">
            <p className="text-brand-gold font-mono text-2xl font-bold">MBA</p>
            <p className="text-brand-muted text-xs mt-0.5">Asian Institute of Technology</p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-4">About Sopheap</span>
          <h2 className="section-title mb-6 leading-tight">
            Building Cambodia's<br />
            <span className="gold-text">AI Future</span>
          </h2>
          <p className="text-brand-muted leading-relaxed mb-4">
            23 years of senior leadership across Cambodia's major enterprises — and now building its AI future.
            As Co-Founder of Cambodia AI Group, I train executives, deploy intelligent agents, advise enterprises,
            and speak at conferences across the region.
          </p>
          <p className="text-brand-muted leading-relaxed mb-8">
            My writing exists because Cambodians deserve clear, honest, locally-grounded thinking about
            how AI is reshaping the world. I'm not just talking about AI — I'm building it.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {['DG Academy', 'NeuraSpace AI', 'AngkorGate AI'].map(c => (
              <span key={c} className="bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-mono px-3 py-1.5 rounded-full">
                {c}
              </span>
            ))}
          </div>

          <Link href="/about" className="btn-ghost">
            Read My Full Story →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── SubscribeBanner ────────────────────────────────────────────────────────────
export function SubscribeBanner() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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
        toast.success('You\'re subscribed! See you every Tuesday.');
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
        <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-4">Every Tuesday</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-cream mb-4">
          {t('subscribe.title')}
        </h2>
        <p className="text-brand-muted text-base mb-8 max-w-md mx-auto">
          {t('subscribe.sub')}
        </p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('subscribe.placeholder')}
            onKeyDown={e => e.key === 'Enter' && subscribe()}
            className="input-base flex-1"
          />
          <button
            onClick={subscribe}
            disabled={loading}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? '...' : t('subscribe.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}

// Default exports for next/dynamic compatibility
export default AboutTeaser;
