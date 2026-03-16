'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Sparkles, ExternalLink, Loader, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import type { AINews } from '@/types';

export default function AdminAINews() {
  const [news, setNews] = useState<AINews[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-news');
      const data = await res.json();
      setNews(data.news || []);
    } catch {
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const generateDraft = async (item: AINews) => {
    setGenerating(item.url);
    try {
      const res = await fetch('/api/ai-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: item.title, description: item.description, url: item.url }),
      });
      const data = await res.json();
      if (data.draft) {
        sessionStorage.setItem('ai_draft', JSON.stringify(data.draft));
        window.open('/admin/posts/new', '_blank');
        toast.success('Draft generated! Opening editor...');
      }
    } catch {
      toast.error('Draft generation failed');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-cream">AI News Feed</h1>
          <p className="text-brand-muted text-sm mt-1">Latest AI headlines — use as writing inspiration</p>
        </div>
        <button onClick={fetchNews} disabled={loading} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-brand-muted font-mono text-sm">Fetching AI news...</div>
      ) : (
        <div className="space-y-4">
          {news.map((item, i) => (
            <div key={i} className="bg-brand-card border border-brand-border rounded-xl p-5 hover:border-brand-gold/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-brand-gold text-xs font-mono">{item.source}</span>
                    <span className="text-brand-muted text-xs">{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-brand-cream font-semibold text-sm leading-snug mb-2">{item.title}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed line-clamp-2">{item.description}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="p-2 text-brand-muted hover:text-brand-cream transition-colors">
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => generateDraft(item)}
                    disabled={generating === item.url}
                    className="flex items-center gap-1 text-brand-gold text-xs font-mono px-2 py-1 border border-brand-gold/30 rounded hover:border-brand-gold transition-colors"
                  >
                    {generating === item.url ? <Loader size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    Draft
                  </button>
                </div>
              </div>
            </div>
          ))}
          {news.length === 0 && (
            <div className="text-center py-16 text-brand-muted">
              <Newspaper size={32} className="mx-auto mb-3 opacity-30" />
              <p>No news yet. Click Refresh to load headlines.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
