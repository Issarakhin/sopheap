'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDate } from '@/lib/utils';
import { Mail } from 'lucide-react';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'subscribers')).then(snap => {
      setSubscribers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-cream">Subscribers</h1>
        <p className="text-brand-muted text-sm mt-1">{subscribers.length} subscribers</p>
      </div>
      {loading ? (
        <div className="text-brand-muted font-mono text-sm">Loading...</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-20 text-brand-muted">
          <Mail size={32} className="mx-auto mb-3 opacity-30" />
          <p>No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {['Email', 'Language', 'Subscribed'].map(h => (
                  <th key={h} className="text-left text-brand-muted text-xs font-mono uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map(s => (
                <tr key={s.id} className="border-b border-brand-border/50 hover:bg-brand-border/20 transition-colors">
                  <td className="px-5 py-4 text-brand-cream text-sm">{s.email}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-brand-border text-brand-muted uppercase">{s.language || 'en'}</span>
                  </td>
                  <td className="px-5 py-4 text-brand-muted text-xs">
                    {s.subscribedAt ? formatDate(s.subscribedAt.toDate?.() || new Date()) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
