'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  BarChart3, TrendingUp, Users, Mail, Gamepad2,
  MessageSquare, Globe, Calendar, ArrowUpRight, ExternalLink
} from 'lucide-react';

type Submission = { id: string; formType: string; createdAt: any; [key: string]: any };

export default function AnalyticsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)));
    });
    return () => unsub();
  }, []);

  const counts: Record<string, number> = {};
  const daily: Record<string, number> = {};
  submissions.forEach((s) => {
    counts[s.formType] = (counts[s.formType] || 0) + 1;
    if (s.createdAt?.toDate) {
      const day = s.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      daily[day] = (daily[day] || 0) + 1;
    }
  });

  const total = submissions.length;
  const today = submissions.filter((s) => {
    if (!s.createdAt?.toDate) return false;
    const d = s.createdAt.toDate();
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const thisWeek = submissions.filter((s) => {
    if (!s.createdAt?.toDate) return false;
    return Date.now() - s.createdAt.toDate().getTime() < 604800000;
  }).length;

  const topCountries = (() => {
    const map: Record<string, number> = {};
    submissions.forEach((s) => { if (s.country) map[s.country] = (map[s.country] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  })();

  const maxDaily = Math.max(...Object.values(daily), 1);
  const dailyEntries = Object.entries(daily).slice(0, 14).reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Analytics</h2>
          <p className="text-slate-400 text-sm mt-1">Submission trends and platform insights.</p>
        </div>
        <a href="https://analytics.google.com/analytics/web/#/p/scholarly-echo" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:border-brand-200 hover:text-brand-600 transition-all">
          <BarChart3 className="w-4 h-4" /> Google Analytics <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Submissions', value: total, icon: BarChart3, gradient: 'from-brand-500 to-purple-600', sub: 'All time' },
          { label: 'Today', value: today, icon: Calendar, gradient: 'from-emerald-500 to-teal-600', sub: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
          { label: 'This Week', value: thisWeek, icon: TrendingUp, gradient: 'from-blue-500 to-brand-500', sub: 'Last 7 days' },
          { label: 'Countries', value: topCountries.length, icon: Globe, gradient: 'from-amber-500 to-orange-500', sub: 'Unique' },
        ].map(({ label, value, icon: Icon, gradient, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient}`} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              {value > 0 && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> {sub}</span>}
            </div>
            <div className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Activity Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="text-[14px] font-bold text-slate-800 mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Daily Activity</h3>
          {dailyEntries.length === 0 ? (
            <div className="py-12 text-center text-slate-300 text-sm">No data yet</div>
          ) : (
            <div className="flex items-end gap-2 h-[180px]">
              {dailyEntries.map(([day, count], i) => (
                <motion.div key={day} initial={{ height: 0 }} animate={{ height: `${(count / maxDaily) * 100}%` }}
                  transition={{ delay: i * 0.04, type: 'spring', damping: 15 }}
                  className="flex-1 min-w-0 relative group">
                  <div className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-brand-500 to-purple-400 hover:from-brand-400 hover:to-purple-300 transition-colors cursor-pointer"
                    style={{ height: '100%', minHeight: '4px' }} />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {count}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {dailyEntries.length > 0 && (
            <div className="flex justify-between mt-3 text-[9px] text-slate-300 font-medium">
              <span>{dailyEntries[0]?.[0]}</span>
              <span>{dailyEntries[dailyEntries.length - 1]?.[0]}</span>
            </div>
          )}
        </motion.div>

        {/* Submission Types */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="text-[14px] font-bold text-slate-800 mb-5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>By Type</h3>
          <div className="space-y-4">
            {[
              { key: 'enrollment', label: 'Enrollment', icon: Users, color: 'bg-purple-500' },
              { key: 'newsletter', label: 'Newsletter', icon: Mail, color: 'bg-blue-500' },
              { key: 'waitlist', label: 'Waitlist', icon: Gamepad2, color: 'bg-amber-500' },
              { key: 'contact', label: 'Contact', icon: MessageSquare, color: 'bg-emerald-500' },
            ].map(({ key, label, icon: Icon, color }) => {
              const count = counts[key] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium text-slate-600">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{count} <span className="text-slate-300 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Countries + Google Analytics Link */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="text-[14px] font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Top Countries</h3>
          {topCountries.length === 0 ? (
            <p className="text-slate-300 text-xs py-6 text-center">No country data yet</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map(([country, count], i) => (
                <div key={country} className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-slate-300 w-4">{i + 1}</span>
                  <span className="text-sm font-medium text-slate-700 flex-1">{country}</span>
                  <span className="text-xs font-bold text-slate-500">{count}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 bg-gradient-to-br from-brand-500 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, white 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <BarChart3 className="w-10 h-10 mb-4 text-white/60" />
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Google Analytics</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              View detailed traffic, page views, user behavior, and conversion data in Google Analytics.
            </p>
            <a href={`https://analytics.google.com/analytics/web/#/report-home/a539995167w${''}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-bold transition-colors">
              Open Google Analytics <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
