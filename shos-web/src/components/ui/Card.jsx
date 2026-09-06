import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  footer,
  className = '',
  padding = 20,
  hoverable = true,
  ...props
}) => {
  return (
    <div
      className={`shos-card ${hoverable ? 'hover-lift' : 'no-hover'} ${className}`}
      style={{ overflow: 'hidden' }}
      {...props}
    >
      {(title || action) && (
        <div
          style={{
            padding: `${padding * 0.75}px ${padding}px`,
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg-subtle)'
          }}
        >
          <div>
            {title && (
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                {title}
              </h4>
            )}
            {subtitle && (
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div style={{ padding }}>{children}</div>

      {footer && (
        <div
          style={{
            padding: `${padding * 0.6}px ${padding}px`,
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-subtle)'
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
