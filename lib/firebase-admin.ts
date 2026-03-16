import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function initAdmin() {
  if (getApps().length === 0) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}';
    const serviceAccount = JSON.parse(raw.replace(/\\n/g, '\n'));
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

initAdmin();

export const adminDb = getFirestore();
export const adminAuth = getAuth();
