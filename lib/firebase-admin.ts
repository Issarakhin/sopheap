import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function createApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY missing');
  }

  let cred;
  try {
    cred = JSON.parse(key);
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON');
  }

  if (!cred.private_key || typeof cred.private_key !== 'string') {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY missing private_key');
  }

  if (!cred.client_email || typeof cred.client_email !== 'string') {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY missing client_email');
  }

  return initializeApp({
    credential: cert({
      ...cred,
      private_key: cred.private_key.replace(/\\n/g, '\n'),
    }),
  });
}

export function initAdmin() {
  return createApp();
}

export function adminDb() {
  return getFirestore(createApp());
}

export function adminAuth() {
  return getAuth(createApp());
}
