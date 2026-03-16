'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/blog/ArticleCard';
import { getPosts } from '@/lib/db';
import { useLang } from '@/lib/lang-context';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Post, PostCategory } from '@/types';

const CATS = [
  { key: 'all', label: 'All Writing' },
  { key: 'ai-frontier-brief', label: 'AI Frontier Brief' },
  { key: 'the-long-view', label: 'The Long View' },
  { key: 'thought-leadership', label: 'Thought Leadership' },
] as const;

const PER_PAGE = 12;

export default function BlogPage() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const initialCat = (searchParams.get('category') || 'all') as 'all' | PostCategory;

  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<'all' | PostCategory>(initialCat);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPosts({ limit: 50 }).then(setPosts);
  }, []);

  const filtered = posts
    .filter(p => category === 'all' || p.category === category)
    .filter(p => {
      if (!query) return true;
      const q = query.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
    });

  const paginated = filtered.slice(0, page * PER_PAGE);

  return (
    <main className="min-h-screen">
      <Navbar />
      {/* Header */}
      <div className="relative pt-28 pb-16 border-b border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-card to-brand-bg" />
        <div className="relative max-w-7xl mx-auto px-6">
          <span className="text-brand-gold font-mono text-xs uppercase tracking-widest block mb-4">Writing</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-cream mb-4">
            AI Insights.<br /><span className="gold-text">Through a Cambodian Lens.</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-xl">
            Every week, Sopheap distills the AI signals that matter — and what they mean for Cambodia's development.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              className="input-base pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button
                key={c.key}
                onClick={() => { setCategory(c.key as 'all' | PostCategory); setPage(1); }}
                className={cn(
                  'text-xs font-mono px-4 py-2 rounded-full border transition-all',
                  category === c.key
                    ? 'bg-brand-gold text-brand-bg border-brand-gold'
                    : 'border-brand-border text-brand-muted hover:border-brand-gold/40 hover:text-brand-cream'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-brand-muted text-xs font-mono mb-6">{filtered.length} articles</p>

        {/* Grid */}
        {paginated.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(post => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            {paginated.length < filtered.length && (
              <div className="text-center mt-12">
                <button onClick={() => setPage(p => p + 1)} className="btn-ghost">
                  Load More ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 text-brand-muted">
            <p className="font-display text-xl mb-2">No articles found</p>
            <p className="text-sm">Try a different search or category.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
