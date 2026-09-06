import React from 'react';
import { Bell, AlertOctagon, Info, CheckCircle2, Clock } from 'lucide-react';

export const NotificationCard = ({
  notification,
  onRead,
  className = ''
}) => {
  const isCritical = notification.priority === 'critical' || notification.priority === 'High';

  return (
    <div
      className={`shos-card ${className}`}
      onClick={() => onRead?.(notification)}
      style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        cursor: onRead ? 'pointer' : 'default',
        backgroundColor: notification.read ? 'var(--color-surface)' : 'var(--color-primary-subtle)',
        borderLeft: isCritical ? '4px solid var(--color-critical)' : '4px solid var(--color-primary)'
      }}
    >
      <div
        style={{
          color: isCritical ? 'var(--color-critical)' : 'var(--color-primary)',
          marginTop: 2
        }}
      >
        {isCritical ? <AlertOctagon size={18} /> : <Bell size={18} />}
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block' }}>
          {notification.title}
        </strong>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
          {notification.message}
        </p>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} /> {notification.timestamp || 'Just now'}
        </div>
      </div>
    </div>
  );
};
