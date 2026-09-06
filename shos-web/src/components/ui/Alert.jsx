import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export const Alert = ({
  variant = 'info', // info | success | warning | critical
  title,
  children,
  onClose,
  className = ''
}) => {
  const configs = {
    info: {
      bg: 'var(--color-primary-subtle)',
      border: 'rgba(30, 64, 175, 0.25)',
      color: 'var(--color-primary)',
      icon: Info
    },
    success: {
      bg: 'var(--color-success-subtle)',
      border: 'rgba(22, 163, 74, 0.25)',
      color: 'var(--color-success)',
      icon: CheckCircle2
    },
    warning: {
      bg: 'var(--color-warning-subtle)',
      border: 'rgba(234, 88, 12, 0.25)',
      color: 'var(--color-warning)',
      icon: AlertTriangle
    },
    critical: {
      bg: 'var(--color-critical-subtle)',
      border: 'rgba(220, 38, 38, 0.25)',
      color: 'var(--color-critical)',
      icon: AlertOctagon
    }
  };

  const config = configs[variant] || configs.info;
  const Icon = config.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text)'
      }}
      className={className}
    >
      <div style={{ color: config.color, marginTop: 2, display: 'flex' }}>
        <Icon size={18} />
      </div>
      <div style={{ flex: 1 }}>
        {title && (
          <strong style={{ fontSize: '0.85rem', color: config.color, display: 'block', marginBottom: 2 }}>
            {title}
          </strong>
        )}
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
