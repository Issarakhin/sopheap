import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import type { App } from 'firebase-admin/app';

function getApp() {
  if (getApps().length > 0) return getApps()[0];
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY missing');
  const cred = JSON.parse(key.replace(/\\n/g, '\n'));
  return initializeApp({ credential: cert(cred) });
}

export function initAdmin(): App {
  return createApp();
}



export function adminDb() { return getFirestore(getApp()); }
export function adminAuth() { return getAuth(getApp()); }
