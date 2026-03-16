import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  try {
    // Check cache (3hr TTL)
    const cacheDoc = await adminDb.doc('aiNewsCache/latest').get();
    if (cacheDoc.exists) {
      const cached = cacheDoc.data()!;
      const age = Date.now() - cached.fetchedAt?.toMillis();
      if (age < 3 * 60 * 60 * 1000) {
        return NextResponse.json({ news: cached.news, cached: true });
      }
    }

    // Fetch from NewsAPI
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'NEWS_API_KEY not set' }, { status: 500 });

    const url = `https://newsapi.org/v2/everything?q=artificial+intelligence&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    const news = (data.articles || []).map((a: any) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source?.name,
      publishedAt: a.publishedAt,
    }));

    // Cache to Firebase
    await adminDb.doc('aiNewsCache/latest').set({
      news,
      fetchedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ news });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Generate a draft post from a news item
  try {
    const { title, description, url } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are HIN Sopheap, Co-Founder of Cambodia AI Group, writing in your editorial voice: 
          analytical, authoritative, and deeply rooted in Cambodia's AI context. 
          Write an AI Frontier Brief post with three sections: The Signal, Cambodia Lens, One Thing to Try.
          Return as JSON: { title, excerpt, theSignal, cambodiaLens, oneThingToTry, tags }`,
        },
        {
          role: 'user',
          content: `Write an AI Frontier Brief based on this news:\n\nTitle: ${title}\nSummary: ${description}\nSource: ${url}\n\nMake it specific to Cambodia's business context. Return ONLY valid JSON.`,
        },
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
