'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #070c1b 0%, #0d1333 25%, #13103a 50%, #0c1a2e 75%, #070c1b 100%)' }}>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #6e42ff 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* Left side — branding (desktop only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 px-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-16 h-16">
              <Image src="/logo-white.png" alt="ScholarlyEcho" fill className="object-contain" />
            </div>
            <div>
              <div className="text-white font-bold text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                ScholarlyEcho
              </div>
              <div className="text-white/40 text-xs tracking-wider uppercase">Admin Portal</div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-[-0.02em]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Manage your platform.
            <br />
            <span className="gradient-text-animated">All in one place.</span>
          </h1>

          <p className="text-white/40 text-[15px] leading-relaxed mb-8">
            Access form submissions, manage enrollments, view newsletter signups,
            and configure platform settings from a single dashboard.
          </p>

          <div className="space-y-3">
            {[
              { icon: Shield, label: 'Form submissions & contact inquiries' },
              { icon: Mail, label: 'Newsletter & waitlist signups' },
              { icon: Lock, label: 'Secure admin-only access' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/50 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-400" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-5 sm:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="relative w-12 h-12">
              <Image src="/logo-white.png" alt="ScholarlyEcho" fill className="object-contain" />
            </div>
            <div>
              <div className="text-white font-bold text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                ScholarlyEcho
              </div>
              <div className="text-white/40 text-[10px] tracking-wider uppercase">Admin Portal</div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-7 sm:p-9 shadow-[0_32px_64px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-[0_4px_20px_rgba(110,66,255,0.4)]">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Admin Sign In
              </h2>
              <p className="text-white/35 text-sm">Enter your credentials to continue</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@scholarlyecho.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/[0.08] transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/[0.08] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white text-[15px] gradient-bg shadow-[0_4px_20px_rgba(110,66,255,0.4)] hover:shadow-[0_8px_30px_rgba(110,66,255,0.55)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 mt-6"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-white/20 text-xs mt-6">
            Protected area — authorized personnel only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
