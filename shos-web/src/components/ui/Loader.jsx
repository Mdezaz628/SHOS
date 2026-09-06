import React from 'react';

export const Loader = ({ size = 'md', message, center = true, className = '' }) => {
  const pixelSize = size === 'sm' ? 20 : size === 'lg' ? 44 : 32;

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }} className={className}>
      <div
        style={{
          width: pixelSize,
          height: pixelSize,
          borderRadius: '50%',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {message && (
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {message}
        </span>
      )}
    </div>
  );

  if (center) {
    return (
      <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {content}
      </div>
    );
  }

  return content;
};
