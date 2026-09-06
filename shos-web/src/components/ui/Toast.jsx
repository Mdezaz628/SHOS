import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 2000,
          maxWidth: 380
        }}
      >
        {toasts.map((toast) => {
          const typeIcons = {
            success: <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />,
            critical: <AlertCircle size={18} style={{ color: 'var(--color-critical)' }} />,
            warning: <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />,
            info: <Info size={18} style={{ color: 'var(--color-primary)' }} />
          };

          return (
            <div
              key={toast.id}
              className="shos-card animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ marginTop: 2 }}>{typeIcons[toast.type] || typeIcons.info}</div>
              <div style={{ flex: 1 }}>
                {toast.title && (
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block' }}>
                    {toast.title}
                  </strong>
                )}
                {toast.message && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)' }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
