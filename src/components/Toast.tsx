'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';
type Toast = { id: number; type: ToastType; message: string };

const ToastContext = createContext<{
  showToast: (type: ToastType, message: string) => void;
}>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'bg-white border-emerald-100'
                  : 'bg-white border-red-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                toast.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {toast.type === 'success'
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  : <AlertCircle className="w-4 h-4 text-red-600" />
                }
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className={`text-sm font-semibold ${toast.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
                  {toast.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => dismiss(toast.id)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-all flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
