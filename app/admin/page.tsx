'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Eye, Users, MessageSquare, Inbox, TrendingUp } from 'lucide-react';

interface Stats {
  today: number;
  week: number;
  month: number;
  year: number;
  totalUsers: number;
  newInquiries: number;
  dailyViews: Record<string, number>;
  monthlyViews: Record<string, number>;
  pageBreakdown: Record<string, number>;
  topPosts: { id: string; title: string; views: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const dailyData = stats
    ? Object.entries(stats.dailyViews)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([date, views]) => ({ date: date.slice(5), views }))
    : [];

  const monthlyData = stats
    ? Object.entries(stats.monthlyViews)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([month, views]) => ({ month, views }))
    : [];

  const STAT_CARDS = stats ? [
    { label: 'Views Today', value: stats.today, icon: Eye, color: '#C9A84C' },
    { label: 'Views This Week', value: stats.week, icon: TrendingUp, color: '#3B82F6' },
    { label: 'Views This Month', value: stats.month, icon: Eye, color: '#10B981' },
    { label: 'Views This Year', value: stats.year, icon: Eye, color: '#8B5CF6' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#F59E0B' },
    { label: 'New Inquiries', value: stats.newInquiries, icon: Inbox, color: '#EF4444' },
  ] : [];

  const tooltipStyle = {
    backgroundColor: '#111318',
    border: '1px solid #1E2128',
    borderRadius: '8px',
    color: '#F5F0E8',
    fontFamily: 'var(--font-dm-mono)',
    fontSize: '12px',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-cream">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">Analytics overview for SOPHEAP.AI</p>
      </div>

      {loading ? (
        <div className="text-brand-muted font-mono text-sm">Loading analytics...</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="bg-brand-card border border-brand-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-brand-muted text-xs font-mono uppercase tracking-wider">{s.label}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.color + '20' }}>
                    <s.icon size={14} style={{ color: s.color }} />
                  </div>
                </div>
                <p className="font-display text-3xl font-bold text-brand-cream">{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h3 className="text-brand-cream font-semibold mb-6">Daily Views (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2128" />
                  <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="views" stroke="#C9A84C" fill="url(#viewsGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h3 className="text-brand-cream font-semibold mb-6">Monthly Views (Last 12 Months)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2128" />
                  <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="views" fill="#C9A84C" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Posts */}
          {stats?.topPosts && stats.topPosts.length > 0 && (
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h3 className="text-brand-cream font-semibold mb-4">Most Viewed Articles</h3>
              <div className="space-y-3">
                {stats.topPosts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <span className="text-brand-gold font-mono text-sm w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-cream text-sm truncate">{p.title}</p>
                    </div>
                    <span className="text-brand-muted font-mono text-xs">{p.views.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
