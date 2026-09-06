import React from 'react';
import { AlertOctagon, HeartPulse, Clock, Activity } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const EmergencyCard = ({
  emergencyCase,
  onAttend,
  className = ''
}) => {
  const isLevel1 = emergencyCase.triageLevel?.includes('Level 1');

  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 16,
        borderLeft: isLevel1 ? '5px solid var(--color-critical)' : '5px solid var(--color-warning)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertOctagon size={18} style={{ color: isLevel1 ? 'var(--color-critical)' : 'var(--color-warning)' }} />
          <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            {emergencyCase.id}
          </strong>
        </div>
        <Badge variant={isLevel1 ? 'critical' : 'warning'} size="sm">
          {emergencyCase.triageLevel?.split(' - ')[0] || 'Level 1'}
        </Badge>
      </div>

      <div>
        <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>
          {emergencyCase.patientName} ({emergencyCase.age}y/{emergencyCase.gender})
        </strong>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-critical)', fontWeight: 600, marginTop: 3 }}>
          {emergencyCase.complaint}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
        <span>Bay: <strong>{emergencyCase.bay}</strong></span>
        <span>Doctor: <strong>{emergencyCase.assignedDoctor?.split(' (')[0]}</strong></span>
      </div>
    </div>
  );
};
