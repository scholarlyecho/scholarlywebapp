'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  LayoutDashboard, Mail, MessageSquare, Users, Gamepad2,
  LogOut, Trash2, CheckCircle2, Eye, Filter, Search,
  Bell, ChevronDown, Inbox, Clock, ArrowRight
} from 'lucide-react';

type Submission = {
  id: string;
  formType: string;
  email?: string;
  name?: string;
  message?: string;
  subject?: string;
  school?: string;
  phone?: string;
  createdAt: any;
  read: boolean;
};

const formLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  newsletter: { label: 'Newsletter', icon: Mail, color: 'bg-brand-50 text-brand-600' },
  contact: { label: 'Contact', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
  waitlist: { label: 'Waitlist', icon: Gamepad2, color: 'bg-amber-50 text-amber-600' },
  enrollment: { label: 'Enrollment', icon: Users, color: 'bg-purple-50 text-purple-600' },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Submission | null>(null);

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/admin/login');
      } else {
        setUser(u);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // Real-time submissions
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
      setSubmissions(data);
    });
    return () => unsub();
  }, [user]);

  const handleMarkRead = async (id: string) => {
    await updateDoc(doc(db, 'submissions', id), { read: true });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'submissions', id));
    if (selected?.id === id) setSelected(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const filtered = submissions.filter((s) => {
    const matchFilter = filter === 'all' || s.formType === filter;
    const matchSearch = search === '' ||
      (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.message || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;
  const counts = {
    all: submissions.length,
    newsletter: submissions.filter((s) => s.formType === 'newsletter').length,
    contact: submissions.filter((s) => s.formType === 'contact').length,
    waitlist: submissions.filter((s) => s.formType === 'waitlist').length,
    enrollment: submissions.filter((s) => s.formType === 'enrollment').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070c1b' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full" />
      </div>
    );
  }

  const formatDate = (ts: any) => {
    if (!ts?.toDate) return '—';
    const d = ts.toDate();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo-black.png" alt="ScholarlyEcho" fill className="object-contain" />
            </div>
            <div>
              <span className="font-bold text-[15px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 text-xs font-bold">
                <Bell className="w-3.5 h-3.5" />
                {unreadCount} new
              </div>
            )}
            <div className="text-xs text-slate-400">{user?.email}</div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 text-xs font-medium hover:bg-slate-100 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8">

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Submissions', value: counts.all, icon: Inbox, color: 'from-brand-500 to-purple-600' },
            { label: 'Newsletter', value: counts.newsletter, icon: Mail, color: 'from-blue-500 to-brand-500' },
            { label: 'Contact', value: counts.contact, icon: MessageSquare, color: 'from-emerald-500 to-teal-600' },
            { label: 'Waitlist', value: counts.waitlist, icon: Gamepad2, color: 'from-amber-500 to-orange-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {value}
                </div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Filters + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'newsletter', 'contact', 'waitlist', 'enrollment'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  filter === f
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-200 hover:text-brand-600'
                }`}>
                {f === 'all' ? 'All' : formLabels[f]?.label || f}
                <span className="ml-1.5 opacity-60">({(counts as any)[f] || 0})</span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search submissions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-brand-300 transition-colors"
            />
          </div>
        </div>

        {/* ── Submissions Table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Inbox className="w-12 h-12 mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm">No submissions yet.</p>
              <p className="text-slate-300 text-xs mt-1">Form submissions from the website will appear here in real-time.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((sub, i) => {
                const meta = formLabels[sub.formType] || { label: sub.formType, icon: Inbox, color: 'bg-slate-100 text-slate-500' };
                const Icon = meta.icon;
                return (
                  <motion.div key={sub.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group ${!sub.read ? 'bg-brand-50/30' : ''}`}
                    onClick={() => { setSelected(sub); if (!sub.read) handleMarkRead(sub.id); }}
                  >
                    {/* Unread dot */}
                    <div className="w-2 flex-shrink-0">
                      {!sub.read && <span className="block w-2 h-2 rounded-full bg-brand-500" />}
                    </div>

                    {/* Type badge */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold truncate ${!sub.read ? 'text-slate-900' : 'text-slate-600'}`}>
                          {sub.name || sub.email || 'Anonymous'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {sub.email}{sub.message ? ` — ${sub.message}` : ''}
                      </p>
                    </div>

                    {/* Time + actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-slate-300 hidden sm:block">
                        {formatDate(sub.createdAt)}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Detail Slide-over ── */}
        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                onClick={() => setSelected(null)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      Submission Detail
                    </h3>
                    <button onClick={() => setSelected(null)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                      ✕
                    </button>
                  </div>

                  {(() => {
                    const meta = formLabels[selected.formType] || { label: selected.formType, icon: Inbox, color: 'bg-slate-100 text-slate-500' };
                    const SIcon = meta.icon;
                    return (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 ${meta.color}`}>
                        <SIcon className="w-3.5 h-3.5" /> {meta.label}
                      </div>
                    );
                  })()}

                  <div className="space-y-5">
                    {selected.name && (
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Name</label>
                        <p className="text-slate-800 text-sm font-medium">{selected.name}</p>
                      </div>
                    )}
                    {selected.email && (
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Email</label>
                        <a href={`mailto:${selected.email}`} className="text-brand-600 text-sm font-medium hover:underline">{selected.email}</a>
                      </div>
                    )}
                    {selected.phone && (
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Phone</label>
                        <p className="text-slate-800 text-sm">{selected.phone}</p>
                      </div>
                    )}
                    {selected.subject && (
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Subject</label>
                        <p className="text-slate-800 text-sm">{selected.subject}</p>
                      </div>
                    )}
                    {selected.school && (
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">School</label>
                        <p className="text-slate-800 text-sm">{selected.school}</p>
                      </div>
                    )}
                    {selected.message && (
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Message</label>
                        <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded-xl p-4">{selected.message}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Submitted</label>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        {formatDate(selected.createdAt)}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Status</label>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${selected.read ? 'text-emerald-600' : 'text-amber-600'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> {selected.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                    {selected.email && (
                      <a href={`mailto:${selected.email}`}
                        className="flex-1 py-3 rounded-xl gradient-bg text-white text-sm font-bold text-center shadow-md hover:-translate-y-0.5 transition-all">
                        Reply via Email
                      </a>
                    )}
                    <button onClick={() => { handleDelete(selected.id); }}
                      className="px-4 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
