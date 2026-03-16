import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { page, userId, sessionId, articleId } = await req.json();

    await adminDb.collection('analytics').doc('pageViews').collection('events').add({
      page,
      userId: userId || null,
      sessionId,
      articleId: articleId || null,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const eventsRef = adminDb.collection('analytics').doc('pageViews').collection('events');

    const [todaySnap, weekSnap, monthSnap, yearSnap, totalUsersSnap, inquiriesSnap] = await Promise.all([
      eventsRef.where('timestamp', '>=', Timestamp.fromDate(todayStart)).get(),
      eventsRef.where('timestamp', '>=', Timestamp.fromDate(weekStart)).get(),
      eventsRef.where('timestamp', '>=', Timestamp.fromDate(monthStart)).get(),
      eventsRef.where('timestamp', '>=', Timestamp.fromDate(yearStart)).get(),
      adminDb.collection('users').get(),
      adminDb.collection('inquiries').where('status', '==', 'new').get(),
    ]);

    // Daily breakdown (last 30 days)
    const dailyMap: Record<string, number> = {};
    monthSnap.docs.forEach(d => {
      const ts = d.data().timestamp?.toDate();
      if (ts) {
        const key = ts.toISOString().split('T')[0];
        dailyMap[key] = (dailyMap[key] || 0) + 1;
      }
    });

    // Monthly breakdown (last 12 months)
    const monthlyMap: Record<string, number> = {};
    yearSnap.docs.forEach(d => {
      const ts = d.data().timestamp?.toDate();
      if (ts) {
        const key = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      }
    });

    // Page breakdown
    const pageMap: Record<string, number> = {};
    monthSnap.docs.forEach(d => {
      const page = d.data().page || 'unknown';
      pageMap[page] = (pageMap[page] || 0) + 1;
    });

    // Most viewed posts
    const postsSnap = await adminDb.collection('posts').orderBy('viewCount', 'desc').limit(5).get();
    const topPosts = postsSnap.docs.map(d => ({ id: d.id, title: d.data().title, views: d.data().viewCount }));

    return NextResponse.json({
      today: todaySnap.size,
      week: weekSnap.size,
      month: monthSnap.size,
      year: yearSnap.size,
      totalUsers: totalUsersSnap.size,
      newInquiries: inquiriesSnap.size,
      dailyViews: dailyMap,
      monthlyViews: monthlyMap,
      pageBreakdown: pageMap,
      topPosts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
