import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import slugify from 'slugify';

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1];
  if (!token) throw new Error('Unauthorized');
  const decoded = await adminAuth.verifyIdToken(token);
  const user = await adminDb.doc(`users/${decoded.uid}`).get();
  if (user.data()?.role !== 'admin') throw new Error('Forbidden');
  return decoded;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const all = searchParams.get('all'); // admin: get all including drafts

    let q = adminDb.collection('posts').orderBy('publishedAt', 'desc');
    if (!all) q = q.where('published', '==', true) as any;
    if (category) q = q.where('category', '==', category) as any;

    const snap = await q.get();
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdmin(req);
    const data = await req.json();

    const slug = slugify(data.title, { lower: true, strict: true });
    const post = {
      ...data,
      slug,
      viewCount: 0,
      publishedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const ref = await adminDb.collection('posts').add(post);
    return NextResponse.json({ id: ref.id, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await verifyAdmin(req);
    const data = await req.json();
    const { id, ...updates } = data;

    await adminDb.doc(`posts/${id}`).update({
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
    const { id } = await req.json();
    await adminDb.doc(`posts/${id}`).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
