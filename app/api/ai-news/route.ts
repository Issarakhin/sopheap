export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const RSS_FEEDS = [
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
];

async function fetchRSS(url: string) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    });
    const xml = await res.text();
    const items: any[] = [];
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const item = match[1];
      const get = (tag: string) => {
        const m = item.match(
          new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`)
        );
        return m ? (m[1] || m[2] || '').trim() : '';
      };
      const title = get('title');
      if (title) {
        items.push({
          title,
          description: get('description').replace(/<[^>]+>/g, '').slice(0, 200),
          url: get('link') || get('guid'),
          source: new URL(url).hostname.replace('www.', ''),
          publishedAt: get('pubDate'),
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    // Try Firebase cache first
    let cached = null;
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      const db = adminDb();
      const cacheDoc = await db.doc('aiNewsCache/latest').get();
      if (cacheDoc.exists) {
        const data = cacheDoc.data()!;
        const age = Date.now() - (data.fetchedAt?.toMillis() ?? 0);
        if (age < 3 * 60 * 60 * 1000) {
          return NextResponse.json({ news: data.news, cached: true });
        }
      }
    } catch {}

    // Fetch RSS
    const results = await Promise.all(RSS_FEEDS.map(fetchRSS));
    const news = results.flat().filter(n => n.title).slice(0, 15);

    // Save to cache
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      const { FieldValue } = await import('firebase-admin/firestore');
      const db = adminDb();
      await db.doc('aiNewsCache/latest').set({
        news,
        fetchedAt: FieldValue.serverTimestamp(),
      });
    } catch {}

    return NextResponse.json({ news });
  } catch (err: any) {
    return NextResponse.json({ news: [], error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, url } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are HIN Sopheap writing an AI Frontier Brief. Return JSON only: { title, excerpt, theSignal, cambodiaLens, oneThingToTry, tags }' },
        { role: 'user', content: `Write an AI Frontier Brief based on:\nTitle: ${title}\nSummary: ${description}\nFocus on Cambodia. Return ONLY valid JSON.` },
      ],
      temperature: 0.8,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    });
    const draft = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json({ draft });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
