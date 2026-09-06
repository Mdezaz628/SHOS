import React from 'react';
import { UserCheck, Clock, Building2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { StatusBadge } from '../ui/StatusBadge';

export const StaffCard = ({
  staff,
  onView,
  className = ''
}) => {
  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }}
    >
      <Avatar name={staff.name} size="md" status={staff.status?.includes('Active') ? 'online' : 'offline'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {staff.name}
        </strong>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          {staff.role}
        </span>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span>{staff.department}</span>
          <span>•</span>
          <span>{staff.shift}</span>
        </div>
      </div>
      <StatusBadge status={staff.status} />
    </div>
  );
};
