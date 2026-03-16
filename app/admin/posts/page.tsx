'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deletePost } from '@/lib/db';
import { formatDate, CATEGORY_LABELS } from '@/lib/utils';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Post } from '@/types';

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const q = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'));
    const snap = await getDocs(q);
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePost(id);
    toast.success('Post deleted');
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-cream">Posts</h1>
          <p className="text-brand-muted text-sm mt-1">{posts.length} articles</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <Plus size={16} /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="text-brand-muted font-mono text-sm">Loading...</div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {['Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left text-brand-muted text-xs font-mono uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(p => {
                const cat = CATEGORY_LABELS[p.category];
                return (
                  <tr key={p.id} className="border-b border-brand-border/50 hover:bg-brand-border/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {p.featured && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />}
                        <p className="text-brand-cream text-sm font-medium truncate max-w-xs">{p.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-mono px-2 py-1 rounded"
                        style={{ background: cat.color + '22', color: cat.color }}
                      >
                        {cat.en}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {p.published
                          ? <><Eye size={12} className="text-emerald-400" /><span className="text-emerald-400 text-xs font-mono">Published</span></>
                          : <><EyeOff size={12} className="text-brand-muted" /><span className="text-brand-muted text-xs font-mono">Draft</span></>
                        }
                      </div>
                    </td>
                    <td className="px-5 py-4 text-brand-muted text-sm font-mono">{p.viewCount || 0}</td>
                    <td className="px-5 py-4 text-brand-muted text-xs">{formatDate(p.publishedAt as Date)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/posts/${p.id}`} className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 text-brand-muted hover:text-brand-red transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
