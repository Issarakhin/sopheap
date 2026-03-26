'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mergeSiteContent, type SiteContent } from '@/lib/site-content';

export default function AboutPage() {
  const [sc, setSc] = useState<SiteContent>(mergeSiteContent(null));

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => setSc(mergeSiteContent(data)))
      .catch(() => {/* keep defaults */});
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/photo_2026-03-16_14-49-43.jpg" alt="HIN Sopheap" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/30 via-brand-bg/60 to-brand-bg" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-32">
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-3">
            {sc.about_hero_eyebrow}
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-cream leading-tight mb-4">
            {sc.about_hero_heading}<br />
            <span className="gold-text">{sc.about_hero_highlight}</span>
          </h1>
        </div>
      </div>

      {/* Bio */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-invert prose-lg max-w-none space-y-6">
          {sc.about_bio.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={i === 0
                ? 'text-brand-cream leading-relaxed text-xl font-display'
                : 'text-brand-muted leading-relaxed'}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Credentials timeline */}
      <div className="border-y border-brand-border bg-brand-card">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl font-bold text-brand-cream mb-12 text-center">Credentials &amp; Milestones</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sc.about_credentials.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-brand-bg border border-brand-border rounded-xl p-6"
              >
                <div className="text-brand-gold font-mono text-sm mb-2">{c.year}</div>
                <div className="font-display text-lg font-bold text-brand-cream mb-1">{c.title}</div>
                <div className="text-brand-muted text-sm">{c.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Companies */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-brand-cream mb-12 text-center">Cambodia AI Group</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {sc.about_companies.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-brand-gold font-bold text-xl">{c.name[0]}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-brand-cream mb-2">{c.name}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <div className="bg-gradient-to-br from-brand-gold/10 to-brand-blue/5 border border-brand-gold/20 rounded-2xl p-12">
          <h2 className="font-display text-3xl font-bold text-brand-cream mb-4">Ready to Work Together?</h2>
          <p className="text-brand-muted mb-8">Let's talk about your AI challenge and how I can help.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/services#contact" className="btn-primary">Get in Touch</Link>
            <Link href="/blog" className="btn-ghost">Read My Writing</Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
