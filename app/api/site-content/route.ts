export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { mergeSiteContent } from '@/lib/site-content';

export async function GET() {
  try {
    const snap = await adminDb().collection('siteContent').doc('main').get();
    const stored = snap.exists ? snap.data() ?? null : null;
    return NextResponse.json(mergeSiteContent(stored as any));
  } catch (err) {
    console.error('[site-content GET]', err);
    return NextResponse.json(mergeSiteContent(null));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = await adminAuth().verifyIdToken(token);

    const userSnap = await adminDb().collection('users').doc(decoded.uid).get();
    const role = userSnap.exists ? (userSnap.data() as any)?.role : null;
    if (role !== 'admin') return NextResponse.json({ error: 'Not admin' }, { status: 403 });

    const { updatedAt, updatedBy, ...content } = await req.json();

    await adminDb().collection('siteContent').doc('main').set(
      { ...content, updatedAt: new Date(), updatedBy: decoded.uid },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[site-content PUT]', err);
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
