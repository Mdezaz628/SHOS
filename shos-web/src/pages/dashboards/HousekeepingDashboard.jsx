import React, { useState } from 'react';
import { Trash2, BedDouble, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { TaskCard } from '../../components/hospital/TaskCard';

export const HousekeepingDashboard = () => {
  const [sanitationTasks, setSanitationTasks] = useState([
    { title: 'Sanitize & sterilize ICU Bed 103 (Post-Discharge)', location: 'ICU Room 103', priority: 'High', completed: false },
    { title: 'Terminal disinfection of OT-2 after trauma surgery', location: 'Operating Theater 2', priority: 'High', completed: false },
    { title: 'Hazardous bio-medical waste segregation & seal', location: 'Central Waste Depository', priority: 'Normal', completed: true },
    { title: 'Replenish PPE dispensers in Emergency triage bay', location: 'ER Portico', priority: 'Normal', completed: false }
  ]);

  const handleComplete = (task) => {
    setSanitationTasks((prev) =>
      prev.map((t) => (t.title === task.title ? { ...t, completed: true } : t))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
          Hospital Housekeeping & Bed Sanitization
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Infection Control, Terminal Disinfection & Bio-Medical Waste Management
        </p>
      </div>

      <Card title="Bed Sanitization & OT Disinfection Log" subtitle="Ensure 100% NABH infection control adherence">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sanitationTasks.map((t, idx) => (
            <TaskCard key={idx} task={t} onComplete={handleComplete} />
          ))}
        </div>
      </Card>
    </div>
  );
};
