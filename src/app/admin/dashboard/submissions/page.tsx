'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Mail, MessageSquare, Users, Gamepad2, Trash2, CheckCircle2, Search,
  Inbox, Clock, X, ExternalLink, Eye, BarChart3
} from 'lucide-react';

type Submission = { id: string; formType: string; [key: string]: any; createdAt: any; read: boolean };

const formMeta: Record<string, { label: string; icon: React.ElementType; color: string; gradient: string }> = {
  newsletter: { label: 'Newsletter', icon: Mail, color: 'bg-blue-50 text-blue-600', gradient: 'from-blue-500 to-brand-500' },
  contact: { label: 'Contact', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600', gradient: 'from-emerald-500 to-teal-600' },
  waitlist: { label: 'Waitlist', icon: Gamepad2, color: 'bg-amber-50 text-amber-600', gradient: 'from-amber-500 to-orange-500' },
  enrollment: { label: 'Enrollment', icon: Users, color: 'bg-purple-50 text-purple-600', gradient: 'from-purple-500 to-brand-500' },
};
const EXCLUDED = new Set(['id', 'formType', 'createdAt', 'read', 'program']);

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)));
    });
    return () => unsub();
  }, []);

  const markRead = async (id: string) => { await updateDoc(doc(db, 'submissions', id), { read: true }); };
  const remove = async (id: string) => { await deleteDoc(doc(db, 'submissions', id)); if (selected?.id === id) setSelected(null); };

  const filtered = submissions.filter((s) => {
    if (filter !== 'all' && s.formType !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(s).some((v) => typeof v === 'string' && v.toLowerCase().includes(q));
  });

  const counts: Record<string, number> = { all: submissions.length };
  submissions.forEach((s) => { counts[s.formType] = (counts[s.formType] || 0) + 1; });

  const fmtDate = (ts: any) => {
    if (!ts?.toDate) return '—';
    const d = ts.toDate(); const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const fmtFull = (ts: any) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  const getMeta = (t: string) => formMeta[t] || { label: t, icon: Inbox, color: 'bg-slate-50 text-slate-500', gradient: 'from-slate-400 to-slate-500' };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'newsletter', 'contact', 'waitlist', 'enrollment'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                filter === f ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-200'
              }`}>
              {f === 'all' ? 'All' : getMeta(f).label} ({counts[f] || 0})
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs ml-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-brand-300 transition-all" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Inbox className="w-12 h-12 mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 text-sm">No submissions found</p>
          </div>
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-3 bg-slate-50/60 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Submission</span><span>Type</span><span>Date</span><span className="text-right">Actions</span>
            </div>
            <AnimatePresence>
              {filtered.map((sub, i) => {
                const meta = getMeta(sub.formType); const Icon = meta.icon;
                return (
                  <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.01 }} layout
                    className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_80px] gap-2 sm:gap-4 items-center px-5 py-3.5 border-b border-slate-50 hover:bg-brand-50/20 transition-all cursor-pointer group ${!sub.read ? 'bg-brand-50/30' : ''}`}
                    onClick={() => { setSelected(sub); if (!sub.read) markRead(sub.id); }}>
                    <div className="flex items-center gap-3 min-w-0">
                      {!sub.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 animate-pulse" />}
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${!sub.read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{sub.name || sub.email || 'Anonymous'}</p>
                        <p className="text-xs text-slate-400 truncate">{sub.email || ''}</p>
                      </div>
                    </div>
                    <div><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${meta.color}`}><Icon className="w-3 h-3" /> {meta.label}</span></div>
                    <div className="text-xs text-slate-400">{fmtDate(sub.createdAt)}</div>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(sub); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-brand-500 hover:bg-brand-50 transition-all opacity-0 group-hover:opacity-100"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); remove(sub.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" onClick={() => setSelected(null)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
              <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100/60 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  {(() => { const m = getMeta(selected.formType); const SIcon = m.icon; return (
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center`}><SIcon className="w-4 h-4 text-white" /></div>
                  ); })()}
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{getMeta(selected.formType).label}</h3>
                    <p className="text-[11px] text-slate-400">{fmtFull(selected.createdAt)}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${selected.read ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selected.read ? 'Read' : 'Unread'}
                  </span>
                  {selected.program && <span className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 text-xs font-bold">{selected.program}</span>}
                </div>
                <div className="space-y-4">
                  {Object.entries(selected).filter(([k, v]) => !EXCLUDED.has(k) && v).map(([key, val], i) => (
                    <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="bg-slate-50/60 rounded-xl p-4 border border-slate-100/60">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</label>
                      {key === 'email' ? <a href={`mailto:${val}`} className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1.5">{val} <ExternalLink className="w-3 h-3" /></a>
                        : <p className="text-slate-800 text-sm font-medium whitespace-pre-wrap">{val}</p>}
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400"><Clock className="w-3.5 h-3.5" /> {fmtFull(selected.createdAt)}</div>
                <div className="flex gap-3 mt-6">
                  {selected.email && <a href={`mailto:${selected.email}`} className="flex-1 py-3.5 rounded-xl gradient-bg text-white text-sm font-bold text-center shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Reply</a>}
                  <button onClick={() => remove(selected.id)} className="px-5 py-3.5 rounded-xl border-2 border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 transition-all flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
