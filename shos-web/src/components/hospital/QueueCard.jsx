import React from 'react';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const QueueCard = ({
  token,
  currentCabin,
  estimatedWaitMinutes,
  queuePosition,
  department = 'Cardiology',
  className = ''
}) => {
  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 20,
        borderTop: '4px solid var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 12
      }}
    >
      <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-dim)', fontWeight: 700 }}>
        {department} OPD Queue
      </span>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1
        }}
      >
        {token}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Badge variant="primary" size="sm">
          Position: #{queuePosition || 3}
        </Badge>
        <Badge variant="warning" size="sm" icon={Clock}>
          ~{estimatedWaitMinutes || 18}m wait
        </Badge>
      </div>

      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--color-bg-subtle)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)'
        }}
      >
        Cabin Assigned: <strong>{currentCabin || 'Room 102 (OPD Ground Floor)'}</strong>
      </div>
    </div>
  );
};
