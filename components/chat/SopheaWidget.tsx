'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minimize2, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/lang-context';
import { saveChatSession } from '@/lib/db';
import { cn } from '@/lib/utils';
import type { ChatMessage, ArticleRecommendation } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface MessageWithRecs extends ChatMessage {
  recommendations?: ArticleRecommendation[];
}

export default function SopheaWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<MessageWithRecs[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { lang, t } = useLang();

  const introMessage: MessageWithRecs = {
    role: 'assistant',
    content: lang === 'kh'
      ? 'សួស្ដី! ខ្ញុំគឺ Sophea ជំនួយការ AI របស់ Sopheap។ ខ្ញុំយល់ AI ជ្រៅ — ពីការស្រាវជ្រាវទៅការដាក់ពង្រាយ — ហើយខ្ញុំស្គាល់ប្រតិបត្តិការអាជីវកម្មកម្ពុជាជ្រៅ។ តើអ្នកចង់ដឹងអ្វី?'
      : "Hello! I'm Sophea, Sopheap's AI assistant. I understand AI deeply — from research to real-world deployment — and I know Cambodia's business context well. Whether you're curious about AI, exploring Sopheap's services, or looking for the right reading, I'm here. What's on your mind?",
    timestamp: new Date(),
  };

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([introMessage]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: MessageWithRecs = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userId: user?.uid || null,
          sessionId,
          lang,
        }),
      });

      const data = await res.json();

      // Parse article recommendations from response
      const recRegex = /<recommend>(.*?)<\/recommend>/gs;
      let cleanContent = data.content;
      const recs: ArticleRecommendation[] = [];

      let match;
      while ((match = recRegex.exec(data.content)) !== null) {
        try {
          recs.push(JSON.parse(match[1]));
        } catch {}
        cleanContent = cleanContent.replace(match[0], '');
      }

      const assistantMsg: MessageWithRecs = {
        role: 'assistant',
        content: cleanContent.trim(),
        timestamp: new Date(),
        recommendations: recs.length > 0 ? recs : undefined,
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);

      // Save to Firebase if logged in
      if (user) {
        await saveChatSession(user.uid, {
          sessionId,
          userId: user.uid,
          startedAt: new Date(),
          lastMessageAt: new Date(),
          messages: finalMessages,
          title: finalMessages[1]?.content?.slice(0, 60) || 'Chat session',
        });
      } else {
        // Save to localStorage for guests
        localStorage.setItem(`chat_${sessionId}`, JSON.stringify(finalMessages));
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a moment of difficulty. Please try again, or reach Sopheap directly on Telegram at 095 666 788.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, user, sessionId, lang]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button - large and prominent */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-card border border-brand-gold/40 rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/50 hover:border-brand-gold/70 transition-all duration-300 animate-pulse-gold group"
          >
            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold/30 to-brand-gold/10 border-2 border-brand-gold/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                src="/images/photo_2026-03-16_14-48-32.jpg"
                alt="Sophea"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                }}
              />
              <span className="hidden text-brand-gold font-display font-bold text-lg">S</span>
            </div>
            {/* Text */}
            <div className="text-left">
              <p className="text-brand-cream text-sm font-semibold leading-tight">{t('chat.title')}</p>
              <p className="text-brand-muted text-xs">{t('chat.sub')}</p>
            </div>
            {/* Online indicator */}
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-6rem)] flex flex-col bg-brand-bg border border-brand-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-brand-card border-b border-brand-border flex-shrink-0">
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brand-gold/30 to-brand-gold/10 border-2 border-brand-gold/50 overflow-hidden flex-shrink-0">
                <img
                  src="/images/sophea-avatar.png"
                  alt="Sophea"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-brand-gold font-display font-bold text-base absolute inset-0 flex items-center justify-center">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-brand-cream font-semibold text-sm">{t('chat.title')}</p>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-brand-muted text-xs">{t('chat.sub')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setOpen(false)} className="text-brand-muted hover:text-brand-cream transition-colors p-1">
                  <Minimize2 size={16} />
                </button>
                <button onClick={() => { setOpen(false); setMessages([]); }} className="text-brand-muted hover:text-brand-red transition-colors p-1">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={cn(
                    'flex gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold/30 to-brand-gold/10 border border-brand-gold/40 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                        <img
                          src="/images/sophea-avatar.png"
                          alt="S"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-brand-gold text-brand-bg font-medium rounded-tr-sm'
                        : 'bg-brand-card border border-brand-border text-brand-cream rounded-tl-sm'
                    )}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>

                  {/* Article recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="ml-11 mt-2 space-y-2">
                      {msg.recommendations.map((rec, ri) => (
                        <a
                          key={ri}
                          href={`/blog/${rec.id}`}
                          className="flex items-start gap-3 bg-brand-card/50 border border-brand-gold/20 rounded-xl p-3 hover:border-brand-gold/50 transition-colors group"
                        >
                          <BookOpen size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-brand-cream text-xs font-medium leading-tight group-hover:text-brand-gold transition-colors line-clamp-2">
                              {rec.title}
                            </p>
                            <p className="text-brand-muted text-xs mt-0.5 line-clamp-1">{rec.reason}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-gold text-xs font-bold">S</span>
                  </div>
                  <div className="bg-brand-card border border-brand-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-brand-gold/60 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0">
              {[
                lang === 'kh' ? 'AI Agent គឺជាអ្វី?' : 'What is an AI Agent?',
                lang === 'kh' ? 'សេវាកម្មរបស់ Sopheap' : 'Sopheap\'s services',
                lang === 'kh' ? 'ទំនាក់ទំនង Sopheap' : 'Contact Sopheap',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); setTimeout(() => sendMessage(), 10); }}
                  className="flex-shrink-0 text-xs bg-brand-card border border-brand-border text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 px-3 py-1.5 rounded-full transition-colors font-mono"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 flex-shrink-0">
              <div className="flex gap-2 bg-brand-card border border-brand-border rounded-xl overflow-hidden focus-within:border-brand-gold/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chat.placeholder')}
                  rows={1}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-brand-cream placeholder:text-brand-muted resize-none focus:outline-none max-h-24"
                  style={{ fontFamily: 'var(--font-source-serif)' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="px-3 text-brand-gold hover:text-brand-gold-light disabled:text-brand-border transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
