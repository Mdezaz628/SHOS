import React from 'react';
import { Ambulance, MapPin, Phone, Radio } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const AmbulanceCard = ({
  ambulance,
  onDispatch,
  className = ''
}) => {
  const isEnRoute = ambulance.status?.includes('Route');

  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 16,
        borderLeft: isEnRoute ? '4px solid var(--color-critical)' : '4px solid var(--color-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Ambulance size={18} style={{ color: 'var(--color-primary)' }} />
          <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{ambulance.id}</strong>
        </div>
        <StatusBadge status={ambulance.status} />
      </div>

      <div style={{ fontSize: '0.82rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{ambulance.type}</div>
        <div style={{ color: 'var(--color-text-muted)', marginTop: 2 }}>Paramedic: <strong>{ambulance.driver}</strong></div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-dim)', borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
        <MapPin size={13} style={{ color: 'var(--color-critical)' }} />
        <span>Location: <strong>{ambulance.location}</strong></span>
      </div>
    </div>
  );
};
