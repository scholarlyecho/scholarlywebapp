'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Suspense } from 'react';
import {
  Clock, Calendar, Users, CheckCircle2, Loader2, User, AlertCircle, Mail
} from 'lucide-react';

type OfficeHour = { id: string; programId: string; title: string; date: string; startTime: string; endTime: string; slots: number; bookings: any[] };

function BookingContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [oh, setOh] = useState<OfficeHour | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'booking' | 'success' | 'error' | 'full'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getDoc(doc(db, 'office_hours', id)).then((snap) => {
      if (snap.exists()) setOh({ id: snap.id, ...snap.data() } as OfficeHour);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oh || !name || !email) return;
    const bookings = oh.bookings || [];
    if (bookings.length >= oh.slots) { setStatus('full'); return; }
    if (bookings.some((b: any) => b.email === email)) { setError('You have already booked this slot.'); setStatus('error'); return; }
    setStatus('booking');
    try {
      await updateDoc(doc(db, 'office_hours', id), { bookings: arrayUnion({ name, email, bookedAt: new Date().toISOString() }) });
      setOh({ ...oh, bookings: [...bookings, { name, email }] });
      setStatus('success');
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
    </div>
  );

  if (!id || !oh) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-5">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Session Not Found</h2>
        <p className="text-slate-400 text-sm">This office hour link may have expired or been removed.</p>
      </div>
    </div>
  );

  const spotsLeft = oh.slots - (oh.bookings?.length || 0);
  const isFull = spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="relative w-10 h-10"><Image src="/logo-black.png" alt="ScholarlyEcho" fill className="object-contain" /></div>
          <span className="font-bold text-lg text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>ScholarlyEcho</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold mb-2"><Clock className="w-3.5 h-3.5" /> Office Hour Booking</div>
            <h1 className="text-xl font-extrabold mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{oh.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-white/80 mt-3">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {oh.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {oh.startTime} – {oh.endTime}</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</span>
            </div>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Booked!</h3>
                  <p className="text-slate-400 text-sm">You&apos;re confirmed for {oh.title} on {oh.date} at {oh.startTime}.</p>
                </motion.div>
              ) : isFull || status === 'full' ? (
                <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                  <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h3 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Fully Booked</h3>
                  <p className="text-slate-400 text-sm">All slots have been taken. Please contact your instructor.</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleBook} className="space-y-4">
                  <p className="text-slate-500 text-sm mb-2">Enter your name and email to reserve your spot.</p>
                  {status === 'error' && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-emerald-400 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-emerald-400 transition-colors" />
                    </div>
                  </div>
                  <button type="submit" disabled={status === 'booking'}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {status === 'booking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Book My Spot <CheckCircle2 className="w-4 h-4" /></>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {oh.bookings && oh.bookings.length > 0 && status !== 'success' && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Booked ({oh.bookings.length}/{oh.slots})</p>
                <div className="space-y-1.5">
                  {oh.bookings.map((b: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-600">
                        {b.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      {b.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-slate-300 text-xs mt-6">Powered by ScholarlyEcho</p>
      </motion.div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
