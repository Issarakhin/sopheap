export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { page, userId, sessionId, articleId } = await req.json();
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();
    await db.collection('analytics').doc('pageViews').collection('events').add({
      page,
      userId: userId || null,
      sessionId,
      articleId: articleId || null,
      timestamp: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const eventsRef = db.collection('analytics').doc('pageViews').collection('events');

    const [todaySnap, weekSnap, monthSnap, yearSnap, totalUsersSnap, inquiriesSnap] =
      await Promise.all([
        eventsRef.where('timestamp', '>=', Timestamp.fromDate(todayStart)).get(),
        eventsRef.where('timestamp', '>=', Timestamp.fromDate(weekStart)).get(),
        eventsRef.where('timestamp', '>=', Timestamp.fromDate(monthStart)).get(),
        eventsRef.where('timestamp', '>=', Timestamp.fromDate(yearStart)).get(),
        db.collection('users').get(),
        db.collection('inquiries').where('status', '==', 'new').get(),
      ]);

    // Daily breakdown (last 30 days)
    const dailyViews: Record<string, number> = {};
    monthSnap.docs.forEach(d => {
      const ts = d.data().timestamp?.toDate();
      if (ts) {
        const key = ts.toISOString().split('T')[0];
        dailyViews[key] = (dailyViews[key] || 0) + 1;
      }
    });

    // Monthly breakdown (last 12 months)
    const monthlyViews: Record<string, number> = {};
    yearSnap.docs.forEach(d => {
      const ts = d.data().timestamp?.toDate();
      if (ts) {
        const key = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}`;
        monthlyViews[key] = (monthlyViews[key] || 0) + 1;
      }
    });

    // Page breakdown
    const pageBreakdown: Record<string, number> = {};
    monthSnap.docs.forEach(d => {
      const page = d.data().page || 'unknown';
      pageBreakdown[page] = (pageBreakdown[page] || 0) + 1;
    });

    // Top posts
    const postsSnap = await db.collection('posts').orderBy('viewCount', 'desc').limit(5).get();
    const topPosts = postsSnap.docs.map(d => ({
      id: d.id,
      title: d.data().title,
      views: d.data().viewCount || 0,
    }));

    return NextResponse.json({
      today: todaySnap.size,
      week: weekSnap.size,
      month: monthSnap.size,
      year: yearSnap.size,
      totalUsers: totalUsersSnap.size,
      newInquiries: inquiriesSnap.size,
      dailyViews,
      monthlyViews,
      pageBreakdown,
      topPosts,
    });
  } catch (err: any) {
    console.error('Analytics GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
