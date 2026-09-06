import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Unable to fetch hospital records. Please verify your connection or try again.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: 'var(--color-critical-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(220, 38, 38, 0.2)'
      }}
      className={className}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-critical)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <AlertCircle size={24} />
      </div>
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-critical)' }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4, maxWidth: 360 }}>
          {description}
        </p>
      </div>
      {onRetry && (
        <Button variant="critical" size="sm" onClick={onRetry} style={{ marginTop: 4 }}>
          Try Again
        </Button>
      )}
    </div>
  );
};
