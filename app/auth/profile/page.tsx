'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { getChatSessions } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { MessageSquare, BookOpen, LogOut, Settings } from 'lucide-react';
import type { ChatSession } from '@/types';

export default function ProfilePage() {
  const { user, profile, logout, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) getChatSessions(user.uid).then(setSessions);
  }, [user]);

  if (loading || !user) return null;

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile card */}
          <div className="md:col-span-1">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center sticky top-24">
              <div className="w-20 h-20 rounded-full bg-brand-gold/20 border-2 border-brand-gold/40 flex items-center justify-center mx-auto mb-4 text-brand-gold text-2xl font-display font-bold">
                {profile?.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="font-display text-lg font-bold text-brand-cream mb-0.5">{profile?.displayName || 'User'}</h2>
              <p className="text-brand-muted text-sm mb-5">{user.email}</p>
              <div className="space-y-2">
                <button onClick={logout} className="btn-ghost w-full justify-center py-2.5 text-sm">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Chat history */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare size={18} className="text-brand-gold" />
                <h3 className="font-display text-xl font-bold text-brand-cream">Chat History with Sophea</h3>
              </div>
              {sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map(s => (
                    <div key={s.sessionId} className="bg-brand-bg border border-brand-border rounded-xl p-4">
                      <p className="text-brand-cream text-sm font-medium mb-1 line-clamp-1">{s.title}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-brand-muted text-xs">{s.messages.length} messages</p>
                        <p className="text-brand-muted text-xs">{formatDate(s.lastMessageAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-brand-muted">
                  <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No chat sessions yet. Chat with Sophea to save your history.</p>
                </div>
              )}
            </div>

            {/* Saved articles */}
            {profile?.savedArticles && profile.savedArticles.length > 0 && (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen size={18} className="text-brand-gold" />
                  <h3 className="font-display text-xl font-bold text-brand-cream">Saved Articles</h3>
                </div>
                <p className="text-brand-muted text-sm">{profile.savedArticles.length} saved articles</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
