'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Bot, Compass, Mic } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { mergeSiteContent, type SiteContent } from '@/lib/site-content';

const ICONS = [
  { icon: GraduationCap, color: '#C9A84C' },
  { icon: Bot,           color: '#3B82F6' },
  { icon: Compass,       color: '#10B981' },
  { icon: Mic,           color: '#8B5CF6' },
];

export default function ServicesTeaser() {
  const { lang } = useLang();
  const [sc, setSc] = useState<SiteContent>(mergeSiteContent(null));

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => setSc(mergeSiteContent(data)))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-brand-card border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-3">
            {sc.home_services_eyebrow}
          </span>
          <h2 className="section-title mb-4">
            {lang === 'kh' ? sc.home_services_heading_kh : sc.home_services_heading}
          </h2>
          <p className="text-brand-muted max-w-2xl mx-auto text-base leading-relaxed">
            {lang === 'kh' ? sc.home_services_sub_kh : sc.home_services_sub}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sc.home_services_items.map((s, i) => {
            const { icon: Icon, color } = ICONS[i] ?? ICONS[0];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-brand-bg border border-brand-border rounded-xl p-6 hover:border-brand-gold/30 transition-all duration-300 card-hover"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: color + '22', border: `1px solid ${color}44` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-display text-lg font-bold text-brand-cream mb-2 leading-snug">
                  {lang === 'kh' ? s.title_kh : s.title}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary">
            {lang === 'kh' ? sc.home_services_cta_kh : sc.home_services_cta} <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
