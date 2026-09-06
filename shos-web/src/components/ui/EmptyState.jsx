import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records to display',
  description = 'There are no active records found for this view right now.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-border)'
      }}
      className={className}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-subtle)',
          color: 'var(--color-text-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={26} />
      </div>
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4, maxWidth: 360 }}>
          {description}
        </p>
      </div>
      {actionLabel && (
        <Button variant="outline" size="sm" onClick={onAction} style={{ marginTop: 6 }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
