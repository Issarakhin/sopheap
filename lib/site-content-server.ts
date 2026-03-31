// Server-side helper — reads site content from Firestore for use in metadata
// Place this at: lib/site-content-server.ts
 
import { adminDb } from '@/lib/firebase-admin';
import { mergeSiteContent, type SiteContent } from '@/lib/site-content';
 
export async function getFirestoreSiteContent(): Promise<SiteContent> {
  try {
    const doc = await adminDb().collection('site').doc('content').get();
    return mergeSiteContent(doc.exists ? (doc.data() as Partial<SiteContent>) : null);
  } catch {
    return mergeSiteContent(null);
  }
}
 
