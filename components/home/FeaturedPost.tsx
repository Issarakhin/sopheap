'use client';

import { useEffect, useState } from 'react';
import { getPosts } from '@/lib/db';
import ArticleCard from '@/components/blog/ArticleCard';
import type { Post } from '@/types';

export default function FeaturedPost() {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    getPosts({ featured: true, limit: 1 }).then(posts => {
      if (posts[0]) setPost(posts[0]);
    });
  }, []);

  if (!post) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-brand-border" />
        <span className="text-brand-gold font-mono text-xs uppercase tracking-widest">Featured</span>
        <div className="h-px flex-1 bg-brand-border" />
      </div>
      <ArticleCard post={post} featured />
    </section>
  );
}
