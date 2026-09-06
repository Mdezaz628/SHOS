import React from 'react';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

export const AppointmentCard = ({
  appointment,
  onAction,
  actionLabel = 'View Details',
  className = ''
}) => {
  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-primary)' }}>
          Token: {appointment.token}
        </span>
        <StatusBadge status={appointment.status} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.82rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <User size={14} style={{ color: 'var(--color-text-dim)' }} />
          <span>{appointment.patient}</span>
        </div>
        <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Stethoscope size={14} style={{ color: 'var(--color-text-dim)' }} />
          <span>{appointment.doctor} • {appointment.dept}</span>
        </div>
        <div style={{ color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Clock size={13} />
          <span>Slot: {appointment.slot}</span>
        </div>
      </div>

      {onAction && (
        <Button variant="outline" size="sm" onClick={() => onAction(appointment)} style={{ width: '100%' }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
