import React from 'react';
import { BedDouble, Wind, User, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const BedCard = ({
  bed,
  onToggleStatus,
  className = ''
}) => {
  const isOccupied = bed.status === 'Occupied';

  return (
    <div
      className={`shos-card ${className}`}
      onClick={() => onToggleStatus?.(bed)}
      style={{
        padding: 16,
        cursor: onToggleStatus ? 'pointer' : 'default',
        borderLeft: isOccupied ? '4px solid var(--color-critical)' : '4px solid var(--color-success)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BedDouble size={18} style={{ color: isOccupied ? 'var(--color-critical)' : 'var(--color-success)' }} />
          <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>{bed.id}</strong>
        </div>
        <StatusBadge status={bed.status} />
      </div>

      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
          {bed.patient ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={14} style={{ color: 'var(--color-text-dim)' }} />
              {bed.patient}
            </span>
          ) : (
            <span style={{ color: 'var(--color-text-dim)', fontStyle: 'italic' }}>Sanitized & Available</span>
          )}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
          Condition: <strong>{bed.condition || 'Normal'}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 8, fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>
        <span>{bed.ward || 'General Ward'}</span>
        {bed.ventilator && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--color-primary)', fontWeight: 600 }}>
            <Wind size={12} /> Ventilator On
          </span>
        )}
      </div>
    </div>
  );
};
