'use client';

import { useEffect, useState } from 'react';
import { getInquiries } from '@/lib/db';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDate } from '@/lib/utils';
import { Mail, MessageCircle, Check } from 'lucide-react';
import type { Inquiry } from '@/types';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<(Inquiry & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInquiries().then(data => { setInquiries(data); setLoading(false); });
  }, []);

  const markRead = async (id: string) => {
    await updateDoc(doc(db, 'inquiries', id), { status: 'responded' });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: 'responded' } : i));
  };

  const STATUS_COLORS = { new: '#EF4444', read: '#F59E0B', responded: '#10B981' };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-cream">Inquiries</h1>
        <p className="text-brand-muted text-sm mt-1">{inquiries.filter(i => i.status === 'new').length} new</p>
      </div>
      {loading ? (
        <div className="text-brand-muted font-mono text-sm">Loading...</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div key={inq.id} className={`bg-brand-card border rounded-xl p-6 ${inq.status === 'new' ? 'border-brand-red/40' : 'border-brand-border'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-brand-cream font-semibold">{inq.name}</span>
                    {inq.organization && <span className="text-brand-muted text-sm">· {inq.organization}</span>}
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-full"
                      style={{ background: (STATUS_COLORS as any)[inq.status] + '22', color: (STATUS_COLORS as any)[inq.status] }}
                    >
                      {inq.status}
                    </span>
                    {inq.service && (
                      <span className="text-brand-gold text-xs font-mono bg-brand-gold/10 px-2 py-0.5 rounded">{inq.service}</span>
                    )}
                  </div>
                  <p className="text-brand-cream text-sm leading-relaxed mb-3">{inq.message}</p>
                  <p className="text-brand-muted text-xs">{formatDate(inq.submittedAt as Date)}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 text-brand-gold text-xs font-mono hover:text-brand-gold-light px-3 py-1.5 border border-brand-gold/30 rounded-lg transition-colors">
                    <Mail size={12} /> {inq.email}
                  </a>
                  <a href="https://t.me/+85595666788" target="_blank" className="flex items-center gap-1.5 text-blue-400 text-xs font-mono px-3 py-1.5 border border-blue-400/30 rounded-lg transition-colors hover:border-blue-400">
                    <MessageCircle size={12} /> Telegram
                  </a>
                  {inq.status !== 'responded' && (
                    <button onClick={() => markRead(inq.id!)} className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono px-3 py-1.5 border border-emerald-400/30 rounded-lg transition-colors hover:border-emerald-400">
                      <Check size={12} /> Mark Responded
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {inquiries.length === 0 && (
            <div className="text-center py-20 text-brand-muted">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              <p>No inquiries yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
