import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string, retryAction?: () => void) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { ...options, id };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    const duration = options.duration ?? (options.type === 'error' ? 6000 : 4000);
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  const success = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'success' });
  }, [toast]);

  const error = useCallback((title: string, description?: string, retryAction?: () => void) => {
    toast({
      title,
      description,
      type: 'error',
      action: retryAction ? { label: 'Retry', onClick: retryAction } : undefined,
    });
  }, [toast]);

  const warning = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'warning' });
  }, [toast]);

  const info = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'info' });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      {/* Toast Render Viewport */}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2"
      >
        {toasts.map(t => {
          const type = t.type || 'info';
          const borderColors = {
            success: 'border-emerald-500/50 bg-slate-950/95 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
            error: 'border-rose-500/60 bg-slate-950/95 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
            warning: 'border-amber-500/50 bg-slate-950/95 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
            info: 'border-cyan-500/50 bg-slate-950/95 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
          }[type];

          const icon = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
            info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
          }[type];

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${borderColors}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold tracking-wide text-white font-mono">
                  {t.title}
                </h4>
                {t.description && (
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed font-sans">
                    {t.description}
                  </p>
                )}
                {t.action && (
                  <button
                    onClick={() => {
                      t.action?.onClick();
                      dismiss(t.id);
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-medium transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.action.label}</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
