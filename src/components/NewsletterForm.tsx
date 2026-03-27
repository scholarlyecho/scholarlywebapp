'use client';

import { useState } from 'react';
import { submitForm } from '@/lib/formSubmit';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewsletterForm({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await submitForm('newsletter', { email });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold ${
        variant === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
      }`}>
        <CheckCircle2 className="w-4 h-4" /> Subscribed successfully!
      </div>
    );
  }

  const isDark = variant === 'dark';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={isDark
          ? 'flex-1 sm:w-64 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-400/60 transition-all'
          : 'flex-1 sm:w-64 px-4 py-3 rounded-xl bg-white/12 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm text-sm transition-all'
        }
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={isDark
          ? 'px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-white/90 transition-colors whitespace-nowrap shadow-lg disabled:opacity-60 flex items-center justify-center gap-2'
          : 'px-5 py-3 rounded-xl bg-white font-semibold text-brand-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-lg disabled:opacity-60'
        }
      >
        {status === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>Subscribe <ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </form>
  );
}
