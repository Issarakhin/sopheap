import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, increment, serverTimestamp,
  onSnapshot, Timestamp, setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post, UserProfile, Inquiry, ChatSession, Subscriber } from '@/types';

// ─── POSTS ────────────────────────────────────────────────────────────────────

export async function getPosts(opts?: { category?: string; limit?: number; featured?: boolean }) {
  let q = query(collection(db, 'posts'), where('published', '==', true), orderBy('publishedAt', 'desc'));
  if (opts?.category) q = query(q, where('category', '==', opts.category));
  if (opts?.featured !== undefined) q = query(q, where('featured', '==', opts.featured));
  if (opts?.limit) q = query(q, limit(opts.limit));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Post;
}

export async function getPostById(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, 'posts', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Post;
}

export async function createPost(data: Omit<Post, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'posts'), {
    ...data,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    viewCount: 0,
  });
  return ref.id;
}

export async function updatePost(id: string, data: Partial<Post>) {
  await updateDoc(doc(db, 'posts', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db, 'posts', id));
}

export async function incrementViewCount(id: string) {
  await updateDoc(doc(db, 'posts', id), { viewCount: increment(1) });
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), {
    uid,
    language: 'en',
    savedArticles: [],
    role: 'user',
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
    ...data,
  }, { merge: true });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), { ...data, lastSeen: serverTimestamp() });
}

// ─── CHAT HISTORY ─────────────────────────────────────────────────────────────

export async function saveChatSession(userId: string, session: ChatSession) {
  const ref = doc(db, 'chatHistory', userId, 'sessions', session.sessionId);
  await setDoc(ref, { ...session, lastMessageAt: serverTimestamp() }, { merge: true });
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const q = query(
    collection(db, 'chatHistory', userId, 'sessions'),
    orderBy('lastMessageAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ChatSession);
}

// ─── INQUIRIES ────────────────────────────────────────────────────────────────

export async function saveInquiry(data: Omit<Inquiry, 'id' | 'submittedAt' | 'status'>) {
  return addDoc(collection(db, 'inquiries'), {
    ...data,
    status: 'new',
    submittedAt: serverTimestamp(),
  });
}

export async function getInquiries(): Promise<(Inquiry & { id: string })[]> {
  const q = query(collection(db, 'inquiries'), orderBy('submittedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry & { id: string }));
}

// ─── SUBSCRIBERS ──────────────────────────────────────────────────────────────

export async function addSubscriber(email: string, language: 'en' | 'kh' = 'en') {
  await setDoc(doc(db, 'subscribers', email), {
    email,
    language,
    subscribedAt: serverTimestamp(),
  });
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

export async function logPageView(page: string, userId: string | null, sessionId: string, articleId?: string) {
  await addDoc(collection(db, 'analytics', 'pageViews', 'events'), {
    page,
    userId,
    sessionId,
    articleId: articleId || null,
    timestamp: serverTimestamp(),
  });
}

export async function getAnalyticsSummary() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const eventsRef = collection(db, 'analytics', 'pageViews', 'events');

  const [todaySnap, weekSnap, monthSnap, yearSnap] = await Promise.all([
    getDocs(query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(todayStart)))),
    getDocs(query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(weekStart)))),
    getDocs(query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(monthStart)))),
    getDocs(query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(yearStart)))),
  ]);

  return {
    today: todaySnap.size,
    week: weekSnap.size,
    month: monthSnap.size,
    year: yearSnap.size,
  };
}

// ─── AI RULES ─────────────────────────────────────────────────────────────────

export async function getAIRules(): Promise<string> {
  const snap = await getDoc(doc(db, 'aiRules', 'current'));
  return snap.exists() ? snap.data().systemPrompt : '';
}

export async function updateAIRules(systemPrompt: string, updatedBy: string) {
  // Save version history
  const current = await getDoc(doc(db, 'aiRules', 'current'));
  if (current.exists()) {
    await addDoc(collection(db, 'aiRules', 'current', 'versions'), {
      ...current.data(),
      savedAt: serverTimestamp(),
    });
  }
  await setDoc(doc(db, 'aiRules', 'current'), {
    systemPrompt,
    updatedAt: serverTimestamp(),
    updatedBy,
  });
}
