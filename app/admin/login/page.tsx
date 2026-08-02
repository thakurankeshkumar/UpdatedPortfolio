'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark px-6 py-10">
      <Link href="/" className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
        <ArrowLeft size={15} /> Home
      </Link>
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
          <Lock size={20} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white">Admin Login</h1>
        <p className="mt-1 text-sm text-white/40">Sign in to manage your site</p>

        <div className="mt-7">
          <Label htmlFor="email" className="text-white/70">Email</Label>
          <Input
            id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="password" className="text-white/70">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/10 bg-white/5 pr-12 text-white placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-red-400">
            {error}
          </motion.p>
        )}

        <Button type="submit" variant="primary" disabled={loading} className="mt-6 w-full">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
        </Button>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/40">
          <ShieldCheck size={14} className="shrink-0 text-primary" />
          Sessions are secured with hashed passwords and signed JWT cookies.
        </div>
      </motion.form>
    </div>
  );
}
