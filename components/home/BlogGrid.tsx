'use client';

import { useEffect, useState } from 'react';
import { getPosts } from '@/lib/db';
import ArticleCard from '@/components/blog/ArticleCard';
import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Post, PostCategory } from '@/types';

const CATS: { key: 'all' | PostCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai-frontier-brief', label: 'AI Frontier Brief' },
  { key: 'the-long-view', label: 'The Long View' },
  { key: 'thought-leadership', label: 'Thought Leadership' },
];

export default function BlogGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [active, setActive] = useState<'all' | PostCategory>('all');
  const { t } = useLang();

  useEffect(() => {
    getPosts({ limit: 9 }).then(setPosts);
  }, []);

  const filtered = active === 'all' ? posts : posts.filter(p => p.category === active);

  return (
    <section className="max-w-7xl mx-auto px-6 pb-16">
      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        {CATS.map(c => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`text-xs font-mono px-4 py-2 rounded-full border transition-all ${
              active === c.key
                ? 'bg-brand-gold text-brand-bg border-brand-gold'
                : 'border-brand-border text-brand-muted hover:border-brand-gold/40 hover:text-brand-cream'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(post => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {/* View all */}
      <div className="text-center mt-12">
        <Link href="/blog" className="btn-ghost">
          {t('blog.viewAll')}
        </Link>
      </div>
    </section>
  );
}
