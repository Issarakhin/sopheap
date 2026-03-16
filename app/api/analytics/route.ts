export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { page, userId, sessionId, articleId } = await req.json();
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();
    await db.collection('analytics').doc('pageViews').collection('events').add({
      page, userId: userId || null, sessionId,
      articleId: articleId || null,
      timestamp: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
