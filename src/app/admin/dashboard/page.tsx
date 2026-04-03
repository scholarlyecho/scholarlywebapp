'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Mail, MessageSquare, Users, Gamepad2,
  Inbox, ArrowRight, BarChart3, ArrowUpRight, TrendingUp, FolderKanban
} from 'lucide-react';

type Submission = { id: string; formType: string; email?: string; name?: string; createdAt: any; read: boolean; [key: string]: any };

const formMeta: Record<string, { label: string; icon: React.ElementType; gradient: string }> = {
  newsletter: { label: 'Newsletter', icon: Mail, gradient: 'from-blue-500 to-brand-500' },
  contact: { label: 'Contact', icon: MessageSquare, gradient: 'from-emerald-500 to-teal-600' },
  waitlist: { label: 'Waitlist', icon: Gamepad2, gradient: 'from-amber-500 to-orange-500' },
  enrollment: { label: 'Enrollment', icon: Users, gradient: 'from-purple-500 to-pink-500' },
};

export default function OverviewPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [recent, setRecent] = useState<Submission[]>([]);

  useEffect(() => {
    const q1 = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsub1 = onSnapshot(q1, (snap) => {
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)));
    });
    const q2 = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'), limit(5));
    const unsub2 = onSnapshot(q2, (snap) => {
      setRecent(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const counts: Record<string, number> = { all: submissions.length };
  submissions.forEach((s) => { counts[s.formType] = (counts[s.formType] || 0) + 1; });
  const unread = submissions.filter((s) => !s.read).length;

  const fmtDate = (ts: any) => {
    if (!ts?.toDate) return '—';
    const d = ts.toDate();
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Welcome back
        </h2>
        <p className="text-slate-400 text-sm mt-1">Here&apos;s what&apos;s happening with ScholarlyEcho.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {[
          { key: 'all', label: 'Total', icon: BarChart3, gradient: 'from-brand-500 to-purple-600' },
          { key: 'newsletter', label: 'Newsletter', icon: Mail, gradient: 'from-blue-500 to-brand-500' },
          { key: 'contact', label: 'Contact', icon: MessageSquare, gradient: 'from-emerald-500 to-teal-600' },
          { key: 'waitlist', label: 'Waitlist', icon: Gamepad2, gradient: 'from-amber-500 to-orange-500' },
          { key: 'enrollment', label: 'Enrollment', icon: Users, gradient: 'from-purple-500 to-pink-500' },
        ].map(({ key, label, icon: Icon, gradient }, i) => (
          <motion.div key={key}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-40`} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
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
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="text-[14px] font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Submissions</h3>
            <Link href="/admin/dashboard/submissions" className="text-[11px] text-brand-600 font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-12 text-center">
              <Inbox className="w-8 h-8 mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-xs">No submissions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recent.map((sub) => {
                const meta = formMeta[sub.formType] || { label: sub.formType, icon: Inbox, gradient: 'from-slate-400 to-slate-500' };
                const Icon = meta.icon;
                return (
                  <Link key={sub.id} href="/admin/dashboard/submissions"
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors ${!sub.read ? 'bg-brand-50/20' : ''}`}>
                    {!sub.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 animate-pulse" />}
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-700 truncate">{sub.name || sub.email || 'Anonymous'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{sub.email || meta.label}</p>
                    </div>
                    <span className="text-[10px] text-slate-300 flex-shrink-0">{fmtDate(sub.createdAt)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-[14px] font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'View Submissions', href: '/admin/dashboard/submissions', icon: Inbox, color: 'from-brand-500 to-purple-600' },
                { label: 'Manage Programs', href: '/admin/dashboard/programs', icon: FolderKanban, color: 'from-amber-500 to-orange-500' },
                { label: 'View Analytics', href: '/admin/dashboard/analytics', icon: BarChart3, color: 'from-emerald-500 to-teal-600' },
                { label: 'Settings', href: '/admin/dashboard/settings', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-sm transition-all group">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[12px] font-semibold text-slate-600 group-hover:text-brand-600 transition-colors">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Unread banner */}
          {unread > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-5 bg-gradient-to-r from-brand-500 to-purple-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
              <div className="relative z-10">
                <p className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{unread}</p>
                <p className="text-white/70 text-sm mb-3">unread submission{unread !== 1 ? 's' : ''} waiting for review</p>
                <Link href="/admin/dashboard/submissions"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                  Review Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
