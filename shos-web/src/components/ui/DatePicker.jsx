import React from 'react';
import { Calendar } from 'lucide-react';

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className={`shos-input-wrap ${className}`}>
      {label && <label className="shos-label">{label}</label>}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="date"
          value={value}
          onChange={onChange}
          className={`shos-input-field ${error ? 'shos-input-error' : ''}`}
          style={{ paddingRight: 36 }}
          {...props}
        />
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-dim)', display: 'flex' }}>
          <Calendar size={16} />
        </div>
      </div>
      {error && <span className="shos-error-text">{error}</span>}
    </div>
  );
};
