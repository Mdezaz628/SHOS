import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`shos-input-wrap ${className}`}>
      {label && (
        <label htmlFor={inputId} className="shos-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', display: 'flex' }}>
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          className={`shos-input-field ${error ? 'shos-input-error' : ''}`}
          style={Icon ? { paddingLeft: 36 } : {}}
          {...props}
        />
      </div>
      {error && <span className="shos-error-text">{error}</span>}
      {!error && helperText && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
