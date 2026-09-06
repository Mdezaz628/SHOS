import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search patients, records, doctors...',
  onClear,
  className = '',
  ...props
}) => {
  return (
    <div style={{ position: 'relative', width: '100%' }} className={className}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', display: 'flex' }}>
        <Search size={16} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="shos-input-field"
        style={{ paddingLeft: 36, paddingRight: value ? 36 : 12, borderRadius: 'var(--radius-full)' }}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-dim)',
            display: 'flex',
            padding: 2
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
