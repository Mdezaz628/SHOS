import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // primary | secondary | success | warning | critical | neutral
  icon: Icon,
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeStyle = size === 'sm' ? { fontSize: '0.7rem', padding: '2px 6px' } : {};

  return (
    <span className={`badge badge-${variant} ${className}`} style={sizeStyle} {...props}>
      {Icon && <Icon size={size === 'sm' ? 11 : 13} />}
      {children}
    </span>
  );
};
