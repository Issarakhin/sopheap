import { Timestamp } from 'firebase/firestore';

export type PostCategory = 'ai-frontier-brief' | 'the-long-view' | 'thought-leadership';

export interface Post {
  id: string;
  slug: string;
  title: string;
  title_kh?: string;
  excerpt: string;
  excerpt_kh?: string;
  body: string;
  body_kh?: string;
  category: PostCategory;
  coverImage?: string;
  featured: boolean;
  published: boolean;
  publishedAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  readTime: string;
  tags: string[];
  viewCount: number;
  authorId: string;
  // AI Frontier Brief specific
  theSignal?: string;
  cambodiaLens?: string;
  oneThingToTry?: string;
  theSignal_kh?: string;
  cambodiaLens_kh?: string;
  oneThingToTry_kh?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  startedAt: Date;
  lastMessageAt: Date;
  messages: ChatMessage[];
  title: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  organization: string;
  email: string;
  service: string;
  message: string;
  submittedAt?: Date;
  status: 'new' | 'read' | 'responded';
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  language: 'en' | 'kh';
  createdAt: Date;
  lastSeen: Date;
  savedArticles: string[];
  role?: 'user' | 'admin';
}

export interface Subscriber {
  email: string;
  subscribedAt: Date;
  language: 'en' | 'kh';
}

export interface AINews {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface ArticleRecommendation {
  id: string;
  title: string;
  reason: string;
}
