'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  Mail, MessageSquare, Users, Gamepad2,
  LogOut, Trash2, CheckCircle2, Search,
  Bell, Inbox, Clock, X, ExternalLink,
  Eye, BarChart3, ArrowUpRight
} from 'lucide-react';

type Submission = {
  id: string;
  formType: string;
  [key: string]: any;
  createdAt: any;
  read: boolean;
};

const formMeta: Record<string, { label: string; icon: React.ElementType; color: string; gradient: string }> = {
  newsletter: { label: 'Newsletter', icon: Mail, color: 'bg-blue-50 text-blue-600', gradient: 'from-blue-500 to-brand-500' },
  contact: { label: 'Contact', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600', gradient: 'from-emerald-500 to-teal-600' },
  waitlist: { label: 'Waitlist', icon: Gamepad2, color: 'bg-amber-50 text-amber-600', gradient: 'from-amber-500 to-orange-500' },
  enrollment: { label: 'Enrollment', icon: Users, color: 'bg-purple-50 text-purple-600', gradient: 'from-purple-500 to-brand-500' },
};

const EXCLUDED_FIELDS = new Set(['id', 'formType', 'createdAt', 'read']);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push('/admin/login'); } else { setUser(u); setLoading(false); }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)));
    });
    return () => unsub();
  }, [user]);

  const markRead = async (id: string) => { await updateDoc(doc(db, 'submissions', id), { read: true }); };
  const remove = async (id: string) => { await deleteDoc(doc(db, 'submissions', id)); if (selected?.id === id) setSelected(null); };
  const logout = async () => { await signOut(auth); router.push('/admin/login'); };

  const filtered = submissions.filter((s) => {
    if (filter !== 'all' && s.formType !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(s).some((v) => typeof v === 'string' && v.toLowerCase().includes(q));
  });

  const unread = submissions.filter((s) => !s.read).length;
  const counts: Record<string, number> = { all: submissions.length };
  submissions.forEach((s) => { counts[s.formType] = (counts[s.formType] || 0) + 1; });

  const fmtDate = (ts: any) => {
    if (!ts?.toDate) return '—';
    const d = ts.toDate();
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fmtDateFull = (ts: any) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbff]">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-[3px] border-brand-100 border-t-brand-500 rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getMeta = (type: string) => formMeta[type] || { label: type, icon: Inbox, color: 'bg-slate-50 text-slate-500', gradient: 'from-slate-400 to-slate-500' };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100/60 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo-black.png" alt="ScholarlyEcho" fill className="object-contain" />
            </div>
            <span className="font-bold text-[15px] text-slate-900 hidden sm:block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Admin
            </span>
            <span className="hidden sm:block px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 text-[10px] font-bold">
              PORTAL
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {unread > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500 text-white text-[11px] font-bold shadow-[0_2px_10px_rgba(110,66,255,0.3)]">
                <Bell className="w-3 h-3" />
                {unread}
              </motion.div>
            )}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="text-xs text-slate-500 max-w-[140px] truncate">{user?.email}</span>
            </div>
            <button onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 text-xs font-medium hover:bg-red-50 hover:text-red-500 transition-all duration-200">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-6 sm:py-8">

        {/* ── Welcome + Stats ── */}
        <div className="mb-8">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Dashboard
          </motion.h1>
          <p className="text-slate-400 text-sm">Real-time overview of all website submissions.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {[
            { key: 'all', label: 'Total', icon: BarChart3, gradient: 'from-brand-500 to-purple-600' },
            { key: 'newsletter', label: 'Newsletter', icon: Mail, gradient: 'from-blue-500 to-brand-500' },
            { key: 'contact', label: 'Contact', icon: MessageSquare, gradient: 'from-emerald-500 to-teal-600' },
            { key: 'waitlist', label: 'Waitlist', icon: Gamepad2, gradient: 'from-amber-500 to-orange-500' },
            { key: 'enrollment', label: 'Enrollment', icon: Users, gradient: 'from-purple-500 to-pink-500' },
          ].map(({ key, label, icon: Icon, gradient }, i) => (
            <motion.button key={key}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setFilter(key)}
              className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 group ${
                filter === key
                  ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-2 border-brand-200 scale-[1.02]'
                  : 'bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm'
              }`}>
              {filter === key && (
                <motion.div layoutId="stat-active" className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradient}`} />
              )}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {(counts[key] || 0) > 0 && (
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> active
                  </span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {counts[key] || 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
            </motion.button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, message..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-brand-300 focus:shadow-[0_0_0_3px_rgba(110,66,255,0.08)] transition-all duration-200" />
          </div>
          <div className="text-xs text-slate-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ── Submissions ── */}
        <motion.div layout className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-5">
                <Inbox className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-500 text-sm font-semibold mb-1">No submissions found</p>
              <p className="text-slate-300 text-xs">
                {search ? 'Try a different search term.' : 'Form submissions will appear here in real-time.'}
              </p>
            </motion.div>
          ) : (
            <div>
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-3 bg-slate-50/60 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Submission</span>
                <span>Type</span>
                <span>Date</span>
                <span className="text-right">Actions</span>
              </div>

              <AnimatePresence>
                {filtered.map((sub, i) => {
                  const meta = getMeta(sub.formType);
                  const Icon = meta.icon;
                  return (
                    <motion.div key={sub.id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.015 }}
                      layout
                      className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_80px] gap-2 sm:gap-4 items-center px-5 py-3.5 border-b border-slate-50 hover:bg-brand-50/20 transition-all duration-200 cursor-pointer group ${!sub.read ? 'bg-brand-50/30' : ''}`}
                      onClick={() => { setSelected(sub); if (!sub.read) markRead(sub.id); }}
                    >
                      {/* Name + email */}
                      <div className="flex items-center gap-3 min-w-0">
                        {!sub.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 animate-pulse" />}
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${!sub.read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                            {sub.name || sub.email || 'Anonymous'}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{sub.email || ''}</p>
                        </div>
                      </div>

                      {/* Type */}
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${meta.color}`}>
                          <Icon className="w-3 h-3" /> {meta.label}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="text-xs text-slate-400">{fmtDate(sub.createdAt)}</div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setSelected(sub); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-brand-500 hover:bg-brand-50 transition-all opacity-0 group-hover:opacity-100">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); remove(sub.id); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Detail Panel ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-[0_0_80px_rgba(0,0,0,0.1)] z-50 overflow-y-auto"
            >
              {/* Panel header */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100/60 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  {(() => {
                    const m = getMeta(selected.formType);
                    const SIcon = m.icon;
                    return (
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center`}>
                        <SIcon className="w-4 h-4 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {getMeta(selected.formType).label} Submission
                    </h3>
                    <p className="text-[11px] text-slate-400">{fmtDateFull(selected.createdAt)}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 py-6">
                {/* Status badge */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                    selected.read ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selected.read ? 'Read' : 'Unread'}
                  </span>
                  <span className="text-xs text-slate-300">ID: {selected.id.slice(0, 8)}...</span>
                </div>

                {/* Dynamic fields */}
                <div className="space-y-4">
                  {Object.entries(selected)
                    .filter(([key, val]) => !EXCLUDED_FIELDS.has(key) && val)
                    .map(([key, val], i) => (
                      <motion.div key={key}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-slate-50/60 rounded-xl p-4 border border-slate-100/60"
                      >
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                        </label>
                        {key === 'email' ? (
                          <a href={`mailto:${val}`} className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1.5">
                            {val} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : key === 'message' || key === 'motivation' || key === 'bio' ? (
                          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{val}</p>
                        ) : (
                          <p className="text-slate-800 text-sm font-medium">{val}</p>
                        )}
                      </motion.div>
                    ))
                  }
                </div>

                {/* Timestamp */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Submitted {fmtDateFull(selected.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`}
                      className="flex-1 py-3.5 rounded-xl gradient-bg text-white text-sm font-bold text-center shadow-[0_4px_16px_rgba(110,66,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(110,66,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" /> Reply via Email
                    </a>
                  )}
                  <button onClick={() => remove(selected.id)}
                    className="px-5 py-3.5 rounded-xl border-2 border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-all duration-200 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
