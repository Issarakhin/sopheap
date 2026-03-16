import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adminDb } from '@/lib/firebase-admin';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/utils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rate limiting (simple in-memory — use Redis/Upstash for production)
const rateLimits = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);
  if (!limit || now > limit.reset) {
    rateLimits.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (limit.count >= 15) return false;
  limit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
  }

  try {
    const { messages, userId, sessionId, lang, articles } = await req.json();

    // Load system prompt from Firebase (with fallback)
    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    try {
      const rulesDoc = await adminDb.doc('aiRules/current').get();
      if (rulesDoc.exists && rulesDoc.data()?.systemPrompt) {
        systemPrompt = rulesDoc.data()!.systemPrompt;
      }
    } catch {}

    // Inject available articles into system prompt
    if (articles && articles.length > 0) {
      const articleList = articles
        .slice(0, 20)
        .map((a: any) => `- ID: "${a.id}" | "${a.title}" (${a.category}): ${a.excerpt?.slice(0, 100)}...`)
        .join('\n');
      systemPrompt += `\n\nAVAILABLE ARTICLES TO RECOMMEND:\n${articleList}`;
    }

    // Language instruction
    if (lang === 'kh') {
      systemPrompt += '\n\nThe user is likely Khmer-speaking. Respond in Khmer (ភាសាខ្មែរ) unless the user writes in English.';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-20), // Keep last 20 messages for context
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0].message.content || '';

    return NextResponse.json({ content, sessionId });
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
