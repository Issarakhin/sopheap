'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLang } from '@/lib/lang-context';

const CREDENTIALS = [
  { year: '2001+', title: '23+ Years Senior Leadership', desc: 'Built and led major organisations across Cambodia.' },
  { year: 'MBA', title: 'Asian Institute of Technology', desc: 'Graduate business education with strategic focus.' },
  { year: '2021+', title: 'Co-Founder, Cambodia AI Group', desc: 'DG Academy · NeuraSpace AI · AngkorGate AI' },
  { year: 'Ongoing', title: 'AI Trainer & Educator', desc: 'Trained thousands of executives, managers, and students.' },
  { year: 'Regional', title: 'Conference Speaker', desc: 'Keynotes across Cambodia and the ASEAN region.' },
  { year: 'Weekly', title: 'AI Frontier Brief & The Long View', desc: 'Tuesday newsletter and Sunday deep opinion column.' },
];

const COMPANIES = [
  { name: 'DG Academy', desc: 'AI training platform for Cambodia and ASEAN. Corporate workshops, certificate programmes, workforce transformation.' },
  { name: 'NeuraSpace AI', desc: 'AI solutions and deployment. AI agents, chatbots, document intelligence, custom LLM integrations.' },
  { name: 'AngkorGate AI', desc: 'Ecosystem building. Connecting Cambodia\'s AI community, fostering partnerships, and advancing national AI readiness.' },
];

export default function AboutPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/sopheap.jpg" alt="HIN Sopheap" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/30 via-brand-bg/60 to-brand-bg" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-32">
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-3">HIN Sopheap</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-cream leading-tight mb-4">
            Building Cambodia's AI Future —<br />
            <span className="gold-text">One Leader at a Time</span>
          </h1>
        </div>
      </div>

      {/* Bio */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-invert prose-lg max-w-none space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-cream leading-relaxed text-xl font-display"
          >
            I've spent 23 years building Cambodia's business landscape. Across banks, conglomerates, and enterprises,
            I've seen how leadership, strategy, and technology intersect — and how rarely they come together well.
            AI is the moment when they finally can.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-brand-muted leading-relaxed"
          >
            I pivoted fully into AI because I saw a dangerous gap forming in Cambodia: global AI adoption accelerating
            while Cambodian leaders were left without the frameworks, skills, or local-context knowledge to act wisely.
            The risk wasn't that Cambodia would adopt AI poorly — it was that Cambodia would adopt someone else's AI
            without understanding what it means for our own economy, culture, and people.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-muted leading-relaxed"
          >
            Cambodia AI Group — the consolidated home of DG Academy, NeuraSpace AI, and AngkorGate AI — is my answer
            to that gap. We train the people who lead organisations. We build the AI agents that run real workflows.
            We consult the enterprises making strategic AI decisions. And we experiment constantly — because the only
            way to understand how AI works in a Cambodian context is to build it here.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-brand-muted leading-relaxed"
          >
            My writing — the AI Frontier Brief every Tuesday and The Long View every Sunday — exists because
            I believe Cambodians deserve clear, honest, locally-grounded thinking about how AI is reshaping the world.
            Not hype. Not fear. Insight with action attached.
          </motion.p>
        </div>
      </div>

      {/* Credentials timeline */}
      <div className="border-y border-brand-border bg-brand-card">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl font-bold text-brand-cream mb-12 text-center">Credentials & Milestones</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREDENTIALS.map((c, i) => (
              <motion.div
                key={c.title}
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
          {COMPANIES.map((c, i) => (
            <motion.div
              key={c.name}
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
