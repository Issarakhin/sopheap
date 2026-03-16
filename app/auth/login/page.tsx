'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-2xl font-bold text-brand-cream block text-center mb-8">
          SOPHEAP<span className="text-brand-gold">.</span><span className="text-brand-gold">AI</span>
        </Link>
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-brand-cream mb-6">Welcome back</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-base" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="text-brand-muted text-xs font-mono">or</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>

          <button onClick={handleGoogle} className="btn-ghost w-full justify-center py-3">
            Continue with Google
          </button>

          <p className="text-center text-brand-muted text-sm mt-6">
            No account?{' '}
            <Link href="/auth/signup" className="text-brand-gold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
