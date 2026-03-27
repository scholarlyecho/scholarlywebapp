'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitForm } from '@/lib/formSubmit';
import { useToast } from '@/components/Toast';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewsletterForm({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const result = await submitForm('newsletter', { email });
    if (result.success) {
      setStatus('success');
      setEmail('');
      showToast('success', 'You\'re subscribed! Check your inbox for updates.');
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('idle');
      showToast('error', result.error || 'Subscription failed. Please try again.');
    }
  };

  const isDark = variant === 'dark';

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="flex items-center justify-center gap-3 py-3.5 rounded-xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-white" />
            </div>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-400'}`}
          >
            Subscribed successfully!
          </motion.span>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={isDark
                ? 'w-full sm:w-64 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-400/60 focus:bg-white/[0.1] transition-all duration-300'
                : 'w-full sm:w-64 px-4 py-3 rounded-xl bg-white/12 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm text-sm transition-all duration-300'
              }
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === 'loading'}
            whileTap={{ scale: 0.97 }}
            className={isDark
              ? 'px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-white/90 transition-all whitespace-nowrap shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 hover:-translate-y-0.5 duration-300'
              : 'px-5 py-3 rounded-xl bg-white font-semibold text-brand-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-lg disabled:opacity-60 hover:-translate-y-0.5 duration-300'
            }
          >
            {status === 'loading' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 className="w-4 h-4 animate-spin" />
              </motion.div>
            ) : (
              <>Subscribe <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
