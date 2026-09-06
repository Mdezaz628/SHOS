import React from 'react';
import { User, Phone, AlertCircle, HeartPulse } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export const PatientCard = ({
  patient,
  onSelect,
  className = ''
}) => {
  return (
    <div
      className={`shos-card ${className}`}
      onClick={() => onSelect?.(patient)}
      style={{
        padding: 16,
        cursor: onSelect ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={patient.name} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {patient.name}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
            UHID: {patient.uhid || patient.id || 'SHOS-P-001'}
          </span>
        </div>
        {patient.bloodGroup && (
          <Badge variant="critical" size="sm">
            {patient.bloodGroup}
          </Badge>
        )}
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div>
          Age / Gender: <strong>{patient.age} yrs • {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : patient.gender}</strong>
        </div>
        {patient.diagnosis && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)' }}>
            <HeartPulse size={14} />
            <span>{patient.diagnosis}</span>
          </div>
        )}
        {patient.doctor && (
          <div>
            Attending: <strong>{patient.doctor}</strong>
          </div>
        )}
      </div>

      {patient.emergencyContact && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8, fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Phone size={12} />
          <span>Contact: {patient.emergencyContact}</span>
        </div>
      )}
    </div>
  );
};
