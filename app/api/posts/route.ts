export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import slugify from 'slugify';

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1];
  if (!token) throw new Error('Unauthorized');
  const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
  const decoded = await adminAuth().verifyIdToken(token);
  const user = await adminDb().doc(`users/${decoded.uid}`).get();
  if (user.data()?.role !== 'admin') throw new Error('Forbidden');
  return decoded;
}

export async function GET(req: NextRequest) {
  try {
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const all = searchParams.get('all');

    let q = db.collection('posts').orderBy('publishedAt', 'desc') as any;
    if (!all) q = q.where('published', '==', true);
    if (category) q = q.where('category', '==', category);

    const snap = await q.get();
    const posts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdmin(req);
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();
    const data = await req.json();
    const slug = slugify(data.title, { lower: true, strict: true });
    const ref = await db.collection('posts').add({
      ...data,
      slug,
      viewCount: 0,
      publishedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: ref.id, slug });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await verifyAdmin(req);
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();
    const data = await req.json();
    const { id, ...updates } = data;
    await db.doc(`posts/${id}`).update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await verifyAdmin(req);
    const { adminDb } = await import('@/lib/firebase-admin');
    const db = adminDb();
    const { id } = await req.json();
    await db.doc(`posts/${id}`).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
