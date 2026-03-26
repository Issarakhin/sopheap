'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MessageCircle, Mail, Send, Loader, MapPin } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import toast from 'react-hot-toast';
import { mergeSiteContent, type SiteContent } from '@/lib/site-content';

export default function ContactPage() {
  const { t } = useLang();
  const [sc, setSc] = useState<SiteContent>(mergeSiteContent(null));
  const [form, setForm] = useState({ name: '', organization: '', email: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => setSc(mergeSiteContent(data)))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success(t('contact.success')); setForm({ name: '', organization: '', email: '', service: '', message: '' }); }
      else toast.error('Something went wrong. Please try again.');
    } catch { toast.error('Failed to send.'); }
    finally { setLoading(false); }
  };

  const contactOptions = [
    { icon: MessageCircle, label: 'Telegram',  sub: 'Fastest response',    value: sc.contact_telegram, href: `https://t.me/+855${sc.contact_telegram.replace(/\D/g,'')}`, color: '#0088cc' },
    { icon: Mail,          label: 'Email',     sub: 'For detailed enquiries', value: sc.contact_email, href: `mailto:${sc.contact_email}`, color: '#C9A84C' },
    { icon: MapPin,        label: 'Location',  sub: 'Based in',             value: sc.contact_location, href: '#', color: '#10B981' },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-3">{sc.contact_eyebrow}</span>
            <h1 className="font-display text-5xl font-bold text-brand-cream mb-4">{sc.contact_heading}</h1>
            <p className="text-brand-muted text-lg max-w-md mx-auto">{sc.contact_subtext}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {contactOptions.map(c => (
              <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined}
                className="flex flex-col items-center text-center bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-gold/30 transition-all card-hover">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: c.color + '20' }}>
                  <c.icon size={22} style={{ color: c.color }} />
                </div>
                <p className="text-brand-cream font-semibold mb-1">{c.label}</p>
                <p className="text-brand-muted text-xs mb-2">{c.sub}</p>
                <p className="text-brand-gold text-sm font-mono">{c.value}</p>
              </a>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-brand-card border border-brand-border rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-brand-cream mb-6">{sc.contact_form_heading}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
                  {sc.services_items.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">{t('contact.message')} *</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-base resize-none" placeholder="Tell me about your challenge..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
                {loading ? <><Loader size={16} className="animate-spin" /> {t('contact.sending')}</> : <><Send size={16} /> {t('contact.submit')}</>}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
