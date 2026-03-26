import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { mergeSiteContent } from '@/lib/site-content';

export async function GET() {
  try {
    const snap = await adminDb().collection('siteContent').doc('main').get();
    const stored = snap.exists ? snap.data() : null;
    return NextResponse.json(mergeSiteContent(stored as any));
  } catch (err) {
    console.error('site-content GET error:', err);
    return NextResponse.json(mergeSiteContent(null));
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verify Firebase token
    const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth().verifyIdToken(token);

    // Check admin role in Firestore users collection (same as auth-context)
    const userDoc = await adminDb().collection('users').doc(decoded.uid).get();
    const role = userDoc.exists ? (userDoc.data() as any)?.role : null;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { updatedAt, updatedBy, ...content } = body;

    await adminDb().collection('siteContent').doc('main').set(
      { ...content, updatedAt: new Date(), updatedBy: decoded.uid },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('site-content PUT error:', err);
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 });
  }
}
