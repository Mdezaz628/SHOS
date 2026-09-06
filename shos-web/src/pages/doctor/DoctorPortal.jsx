import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Eye,
  FileText,
  Pill,
  FlaskConical,
  Share2,
  Stethoscope
} from 'lucide-react';
import { DoctorDashboardHome } from './DoctorDashboardHome';
import { DoctorPatientList } from './DoctorPatientList';
import { PatientClinicalView } from './PatientClinicalView';
import { PrescriptionCreator } from './PrescriptionCreator';
import { ClinicalNotesForm } from './ClinicalNotesForm';

export const DoctorPortal = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'patients', 'clinical_view', 'prescriptions'
  const [selectedPatient, setSelectedPatient] = useState({
    name: 'Rahul Sharma',
    uhid: 'UHID-10492',
    age: 45,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+91 98765 43210',
    admittedBed: 'Ward A — Bed 02',
    admissionStatus: 'Admitted Inpatient (Post-Angina Observation)',
    assignedDoctor: 'Dr. Vivek Mehra (Cardiology)'
  });

  const subNavItems = [
    { id: 'overview', label: 'Doctor Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Queue & Roster', icon: Users, badge: '5 Waiting' },
    { id: 'clinical_view', label: 'Patient Clinical EHR', icon: Eye },
    { id: 'prescriptions', label: 'Prescription Desk (Rx)', icon: Pill }
  ];

  const handleSelectPatient = (pt) => {
    setSelectedPatient(pt);
    setActiveTab('clinical_view');
  };

  const handleCallNext = () => {
    alert('Called Token #25 (Pooja Verma) to Cabin 104.');
    setSelectedPatient({
      name: 'Pooja Verma',
      uhid: 'UHID-10844',
      age: 38,
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+91 98112 23344',
      admittedBed: 'Cabin 104',
      admissionStatus: 'In Consultation',
      assignedDoctor: 'Dr. Vivek Mehra (Cardiology)'
    });
    setActiveTab('clinical_view');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Doctor Sub-Navigation Tab Bar */}
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
                backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
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
                    backgroundColor: 'var(--color-secondary)',
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

      {/* Screen Rendering */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <DoctorDashboardHome
            onNavigate={setActiveTab}
            onCallNext={handleCallNext}
            activePatient={selectedPatient}
          />
        )}

        {activeTab === 'patients' && (
          <DoctorPatientList
            onSelectPatient={handleSelectPatient}
            onCallPatient={handleSelectPatient}
          />
        )}

        {activeTab === 'clinical_view' && (
          <PatientClinicalView
            patient={selectedPatient}
            onBack={() => setActiveTab('patients')}
          />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionCreator
            patient={selectedPatient}
            onSavePrescription={() => setActiveTab('clinical_view')}
            onCancel={() => setActiveTab('clinical_view')}
          />
        )}
      </div>
    </div>
  );
};
