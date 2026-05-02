import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Shield, FileText, Lock, Eye, Zap } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'action';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

// ─── Toast Item ──────────────────────────────────────────────────────────────
const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
  action:  Zap,
};

const STYLES: Record<ToastType, { bar: string; icon: string; bg: string; border: string; title: string }> = {
  success: { bar: 'bg-emerald-500', icon: 'text-emerald-500', bg: 'bg-white',      border: 'border-emerald-100', title: 'text-slate-900' },
  error:   { bar: 'bg-red-500',     icon: 'text-red-500',     bg: 'bg-white',      border: 'border-red-100',     title: 'text-slate-900' },
  warning: { bar: 'bg-amber-500',   icon: 'text-amber-500',   bg: 'bg-white',      border: 'border-amber-100',   title: 'text-slate-900' },
  info:    { bar: 'bg-indigo-500',  icon: 'text-indigo-500',  bg: 'bg-white',      border: 'border-indigo-100',  title: 'text-slate-900' },
  action:  { bar: 'bg-purple-500',  icon: 'text-purple-500',  bg: 'bg-slate-950',  border: 'border-slate-800',   title: 'text-white' },
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration ?? 4000;
  const style = STYLES[toast.type];
  const Icon = ICONS[toast.type];

  useEffect(() => {
    // mount animation
    requestAnimationFrame(() => setVisible(true));
    // countdown
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(tick);
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 350);
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  return (
    <div
      className={`relative flex gap-3 items-start p-4 rounded-2xl border shadow-2xl w-80 overflow-hidden transition-all duration-350
        ${style.bg} ${style.border}
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
      style={{ transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.34,1.56,0.64,1)' }}
    >
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${style.bar} transition-all`}
        style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
      />

      {/* Icon */}
      <div className={`mt-0.5 shrink-0 ${style.icon}`}>
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-tight ${style.title}`}>{toast.title}</p>
        {toast.message && (
          <p className={`text-xs mt-0.5 leading-snug ${toast.type === 'action' ? 'text-slate-400' : 'text-slate-500'}`}>
            {toast.message}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 350); }}
        className={`shrink-0 p-0.5 rounded-lg transition-colors ${toast.type === 'action' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++counterRef.current}`;
    setToasts(prev => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast stack — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
