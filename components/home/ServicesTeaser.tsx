'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Bot, Compass, Mic } from 'lucide-react';
import { useLang } from '@/lib/lang-context';

const SERVICES = [
  {
    icon: GraduationCap,
    title: 'AI Capability Development',
    title_kh: 'ការអភិវឌ្ឍសមត្ថភាព AI',
    desc: 'Corporate AI training, executive workshops, workforce transformation. Delivered in English and Khmer.',
    color: '#C9A84C',
  },
  {
    icon: Bot,
    title: 'AI Agents & Solutions',
    title_kh: 'AI Agents & Solutions',
    desc: 'End-to-end design and deployment of AI agents, chatbots, document intelligence, and agentic workflows.',
    color: '#3B82F6',
  },
  {
    icon: Compass,
    title: 'AI Strategy Consulting',
    title_kh: 'ការប្រឹក្សាយុទ្ធសាស្ត្រ AI',
    desc: 'PRISM Framework-powered AI readiness assessments, roadmaps, governance design, and fractional advisory.',
    color: '#10B981',
  },
  {
    icon: Mic,
    title: 'Speaking & Thought Leadership',
    title_kh: 'ការនិយាយ & ការដឹកនាំគំនិត',
    desc: 'Keynotes and panels on AI strategy, Cambodia\'s AI journey, ethical AI in ASEAN, and the future of work.',
    color: '#8B5CF6',
  },
];

export default function ServicesTeaser() {
  const { t, lang } = useLang();

  return (
    <section className="bg-brand-card border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-3">What I Do</span>
          <h2 className="section-title mb-4">{t('services.title')}</h2>
          <p className="text-brand-muted max-w-2xl mx-auto text-base leading-relaxed">
            {t('services.sub')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-brand-bg border border-brand-border rounded-xl p-6 hover:border-brand-gold/30 transition-all duration-300 card-hover"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: s.color + '22', border: `1px solid ${s.color}44` }}
              >
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <h3 className="font-display text-lg font-bold text-brand-cream mb-2 leading-snug">
                {lang === 'kh' ? s.title_kh : s.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary">
            {t('services.cta')} <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
