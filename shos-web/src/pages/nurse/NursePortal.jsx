import React, { useState } from 'react';
import {
  LayoutDashboard,
  BedDouble,
  Activity,
  Pill,
  CheckSquare,
  Users
} from 'lucide-react';
import { NurseDashboardHome } from './NurseDashboardHome';
import { NurseWardView } from './NurseWardView';
import { VitalsEntryModal } from './VitalsEntryModal';

export const NursePortal = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'ward_view'
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [selectedPatientForVitals, setSelectedPatientForVitals] = useState({
    name: 'Rahul Sharma',
    uhid: 'UHID-10492',
    bed: 'Ward A — Bed 02',
    vitals: {
      temperature: '98.6 °F',
      bloodPressure: '130/85 mmHg',
      pulse: '76 bpm',
      spo2: '98%',
      respiratoryRate: '18 /min',
      weight: '74 kg'
    }
  });

  const subNavItems = [
    { id: 'overview', label: 'Nurse Station Overview', icon: LayoutDashboard },
    { id: 'ward_view', label: 'Ward A Bed & Patient Roster', icon: BedDouble, badge: 'Ward A' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Nurse Sub-Navigation Tab Bar */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          borderBottom: '1px solid var(--color-border)',
          overflowX: 'auto',
          paddingBottom: 4
        }}
      >
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: isActive ? 'var(--color-secondary-subtle)' : 'transparent',
                color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Screen Views */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <NurseDashboardHome
            onNavigate={setActiveTab}
            onOpenVitalsModal={() => setVitalsModalOpen(true)}
          />
        )}

        {activeTab === 'ward_view' && <NurseWardView />}
      </div>

      {/* Vitals Entry Modal */}
      <VitalsEntryModal
        patient={selectedPatientForVitals}
        isOpen={vitalsModalOpen}
        onClose={() => setVitalsModalOpen(false)}
        onSaveVitals={(saved) => {
          alert(`Saved vitals for ${saved.patientName}: BP ${saved.bloodPressure}, SpO2 ${saved.spo2}`);
        }}
      />
    </div>
  );
};
