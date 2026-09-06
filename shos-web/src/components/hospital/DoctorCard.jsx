import React from 'react';
import { Stethoscope, Clock, Calendar, Star } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DoctorCard = ({
  doctor,
  onBook,
  className = ''
}) => {
  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <Avatar name={doctor.name} size="lg" status={doctor.available ? 'online' : 'offline'} />
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '0.95rem', color: 'var(--color-text)', display: 'block' }}>
            {doctor.name}
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            {doctor.department}
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
            {doctor.designation || 'Consultant Specialist'} • {doctor.experience || '10+ yrs exp'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={13} /> {doctor.timings || '09:00 AM - 02:00 PM'}
        </span>
        <Badge variant={doctor.available ? 'success' : 'neutral'} size="sm">
          {doctor.available ? 'Available Today' : 'On Leave'}
        </Badge>
      </div>

      {onBook && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => onBook(doctor)}
          disabled={!doctor.available}
          style={{ width: '100%', marginTop: 4 }}
        >
          Book Consultation
        </Button>
      )}
    </div>
  );
};
