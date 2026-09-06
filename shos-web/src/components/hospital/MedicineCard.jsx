import React from 'react';
import { Pill, AlertTriangle, ShoppingCart } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

export const MedicineCard = ({
  medicine,
  onReorder,
  className = ''
}) => {
  const isCritical = medicine.status?.includes('Critical') || medicine.stock <= medicine.minLevel;

  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        borderLeft: isCritical ? '4px solid var(--color-critical)' : '4px solid var(--color-border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Pill size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            {medicine.code}
          </span>
        </div>
        <StatusBadge status={medicine.status} />
      </div>

      <div>
        <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>{medicine.name}</strong>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
          {medicine.category}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 8, fontSize: '0.8rem' }}>
        <span>Stock: <strong style={{ color: isCritical ? 'var(--color-critical)' : 'var(--color-success)' }}>{medicine.stock} {medicine.unit}</strong></span>
        <span>Min: {medicine.minLevel} {medicine.unit}</span>
      </div>

      {onReorder && (
        <Button variant={isCritical ? 'critical' : 'outline'} size="sm" onClick={() => onReorder(medicine)}>
          <ShoppingCart size={13} /> Reorder
        </Button>
      )}
    </div>
  );
};
