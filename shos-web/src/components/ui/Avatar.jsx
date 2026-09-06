import React from 'react';

export const Avatar = ({
  name = 'User',
  src,
  size = 'md', // sm | md | lg | xl
  status, // online | busy | offline
  className = ''
}) => {
  const pixelMap = { sm: 28, md: 36, lg: 48, xl: 64 };
  const pixel = pixelMap[size] || 36;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: pixel,
        height: pixel,
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-subtle)',
        color: 'var(--color-primary)',
        fontWeight: 700,
        fontSize: pixel * 0.4,
        overflow: 'visible',
        flexShrink: 0
      }}
      className={className}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        initials
      )}

      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: Math.max(8, pixel * 0.25),
            height: Math.max(8, pixel * 0.25),
            borderRadius: '50%',
            border: '2px solid #ffffff',
            backgroundColor:
              status === 'online'
                ? 'var(--color-success)'
                : status === 'busy'
                ? 'var(--color-critical)'
                : 'var(--color-text-dim)'
          }}
        />
      )}
    </div>
  );
};
