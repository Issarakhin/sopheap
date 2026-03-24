import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { mergeSiteContent } from '@/lib/site-content';

// GET — returns merged content (defaults + stored overrides)
export async function GET() {
  try {
    const app = initAdmin();
    const db = getFirestore(app);
    const snap = await db.collection('siteContent').doc('main').get();
    const stored = snap.exists ? snap.data() : null;
    return NextResponse.json(mergeSiteContent(stored as any));
  } catch (err) {
    console.error('site-content GET error:', err);
    // Return defaults on error so the site never breaks
    return NextResponse.json(mergeSiteContent(null));
  }
}

// PUT — saves updated content (admin only)
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const app = initAdmin();
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Verify the token and check admin claim
    const decoded = await auth.verifyIdToken(token);
    const userRecord = await auth.getUser(decoded.uid);
    const isAdmin =
      (userRecord.customClaims as any)?.admin === true ||
      (userRecord.customClaims as any)?.role === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    // Strip server-managed fields from the payload
    const { updatedAt, updatedBy, ...content } = body;

    await db.collection('siteContent').doc('main').set(
      {
        ...content,
        updatedAt: new Date(),
        updatedBy: decoded.uid,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('site-content PUT error:', err);
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 });
  }
}
