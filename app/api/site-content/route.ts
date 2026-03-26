import { NextRequest, NextResponse } from 'next/server';
import { mergeSiteContent } from '@/lib/site-content';

async function getAdminDb() {
  const { adminDb } = await import('@/lib/firebase-admin');
  return adminDb();
}

async function getAdminAuth() {
  const { adminAuth } = await import('@/lib/firebase-admin');
  return adminAuth();
}

export async function GET() {
  try {
    const db = await getAdminDb();
    const snap = await db.collection('siteContent').doc('main').get();
    const stored = snap.exists ? snap.data() ?? null : null;
    return NextResponse.json(mergeSiteContent(stored as any));
  } catch (err) {
    console.error('[site-content GET]', err);
    return NextResponse.json(mergeSiteContent(null));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }

    const auth = await getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    const db = await getAdminDb();
    const userSnap = await db.collection('users').doc(decoded.uid).get();
    const role = userSnap.exists ? (userSnap.data() as any)?.role : null;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 });
    }

    const body = await req.json();
    // Remove server-managed fields
    const { updatedAt, updatedBy, ...content } = body;

    await db.collection('siteContent').doc('main').set(
      { ...content, updatedAt: new Date(), updatedBy: decoded.uid },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[site-content PUT]', err);
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
