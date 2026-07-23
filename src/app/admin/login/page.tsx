'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpassword123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Public Portfolio
        </Link>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-sky-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin CMS Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage portfolio projects, content & database
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Log In to Dashboard'
              )}
            </button>
          </form>

          {/* Quick Demo Info */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 text-left">
              <span className="font-semibold text-sky-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3" /> Default Admin Credentials:
              </span>
              <p>Username: <code className="text-white">admin</code></p>
              <p>Password: <code className="text-white">adminpassword123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
