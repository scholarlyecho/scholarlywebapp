'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { updatePassword, updateEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/Toast';
import {
  Shield, Mail, Lock, Globe, Bell, Save, Loader2, ExternalLink, Database
} from 'lucide-react';

export default function SettingsPage() {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const { showToast } = useToast();

  const user = auth.currentUser;

  const handleUpdateEmail = async () => {
    if (!newEmail || !user) return;
    setSaving('email');
    try {
      await updateEmail(user, newEmail);
      showToast('success', 'Email updated successfully.');
      setNewEmail('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update email.');
    }
    setSaving(null);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !user) return;
    setSaving('password');
    try {
      await updatePassword(user, newPassword);
      showToast('success', 'Password updated successfully.');
      setNewPassword('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update password. You may need to re-authenticate.');
    }
    setSaving(null);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your admin account and platform settings.</p>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Account</h3>
              <p className="text-xs text-slate-400">Current: {user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Update Email</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                </div>
                <button onClick={handleUpdateEmail} disabled={!newEmail || saving === 'email'}
                  className="px-4 py-3 rounded-xl gradient-bg text-white text-sm font-bold shadow-md disabled:opacity-50 hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                  {saving === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Update Password</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                </div>
                <button onClick={handleUpdatePassword} disabled={!newPassword || saving === 'password'}
                  className="px-4 py-3 rounded-xl gradient-bg text-white text-sm font-bold shadow-md disabled:opacity-50 hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                  {saving === 'password' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Platform Links</h3>
          <div className="space-y-2">
            {[
              { label: 'Firebase Console', href: 'https://console.firebase.google.com/project/scholarly-echo', icon: Database, desc: 'Manage Firestore, Auth, Hosting' },
              { label: 'Google Analytics', href: 'https://analytics.google.com', icon: Globe, desc: 'Traffic & user behavior data' },
              { label: 'GitHub Repository', href: 'https://github.com/scholarlyecho/scholarlywebapp', icon: ExternalLink, desc: 'Source code & deployments' },
            ].map(({ label, href, icon: Icon, desc }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-brand-600 transition-colors">{label}</p>
                  <p className="text-[11px] text-slate-400">{desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-400 transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Firebase Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Firebase Configuration</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Project ID', value: 'scholarly-echo' },
              { label: 'Auth Domain', value: 'scholarly-echo.firebaseapp.com' },
              { label: 'Hosting', value: 'scholarly-echo.web.app' },
              { label: 'Measurement ID', value: 'G-4ZJL7K6PQB' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-lg p-3 border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">{label}</span>
                <span className="text-slate-700 font-mono text-[11px]">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
