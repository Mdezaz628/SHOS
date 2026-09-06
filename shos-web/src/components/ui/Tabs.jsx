import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--color-border)',
        overflowX: 'auto',
        paddingBottom: 2
      }}
      className={className}
    >
      {tabs.map((tab) => {
        const id = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const count = typeof tab === 'object' ? tab.count : undefined;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'var(--color-bg-subtle)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-dim)'
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
