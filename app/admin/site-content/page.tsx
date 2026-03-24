'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  DEFAULT_CONTENT, mergeSiteContent,
  type SiteContent, type ServiceItem, type ServiceTeaserItem,
  type Testimonial, type Credential, type Company,
} from '@/lib/site-content';
import {
  Save, Plus, Trash2, ChevronDown, ChevronUp, Globe,
  Loader2, LayoutTemplate, Briefcase, User, Home, CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline = false, rows = 3, hint, mono = false }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number; hint?: string; mono?: boolean;
}) {
  const base = 'w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-cream text-sm focus:outline-none focus:border-brand-gold/50 transition-colors resize-none';
  return (
    <div className="space-y-1">
      <label className="block text-brand-muted text-xs font-mono uppercase tracking-wider">{label}</label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={cn(base, mono && 'font-mono text-xs')} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={cn(base, mono && 'font-mono text-xs')} />}
      {hint && <p className="text-brand-muted text-xs">{hint}</p>}
    </div>
  );
}

function BilingualField({ label, valueEn, valueKh, onChangeEn, onChangeKh }: {
  label: string; valueEn: string; valueKh: string;
  onChangeEn: (v: string) => void; onChangeKh: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-brand-muted text-xs font-mono uppercase tracking-wider">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-brand-muted text-xs mb-1">🇬🇧 English</div>
          <input type="text" value={valueEn} onChange={e => onChangeEn(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-cream text-sm focus:outline-none focus:border-brand-gold/50 transition-colors" />
        </div>
        <div>
          <div className="text-brand-muted text-xs mb-1">🇰🇭 Khmer</div>
          <input type="text" value={valueKh} onChange={e => onChangeKh(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-cream text-sm font-mono text-xs focus:outline-none focus:border-brand-gold/50 transition-colors" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-brand-border/20 transition-colors">
        <span className="font-semibold text-brand-cream text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-brand-muted" /> : <ChevronDown size={16} className="text-brand-muted" />}
      </button>
      {open && <div className="px-6 pb-6 space-y-4 border-t border-brand-border pt-5">{children}</div>}
    </div>
  );
}

// ─── TAB: HOME ────────────────────────────────────────────────────────────────

function HomeTab({ content, setContent }: { content: SiteContent; setContent: (c: SiteContent) => void }) {
  const set = (key: keyof SiteContent, val: any) => setContent({ ...content, [key]: val });

  // Services teaser items
  const updateTeaserItem = (i: number, field: keyof ServiceTeaserItem, val: string) => {
    const items = content.home_services_items.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    set('home_services_items', items);
  };

  return (
    <div className="space-y-4">

      {/* ── HERO ── */}
      <Card title="🏠 Hero Section">
        <Field label="Badge / Tagline (top pill)" value={content.home_hero_badge} onChange={v => set('home_hero_badge', v)} />
        <BilingualField
          label="Main Title"
          valueEn={content.home_hero_title} onChangeEn={v => set('home_hero_title', v)}
          valueKh={content.home_hero_title_kh} onChangeKh={v => set('home_hero_title_kh', v)}
        />
        <BilingualField
          label="Subtitle"
          valueEn={content.home_hero_sub} onChangeEn={v => set('home_hero_sub', v)}
          valueKh={content.home_hero_sub_kh} onChangeKh={v => set('home_hero_sub_kh', v)}
        />
        <BilingualField
          label="CTA Button 1 (goes to /blog)"
          valueEn={content.home_hero_cta1} onChangeEn={v => set('home_hero_cta1', v)}
          valueKh={content.home_hero_cta1_kh} onChangeKh={v => set('home_hero_cta1_kh', v)}
        />
        <BilingualField
          label="CTA Button 2 (goes to /services)"
          valueEn={content.home_hero_cta2} onChangeEn={v => set('home_hero_cta2', v)}
          valueKh={content.home_hero_cta2_kh} onChangeKh={v => set('home_hero_cta2_kh', v)}
        />
      </Card>

      {/* ── SERVICES TEASER ── */}
      <Card title="⚡ Services Teaser Section" defaultOpen={false}>
        <Field label="Eyebrow Label" value={content.home_services_eyebrow} onChange={v => set('home_services_eyebrow', v)} />
        <BilingualField
          label="Section Heading"
          valueEn={content.home_services_heading} onChangeEn={v => set('home_services_heading', v)}
          valueKh={content.home_services_heading_kh} onChangeKh={v => set('home_services_heading_kh', v)}
        />
        <BilingualField
          label="Section Subtext"
          valueEn={content.home_services_sub} onChangeEn={v => set('home_services_sub', v)}
          valueKh={content.home_services_sub_kh} onChangeKh={v => set('home_services_sub_kh', v)}
        />
        <BilingualField
          label="CTA Button"
          valueEn={content.home_services_cta} onChangeEn={v => set('home_services_cta', v)}
          valueKh={content.home_services_cta_kh} onChangeKh={v => set('home_services_cta_kh', v)}
        />
        <div className="pt-2 space-y-3">
          <label className="block text-brand-muted text-xs font-mono uppercase tracking-wider">Service Cards</label>
          {content.home_services_items.map((s, i) => (
            <div key={i} className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-3">
              <span className="text-brand-gold text-xs font-mono">Card {i + 1}</span>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title (EN)" value={s.title} onChange={v => updateTeaserItem(i, 'title', v)} />
                <Field label="Title (KH)" value={s.title_kh} onChange={v => updateTeaserItem(i, 'title_kh', v)} mono />
              </div>
              <Field label="Description" value={s.desc} onChange={v => updateTeaserItem(i, 'desc', v)} multiline rows={2} />
            </div>
          ))}
        </div>
      </Card>

      {/* ── ABOUT TEASER ── */}
      <Card title="👤 About Teaser Section" defaultOpen={false}>
        <Field label="Eyebrow Label" value={content.home_about_eyebrow} onChange={v => set('home_about_eyebrow', v)} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Heading" value={content.home_about_heading} onChange={v => set('home_about_heading', v)} />
          <Field label="Heading Highlight (gold)" value={content.home_about_highlight} onChange={v => set('home_about_highlight', v)} />
        </div>
        <Field label="Paragraph 1" value={content.home_about_para1} onChange={v => set('home_about_para1', v)} multiline rows={3} />
        <Field label="Paragraph 2" value={content.home_about_para2} onChange={v => set('home_about_para2', v)} multiline rows={3} />
        <Field label="CTA Link Text" value={content.home_about_cta} onChange={v => set('home_about_cta', v)} />
        <div className="grid grid-cols-2 gap-4 pt-1">
          <Field label="Badge Label (e.g. MBA)" value={content.home_about_badge_label} onChange={v => set('home_about_badge_label', v)} />
          <Field label="Badge Subtitle" value={content.home_about_badge_sub} onChange={v => set('home_about_badge_sub', v)} />
        </div>
      </Card>

      {/* ── SUBSCRIBE BANNER ── */}
      <Card title="📧 Subscribe Banner" defaultOpen={false}>
        <Field label="Eyebrow Label" value={content.home_subscribe_eyebrow} onChange={v => set('home_subscribe_eyebrow', v)} />
        <BilingualField
          label="Heading"
          valueEn={content.home_subscribe_heading} onChangeEn={v => set('home_subscribe_heading', v)}
          valueKh={content.home_subscribe_heading_kh} onChangeKh={v => set('home_subscribe_heading_kh', v)}
        />
        <BilingualField
          label="Subtext"
          valueEn={content.home_subscribe_sub} onChangeEn={v => set('home_subscribe_sub', v)}
          valueKh={content.home_subscribe_sub_kh} onChangeKh={v => set('home_subscribe_sub_kh', v)}
        />
        <BilingualField
          label="CTA Button"
          valueEn={content.home_subscribe_cta} onChangeEn={v => set('home_subscribe_cta', v)}
          valueKh={content.home_subscribe_cta_kh} onChangeKh={v => set('home_subscribe_cta_kh', v)}
        />
        <BilingualField
          label="Email Placeholder"
          valueEn={content.home_subscribe_placeholder} onChangeEn={v => set('home_subscribe_placeholder', v)}
          valueKh={content.home_subscribe_placeholder_kh} onChangeKh={v => set('home_subscribe_placeholder_kh', v)}
        />
      </Card>

    </div>
  );
}

// ─── TAB: SERVICES PAGE ───────────────────────────────────────────────────────

function ServicesTab({ content, setContent }: { content: SiteContent; setContent: (c: SiteContent) => void }) {
  const set = (key: keyof SiteContent, val: any) => setContent({ ...content, [key]: val });

  const updateServiceItem = (i: number, field: keyof ServiceItem, val: string) => {
    const items = content.services_items.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    set('services_items', items);
  };
  const updateServiceFeature = (si: number, fi: number, val: string) => {
    const items = content.services_items.map((s, i) => {
      if (i !== si) return s;
      return { ...s, features: s.features.map((f, idx) => idx === fi ? val : f) };
    });
    set('services_items', items);
  };
  const addFeature = (si: number) => {
    const items = content.services_items.map((s, i) => i === si ? { ...s, features: [...s.features, 'New feature'] } : s);
    set('services_items', items);
  };
  const removeFeature = (si: number, fi: number) => {
    const items = content.services_items.map((s, i) => i === si ? { ...s, features: s.features.filter((_, idx) => idx !== fi) } : s);
    set('services_items', items);
  };
  const updateTestimonial = (i: number, field: keyof Testimonial, val: string) => {
    const t = content.services_testimonials.map((tm, idx) => idx === i ? { ...tm, [field]: val } : tm);
    set('services_testimonials', t);
  };

  return (
    <div className="space-y-4">
      <Card title="Page Hero">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow" value={content.services_hero_eyebrow} onChange={v => set('services_hero_eyebrow', v)} />
          <Field label="Highlight Text (gold)" value={content.services_hero_highlight} onChange={v => set('services_hero_highlight', v)} />
        </div>
        <Field label="Heading Prefix" value={content.services_hero_heading} onChange={v => set('services_hero_heading', v)} hint='"From [AI Curious] to AI Capable"' />
        <Field label="Subtext" value={content.services_hero_subtext} onChange={v => set('services_hero_subtext', v)} multiline rows={2} />
      </Card>

      {content.services_items.map((svc, i) => (
        <Card key={i} title={`Service Card ${i + 1} — ${svc.title}`} defaultOpen={false}>
          <Field label="Title" value={svc.title} onChange={v => updateServiceItem(i, 'title', v)} />
          <Field label="Description" value={svc.desc} onChange={v => updateServiceItem(i, 'desc', v)} multiline rows={3} />
          <div className="space-y-2">
            <label className="block text-brand-muted text-xs font-mono uppercase tracking-wider">Feature Bullets</label>
            {svc.features.map((f, fi) => (
              <div key={fi} className="flex items-center gap-2">
                <input type="text" value={f} onChange={e => updateServiceFeature(i, fi, e.target.value)}
                  className="flex-1 bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-cream text-sm focus:outline-none focus:border-brand-gold/50" />
                <button onClick={() => removeFeature(i, fi)} className="p-2 text-brand-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
            <button onClick={() => addFeature(i)} className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold/80 transition-colors">
              <Plus size={13} /> Add Feature
            </button>
          </div>
        </Card>
      ))}

      <Card title="Client Testimonials" defaultOpen={false}>
        <div className="space-y-5">
          {content.services_testimonials.map((tm, i) => (
            <div key={i} className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-brand-gold text-xs font-mono">Testimonial {i + 1}</span>
                <button onClick={() => set('services_testimonials', content.services_testimonials.filter((_, idx) => idx !== i))} className="text-brand-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
              <Field label="Quote" value={tm.quote} onChange={v => updateTestimonial(i, 'quote', v)} multiline rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={tm.name} onChange={v => updateTestimonial(i, 'name', v)} />
                <Field label="Organisation" value={tm.org} onChange={v => updateTestimonial(i, 'org', v)} />
              </div>
            </div>
          ))}
          <button
            onClick={() => set('services_testimonials', [...content.services_testimonials, { quote: 'Enter quote here.', name: 'Client Name', org: 'Organisation' }])}
            className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold/80 transition-colors"
          ><Plus size={13} /> Add Testimonial</button>
        </div>
      </Card>

      <Card title="Contact / Work With Me Section" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow" value={content.services_contact_eyebrow} onChange={v => set('services_contact_eyebrow', v)} />
          <Field label="Heading" value={content.services_contact_heading} onChange={v => set('services_contact_heading', v)} />
        </div>
        <Field label="Subtext" value={content.services_contact_subtext} onChange={v => set('services_contact_subtext', v)} multiline rows={2} />
      </Card>
    </div>
  );
}

// ─── TAB: ABOUT PAGE ─────────────────────────────────────────────────────────

function AboutTab({ content, setContent }: { content: SiteContent; setContent: (c: SiteContent) => void }) {
  const set = (key: keyof SiteContent, val: any) => setContent({ ...content, [key]: val });
  const updateCred = (i: number, field: keyof Credential, val: string) => {
    const creds = content.about_credentials.map((c, idx) => idx === i ? { ...c, [field]: val } : c);
    set('about_credentials', creds);
  };
  const updateCompany = (i: number, field: keyof Company, val: string) => {
    const companies = content.about_companies.map((c, idx) => idx === i ? { ...c, [field]: val } : c);
    set('about_companies', companies);
  };

  return (
    <div className="space-y-4">
      <Card title="Page Hero">
        <Field label="Eyebrow / Name Label" value={content.about_hero_eyebrow} onChange={v => set('about_hero_eyebrow', v)} />
        <Field label="Heading Line 1" value={content.about_hero_heading} onChange={v => set('about_hero_heading', v)} />
        <Field label="Heading Line 2 (gold)" value={content.about_hero_highlight} onChange={v => set('about_hero_highlight', v)} />
      </Card>

      <Card title="Bio Paragraphs">
        <div className="space-y-4">
          {content.about_bio.map((para, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-brand-muted text-xs font-mono">Paragraph {i + 1}</span>
                <button onClick={() => set('about_bio', content.about_bio.filter((_, idx) => idx !== i))} className="text-brand-muted hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
              <textarea rows={3} value={para} onChange={e => set('about_bio', content.about_bio.map((b, idx) => idx === i ? e.target.value : b))}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-cream text-sm focus:outline-none focus:border-brand-gold/50 resize-none" />
            </div>
          ))}
          <button onClick={() => set('about_bio', [...content.about_bio, 'New paragraph...'])} className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold/80 transition-colors">
            <Plus size={13} /> Add Paragraph
          </button>
        </div>
      </Card>

      <Card title="Credentials / Timeline" defaultOpen={false}>
        <div className="space-y-4">
          {content.about_credentials.map((cred, i) => (
            <div key={i} className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-brand-gold text-xs font-mono">Credential {i + 1}</span>
                <button onClick={() => set('about_credentials', content.about_credentials.filter((_, idx) => idx !== i))} className="text-brand-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Year" value={cred.year} onChange={v => updateCred(i, 'year', v)} />
                <div className="col-span-2"><Field label="Title" value={cred.title} onChange={v => updateCred(i, 'title', v)} /></div>
              </div>
              <Field label="Description" value={cred.desc} onChange={v => updateCred(i, 'desc', v)} />
            </div>
          ))}
          <button onClick={() => set('about_credentials', [...content.about_credentials, { year: 'Year', title: 'Title', desc: 'Description.' }])}
            className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold/80 transition-colors"><Plus size={13} /> Add Credential</button>
        </div>
      </Card>

      <Card title="Companies / Ventures" defaultOpen={false}>
        <div className="space-y-4">
          {content.about_companies.map((co, i) => (
            <div key={i} className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-3">
              <span className="text-brand-gold text-xs font-mono">{co.name}</span>
              <Field label="Company Name" value={co.name} onChange={v => updateCompany(i, 'name', v)} />
              <Field label="Description" value={co.desc} onChange={v => updateCompany(i, 'desc', v)} multiline rows={2} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'home',     label: 'Home Page',     icon: Home },
  { key: 'services', label: 'Services Page', icon: Briefcase },
  { key: 'about',    label: 'About Page',    icon: User },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function SiteContentPage() {
  const { user } = useAuth();
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/site-content')
      .then(r => r.json())
      .then(data => { setContent(mergeSiteContent(data)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success('Site content saved!');
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [content, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-brand-gold" />
        <span className="text-brand-muted font-mono text-sm ml-3">Loading site content...</span>
      </div>
    );
  }

  const SaveBtn = ({ full }: { full?: boolean }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className={cn(
        'flex items-center gap-2 rounded-xl text-sm font-semibold transition-all',
        full ? 'px-5 py-3 shadow-2xl' : 'px-5 py-2.5',
        saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-gold text-brand-bg hover:bg-brand-gold/90'
      )}
    >
      {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
        : saved  ? <><CheckCircle2 size={15} /> Saved!</>
        :           <><Save size={15} /> Save All Changes</>}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-cream">Site Content Editor</h1>
          <p className="text-brand-muted text-sm mt-1">Edit all headings, text and copy across the site — changes go live instantly</p>
        </div>
        <SaveBtn />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-brand-card border border-brand-border rounded-xl p-1 mb-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.key
                ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                : 'text-brand-muted hover:text-brand-cream'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'home'     && <HomeTab     content={content} setContent={setContent} />}
      {activeTab === 'services' && <ServicesTab content={content} setContent={setContent} />}
      {activeTab === 'about'    && <AboutTab    content={content} setContent={setContent} />}

      {/* Sticky save */}
      <div className="fixed bottom-6 right-8 z-50">
        <SaveBtn full />
      </div>
    </div>
  );
}
