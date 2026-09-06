import React from 'react';
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

export const TaskCard = ({
  task,
  onComplete,
  className = ''
}) => {
  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <CheckSquare size={18} style={{ color: task.completed ? 'var(--color-success)' : 'var(--color-text-dim)', marginTop: 2 }} />
        <div>
          <strong style={{ fontSize: '0.88rem', color: 'var(--color-text)', textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
            Sector: <strong>{task.location}</strong> • Priority: <strong style={{ color: task.priority === 'High' ? 'var(--color-critical)' : 'inherit' }}>{task.priority}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StatusBadge status={task.status || (task.completed ? 'Completed' : 'Pending')} />
        {!task.completed && onComplete && (
          <Button variant="outline" size="sm" onClick={() => onComplete(task)}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
};
