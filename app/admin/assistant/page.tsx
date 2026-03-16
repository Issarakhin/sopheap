'use client';

import { useEffect, useState } from 'react';
import { getAIRules, updateAIRules } from '@/lib/db';
import { useAuth } from '@/lib/auth-context';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/utils';
import { Save, RotateCcw, Newspaper, Sparkles, Loader, ExternalLink, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { AINews } from '@/types';

export default function AdminAssistant() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const [news, setNews] = useState<AINews[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [testing, setTesting] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [tab, setTab] = useState<'prompt' | 'news'>('prompt');

  useEffect(() => {
    getAIRules().then(p => setPrompt(p || DEFAULT_SYSTEM_PROMPT));
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/ai-news');
      const data = await res.json();
      setNews(data.news || []);
    } catch {
      toast.error('Failed to fetch news');
    } finally {
      setNewsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateAIRules(prompt, user.uid);
      toast.success('System prompt updated!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testInput) return;
    setTesting(true);
    setTestOutput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: testInput }],
          userId: user?.uid,
          sessionId: 'admin-test',
        }),
      });
      const data = await res.json();
      setTestOutput(data.content || '');
    } catch {
      setTestOutput('Test failed. Check API connection.');
    } finally {
      setTesting(false);
    }
  };

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
        // Store in sessionStorage to pre-fill post editor
        sessionStorage.setItem('ai_draft', JSON.stringify(data.draft));
        window.open('/admin/posts/new?from=ai-draft', '_blank');
        toast.success('Draft generated! Opening post editor...');
      }
    } catch {
      toast.error('Draft generation failed');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-brand-cream">AI Assistant Settings</h1>
        <p className="text-brand-muted text-sm mt-1">Manage Sophea's system prompt and use AI news for writing inspiration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1 mb-6 w-fit">
        {[
          { key: 'prompt', label: 'System Prompt', icon: Sparkles },
          { key: 'news', label: 'AI News Feed', icon: Newspaper },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'prompt' | 'news')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors',
              tab === t.key ? 'bg-brand-gold text-brand-bg font-semibold' : 'text-brand-muted hover:text-brand-cream'
            )}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'prompt' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Prompt editor */}
          <div className="space-y-4">
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-brand-cream font-semibold">Sophea's System Prompt</h3>
                <button onClick={() => setPrompt(DEFAULT_SYSTEM_PROMPT)} className="text-brand-muted hover:text-brand-gold text-xs font-mono flex items-center gap-1">
                  <RotateCcw size={12} /> Reset to default
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={24}
                className="input-base font-mono text-xs resize-none leading-relaxed"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-brand-muted text-xs font-mono">{prompt.length} characters</span>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-sm">
                  {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? 'Saving...' : 'Save Prompt'}
                </button>
              </div>
            </div>
          </div>

          {/* Test panel */}
          <div className="space-y-4">
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <h3 className="text-brand-cream font-semibold mb-4">Test Sophea</h3>
              <textarea
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
                rows={4}
                placeholder="Ask Sophea something to test the current prompt..."
                className="input-base resize-none mb-3"
              />
              <button onClick={handleTest} disabled={testing || !testInput} className="btn-primary py-2 px-4 text-sm w-full justify-center">
                {testing ? <><Loader size={14} className="animate-spin" /> Testing...</> : 'Test Response'}
              </button>
              {testOutput && (
                <div className="mt-4 bg-brand-bg border border-brand-border rounded-xl p-4">
                  <p className="text-brand-gold text-xs font-mono mb-2">SOPHEA RESPONSE:</p>
                  <p className="text-brand-cream text-sm leading-relaxed whitespace-pre-wrap">{testOutput}</p>
                </div>
              )}
            </div>
            <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-5">
              <h4 className="text-brand-gold text-sm font-semibold mb-2">💡 Prompt Tips</h4>
              <ul className="text-brand-muted text-xs space-y-1.5 list-disc list-inside">
                <li>The prompt is loaded from Firebase on each chat request</li>
                <li>Changes take effect immediately on next conversation</li>
                <li>Keep the ARTICLE RECOMMENDATIONS section — it enables article suggestions</li>
                <li>Test after every major change before publishing</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === 'news' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-brand-muted text-sm">Latest AI news — refreshed every 3 hours. Use as writing inspiration.</p>
            <button onClick={fetchNews} disabled={newsLoading} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <RefreshCw size={14} className={newsLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {newsLoading ? (
            <div className="text-brand-muted font-mono text-sm">Fetching latest AI news...</div>
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
                        className="p-2 text-brand-muted hover:text-brand-cream transition-colors" title="Read original">
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => generateDraft(item)}
                        disabled={generating === item.url}
                        className="flex items-center gap-1 text-brand-gold text-xs font-mono hover:text-brand-gold-light px-2 py-1 border border-brand-gold/30 rounded hover:border-brand-gold transition-colors"
                        title="Generate AI Frontier Brief draft"
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
                  <p>No news fetched yet. Click Refresh to load AI headlines.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
