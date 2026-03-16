import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, DM_Mono, Kantumruy_Pro } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { LangProvider } from '@/lib/lang-context';
import { Toaster } from 'react-hot-toast';
import SopheaWidget from '@/components/chat/SopheaWidget';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

const kantumruy = Kantumruy_Pro({
  subsets: ['khmer'],
  variable: '--font-kantumruy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SOPHEAP.AI — AI Thinking for Cambodia\'s Future',
  description: 'HIN Sopheap — AI strategist, trainer, and entrepreneur in Cambodia. Weekly insights on AI through a Cambodian lens.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sopheap.ai'),
  openGraph: {
    title: 'SOPHEAP.AI',
    description: 'AI Thinking for Cambodia\'s Future',
    url: 'https://sopheap.ai',
    siteName: 'SOPHEAP.AI',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOPHEAP.AI',
    description: 'AI Thinking for Cambodia\'s Future',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${dmMono.variable} ${kantumruy.variable}`}>
      <body className="bg-brand-bg text-brand-cream antialiased">
        <AuthProvider>
          <LangProvider>
            {children}
            <SopheaWidget />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#111318',
                  color: '#F5F0E8',
                  border: '1px solid #1E2128',
                },
                success: { iconTheme: { primary: '#C9A84C', secondary: '#111318' } },
              }}
            />
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
