'use client';
 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { GraduationCap, Bot, Compass, Mic, Send, MessageCircle, Mail, FileText } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import toast from 'react-hot-toast';
import { mergeSiteContent, type SiteContent } from '@/lib/site-content';
 
// Icons stay static — only text is dynamic
const SERVICE_ICONS = [
  { icon: GraduationCap, color: '#C9A84C' },
  { icon: Bot,           color: '#3B82F6' },
  { icon: Compass,       color: '#10B981' },
  { icon: Mic,           color: '#8B5CF6' },
];
 
const CONTACT_OPTIONS = [
  {
    icon: MessageCircle,
    label: 'Telegram',
    sub: 'Fastest response',
    value: '095 666 788',
    href: 'https://t.me/+85595666788',
    color: '#0088cc',
  },
  {
    icon: Mail,
    label: 'Email',
    sub: 'For detailed proposals',
    value: 'sopheap.hin@gmail.com',
    href: 'mailto:sopheap.hin@gmail.com',
    color: '#C9A84C',
  },
];
 
export default function ServicesPage() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: '', organization: '', email: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sc, setSc] = useState<SiteContent>(mergeSiteContent(null));
 
  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => setSc(mergeSiteContent(data)))
      .catch(() => {/* keep defaults */});
  }, []);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(t('contact.success'));
        setForm({ name: '', organization: '', email: '', service: '', message: '' });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Failed to send. Please try again or contact via Telegram.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <main className="min-h-screen">
      <Navbar />
 
      {/* Hero */}
      <div className="relative pt-28 pb-16 border-b border-brand-border">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-card to-brand-bg" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-4">
            {sc.services_hero_eyebrow}
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-cream mb-4">
            {sc.services_hero_heading}<span className="gold-text">{sc.services_hero_highlight}</span><br />to AI Capable
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            {sc.services_hero_subtext}
          </p>
        </div>
      </div>
 
      {/* Service cards */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {sc.services_items.map((s, i) => {
            const { icon: Icon, color } = SERVICE_ICONS[i] ?? SERVICE_ICONS[0];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-brand-card border border-brand-border rounded-2xl p-8 hover:border-brand-gold/20 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: color + '20', border: `1px solid ${color}40` }}
                >
                  <Icon size={26} style={{ color }} />
                </div>
                <h3 className="font-display text-2xl font-bold text-brand-cream mb-3">{s.title}</h3>
                <p className="text-brand-muted leading-relaxed mb-6">{s.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {s.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-brand-muted">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
 
      {/* Testimonials */}
      <div className="bg-brand-card border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl font-bold text-brand-cream text-center mb-12">What Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {sc.services_testimonials.map((tm, i) => (
              <div key={i} className="bg-brand-bg border border-brand-border rounded-xl p-6">
                <div className="text-brand-gold text-3xl font-display mb-4">"</div>
                <p className="text-brand-cream italic leading-relaxed mb-4">{tm.quote}</p>
                <p className="text-brand-gold text-sm font-mono">{tm.name}</p>
                <p className="text-brand-muted text-xs">{tm.org}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Work With Me / Contact */}
      <div id="contact" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-3">
            {sc.services_contact_eyebrow}
          </span>
          <h2 className="section-title mb-4">{sc.services_contact_heading}</h2>
          <p className="text-brand-muted max-w-lg mx-auto">{sc.services_contact_subtext}</p>
        </div>
 
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {CONTACT_OPTIONS.map(c => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-gold/40 transition-all card-hover"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: c.color + '20' }}>
                <c.icon size={22} style={{ color: c.color }} />
              </div>
              <p className="text-brand-cream font-semibold mb-1">{c.label}</p>
              <p className="text-brand-muted text-xs mb-3">{c.sub}</p>
              <p className="text-brand-gold text-sm font-mono">{c.value}</p>
            </a>
          ))}
          <div className="flex flex-col items-center text-center bg-brand-card border border-brand-border rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4">
              <FileText size={22} className="text-brand-gold" />
            </div>
            <p className="text-brand-cream font-semibold mb-1">Fill the Form</p>
            <p className="text-brand-muted text-xs mb-3">Structured inquiry</p>
            <p className="text-brand-gold text-sm font-mono">↓ Below</p>
          </div>
        </div>
 
        {/* Contact form */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 md:p-10">
          <h3 className="font-display text-2xl font-bold text-brand-cream mb-8">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">{t('contact.name')} *</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-base" />
              </div>
              <div>
                <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">{t('contact.org')}</label>
                <input type="text" value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} className="input-base" />
              </div>
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">{t('contact.emailLabel')} *</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-base" />
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">{t('contact.service')}</label>
              <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="input-base">
                <option value="">Select a service...</option>
                {sc.services_items.map(s => (
                  <option key={s.title} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">{t('contact.message')} *</label>
              <textarea
                required rows={4} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell me about your organisation, your AI challenge, and what you're hoping to achieve..."
                className="input-base resize-none"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
              {loading ? t('contact.sending') : <><Send size={16} /> {t('contact.submit')}</>}
            </button>
          </form>
        </div>
      </div>
 
      <Footer />
    </main>
  );
}
 


