import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  options = [],
  error,
  id,
  className = '',
  value,
  onChange,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`shos-input-wrap ${className}`}>
      {label && (
        <label htmlFor={selectId} className="shos-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`shos-input-field ${error ? 'shos-input-error' : ''}`}
          style={{ appearance: 'none', paddingRight: 36 }}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-dim)', display: 'flex' }}>
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <span className="shos-error-text">{error}</span>}
    </div>
  );
};
