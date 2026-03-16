'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDate } from '@/lib/utils';
import { Users } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    getDocs(q).then(snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-cream">Users</h1>
        <p className="text-brand-muted text-sm mt-1">{users.length} registered users</p>
      </div>
      {loading ? (
        <div className="text-brand-muted font-mono text-sm">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-brand-muted">
          <Users size={32} className="mx-auto mb-3 opacity-30" />
          <p>No users yet.</p>
        </div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left text-brand-muted text-xs font-mono uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-brand-border/50 hover:bg-brand-border/20 transition-colors">
                  <td className="px-5 py-4 text-brand-cream text-sm">{u.displayName || '—'}</td>
                  <td className="px-5 py-4 text-brand-muted text-sm">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${u.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-brand-border text-brand-muted'}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-brand-muted text-xs">
                    {u.createdAt ? formatDate(u.createdAt.toDate?.() || new Date()) : '—'}
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
