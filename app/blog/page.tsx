import { Suspense } from 'react';
import BlogContent from './BlogContent';

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-muted font-mono text-sm">
        Loading...
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
