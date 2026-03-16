'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/blog/ArticleCard';
import { getPostBySlug, getPosts, incrementViewCount } from '@/lib/db';
import { useLang } from '@/lib/lang-context';
import { formatDate, CATEGORY_LABELS, cn } from '@/lib/utils';
import { Share2, MessageCircle, Linkedin, Link2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Post } from '@/types';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [progress, setProgress] = useState(0);
  const { lang, setLang, t } = useLang();
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then(async p => {
      if (!p) return;
      setPost(p);
      incrementViewCount(p.id);
      const rel = await getPosts({ category: p.category, limit: 4 });
      setRelated(rel.filter(r => r.id !== p.id).slice(0, 3));
    });
  }, [slug]);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, (-top / (height - window.innerHeight)) * 100));
      setProgress(pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  const share = (platform: string) => {
    const url = window.location.href;
    const text = `"${post?.title}" by HIN Sopheap`;
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    if (platform === 'linkedin') window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(post?.title || '')}`);
    if (platform === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    if (platform === 'copy') { navigator.clipboard.writeText(url); toast.success('Link copied!'); }
  };

  if (!post) return (
    <main className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-[60vh] text-brand-muted">Loading...</div>
    </main>
  );

  const cat = CATEGORY_LABELS[post.category];
  const isAFB = post.category === 'ai-frontier-brief';
  const title = lang === 'kh' && post.title_kh ? post.title_kh : post.title;
  const body = lang === 'kh' && post.body_kh ? post.body_kh : post.body;
  const hasKhmer = !!(post.title_kh && post.body_kh);

  return (
    <main className="min-h-screen">
      {/* Reading progress */}
      <div id="reading-progress" style={{ width: `${progress}%` }} />

      <Navbar />

      {/* Hero */}
      <div className="relative pt-24 pb-0">
        {post.coverImage && (
          <div className="relative h-[50vh] overflow-hidden">
            <Image src={post.coverImage} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/40 via-brand-bg/60 to-brand-bg" />
          </div>
        )}
        <div className={cn('max-w-4xl mx-auto px-6', post.coverImage ? '-mt-32 relative z-10' : 'pt-16')}>
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span
              className="category-badge"
              style={{ background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}
            >
              {cat.en}
            </span>
            <span className="text-brand-muted text-xs font-mono">{post.readTime}</span>
            <span className="text-brand-muted text-xs font-mono">{formatDate(post.publishedAt as Date)}</span>

            {/* Language toggle */}
            {hasKhmer && (
              <div className="ml-auto flex items-center gap-1 border border-brand-border rounded-lg overflow-hidden">
                <Globe size={12} className="text-brand-muted ml-2" />
                {(['en', 'kh'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      'px-3 py-1 text-xs font-mono transition-colors',
                      lang === l ? 'bg-brand-gold text-brand-bg' : 'text-brand-muted hover:text-brand-cream'
                    )}
                  >
                    {l === 'en' ? 'EN' : 'ខ្មែរ'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h1 className={cn(
            'font-display text-4xl md:text-5xl font-bold text-brand-cream leading-tight mb-6',
            lang === 'kh' && post.title_kh && 'font-khmer'
          )}>
            {title}
          </h1>

          {/* Byline */}
          <div className="flex items-center gap-4 pb-8 border-b border-brand-border">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold/40 relative flex-shrink-0">
              <Image src="/images/sopheap.jpg" alt="HIN Sopheap" fill className="object-cover" />
            </div>
            <div>
              <p className="text-brand-cream font-semibold text-sm">HIN Sopheap</p>
              <p className="text-brand-muted text-xs">Co-Founder & Chairman, Cambodia AI Group</p>
            </div>
            {/* Share row */}
            <div className="ml-auto flex gap-2">
              {[
                { id: 'twitter', icon: '𝕏', label: 'X' },
                { id: 'linkedin', icon: <Linkedin size={14} />, label: 'LinkedIn' },
                { id: 'telegram', icon: <MessageCircle size={14} />, label: 'Telegram' },
                { id: 'copy', icon: <Link2 size={14} />, label: 'Copy' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => share(s.id)}
                  className="w-8 h-8 bg-brand-card border border-brand-border rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors text-xs"
                  title={`Share on ${s.label}`}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div ref={articleRef} className="max-w-4xl mx-auto px-6 py-12">
        {/* AI Frontier Brief structured sections */}
        {isAFB && (post.theSignal || post.cambodiaLens || post.oneThingToTry) ? (
          <div className="space-y-6 mb-10">
            {(lang === 'kh' ? post.theSignal_kh : post.theSignal) && (
              <div className="bg-brand-gold/5 border border-brand-gold/30 rounded-xl p-6">
                <p className="text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold inline-block" /> The Signal
                </p>
                <p className="text-brand-cream leading-relaxed">
                  {lang === 'kh' ? post.theSignal_kh : post.theSignal}
                </p>
              </div>
            )}
            {(lang === 'kh' ? post.cambodiaLens_kh : post.cambodiaLens) && (
              <div className="bg-blue-500/5 border border-blue-500/30 rounded-xl p-6">
                <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Cambodia Lens
                </p>
                <p className="text-brand-cream leading-relaxed">
                  {lang === 'kh' ? post.cambodiaLens_kh : post.cambodiaLens}
                </p>
              </div>
            )}
            {(lang === 'kh' ? post.oneThingToTry_kh : post.oneThingToTry) && (
              <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-6">
                <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> One Thing to Try
                </p>
                <p className="text-brand-cream leading-relaxed">
                  {lang === 'kh' ? post.oneThingToTry_kh : post.oneThingToTry}
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Main body */}
        {body && (
          <div
            className={cn('prose prose-invert prose-lg max-w-none', lang === 'kh' && 'font-khmer')}
            style={{ fontFamily: lang === 'kh' ? 'var(--font-kantumruy)' : 'var(--font-source-serif)' }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-brand-border mt-8">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h3 className="font-display text-2xl font-bold text-brand-cream mb-8">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(r => <ArticleCard key={r.id} post={r} />)}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
