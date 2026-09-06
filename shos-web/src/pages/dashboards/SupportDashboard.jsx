import React from 'react';
import { HeartHandshake, CheckSquare, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { TaskCard } from '../../components/hospital/TaskCard';

export const SupportDashboard = () => {
  const supportTasks = [
    { title: 'Transfer patient Rajesh Malhotra to Cath Lab', location: 'Trauma Bay 1 → Cath Lab', priority: 'High', completed: false },
    { title: 'Stretcher transfer for CT Scan (Sunita Verma)', location: 'Bay 3 → Radiology', priority: 'High', completed: false },
    { title: 'Deliver 2 Oxygen cylinders to HDU Ward B', location: 'Central Gas Depot → HDU', priority: 'Normal', completed: true },
    { title: 'Wheelchair assistance for OPD Discharge', location: 'Ward A → Main Gate', priority: 'Normal', completed: false }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
          Ward Support & Patient Transit Dispatch
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Wheelchair transfers, stretcher transport, and equipment mobility.
        </p>
      </div>

      <Card title="Active Transport & Transit Requests" subtitle="Assigned to Support Pool Shift B">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {supportTasks.map((t, idx) => (
            <TaskCard key={idx} task={t} onComplete={() => alert(`Completed task: ${t.title}`)} />
          ))}
        </div>
      </Card>
    </div>
  );
};
