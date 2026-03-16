import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedPost from '@/components/home/FeaturedPost';
import BlogGrid from '@/components/home/BlogGrid';
import ServicesTeaser from '@/components/home/ServicesTeaser';
import AboutTeaser from '@/components/home/AboutTeaser';
import SubscribeBanner from '@/components/home/SubscribeBanner';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-brand-muted">Loading...</div>}>
        <FeaturedPost />
        <BlogGrid />
      </Suspense>
      <ServicesTeaser />
      <AboutTeaser />
      <SubscribeBanner />
      <Footer />
    </main>
  );
}
