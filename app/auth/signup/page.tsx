'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success('Account created! Check your email to verify.');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-2xl font-bold text-brand-cream block text-center mb-8">
          SOPHEAP<span className="text-brand-gold">.</span><span className="text-brand-gold">AI</span>
        </Link>
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-brand-cream mb-6">Create an account</h1>
          <p className="text-brand-muted text-sm mb-6">Save your Sophea chat history and bookmark articles.</p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="text-brand-muted text-xs font-mono uppercase tracking-wider block mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-base" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="text-brand-muted text-xs font-mono">or</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>
          <button onClick={async () => { try { await signInWithGoogle(); router.push('/'); } catch(e: any) { toast.error(e.message); }}} className="btn-ghost w-full justify-center py-3">
            Continue with Google
          </button>
          <p className="text-center text-brand-muted text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-gold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
