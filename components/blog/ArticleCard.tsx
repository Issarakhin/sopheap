'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate, CATEGORY_LABELS, cn } from '@/lib/utils';
import { useLang } from '@/lib/lang-context';
import type { Post } from '@/types';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export default function ArticleCard({ post, featured }: ArticleCardProps) {
  const { lang, t } = useLang();
  const title = lang === 'kh' && post.title_kh ? post.title_kh : post.title;
  const excerpt = lang === 'kh' && post.excerpt_kh ? post.excerpt_kh : post.excerpt;
  const cat = CATEGORY_LABELS[post.category];

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative group bg-brand-card border border-brand-border rounded-2xl overflow-hidden card-hover"
      >
        <Link href={`/blog/${post.slug}`}>
          <div className="grid md:grid-cols-2 gap-0">
            {post.coverImage && (
              <div className="relative h-64 md:h-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-card/80" />
              </div>
            )}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="category-badge"
                    style={{ background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}
                  >
                    {lang === 'kh' ? cat.kh : cat.en}
                  </span>
                  <span className="text-brand-gold text-xs font-mono uppercase tracking-wider">
                    {t('blog.featured')}
                  </span>
                </div>
                <h2 className={cn(
                  'font-display text-2xl md:text-3xl font-bold text-brand-cream mb-4 leading-tight',
                  lang === 'kh' && 'font-khmer'
                )}>
                  {title}
                </h2>
                <p className="text-brand-muted leading-relaxed text-sm md:text-base line-clamp-3">
                  {excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-bold">
                    HS
                  </div>
                  <div>
                    <p className="text-brand-cream text-xs font-mono">HIN Sopheap</p>
                    <p className="text-brand-muted text-xs">{formatDate(post.publishedAt as Date)}</p>
                  </div>
                </div>
                <span className="text-brand-gold text-sm font-mono group-hover:translate-x-1 transition-transform inline-block">
                  {t('blog.readMore')}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden card-hover h-full flex flex-col"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="category-badge text-xs"
              style={{ background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}
            >
              {lang === 'kh' ? cat.kh : cat.en}
            </span>
            <span className="text-brand-muted text-xs font-mono">{post.readTime}</span>
          </div>
          <h3 className={cn(
            'font-display text-lg font-bold text-brand-cream mb-2 leading-tight line-clamp-2 flex-1',
            lang === 'kh' && 'font-khmer'
          )}>
            {title}
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border">
            <span className="text-brand-muted text-xs">{formatDate(post.publishedAt as Date)}</span>
            <span className="text-brand-gold text-sm font-mono group-hover:translate-x-1 transition-transform inline-block">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
