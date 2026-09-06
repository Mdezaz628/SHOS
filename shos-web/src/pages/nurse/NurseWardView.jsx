import React, { useState } from 'react';
import {
  BedDouble,
  User,
  Activity,
  Pill,
  FileText,
  CheckSquare,
  Square,
  Clock,
  AlertTriangle,
  Heart,
  Thermometer,
  Wind,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { VitalsEntryModal } from './VitalsEntryModal';

export const NurseWardView = () => {
  // Active ward state with patients, beds, vitals, medications, doctor instructions, and tasks
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      uhid: 'UHID-10492',
      age: 45,
      gender: 'Male',
      ward: 'Ward A — Semi-Private Unit',
      bed: 'Bed 02',
      bedCode: '🔴',
      status: 'Under Active Observation',
      doctor: 'Dr. Vivek Mehra (Cardiology)',
      allergies: 'Penicillin (Anaphylaxis Risk)',
      vitals: {
        temperature: '98.6 °F',
        bloodPressure: '130/85 mmHg',
        pulse: '76 bpm',
        spo2: '98%',
        respiratoryRate: '18 /min',
        weight: '74 kg',
        recordedAt: '08:30 AM'
      },
      medications: [
        { id: 101, name: 'Metoprolol Succinate 50mg', time: '02:00 PM', status: 'DUE NOW', instructions: 'Oral after lunch' },
        { id: 102, name: 'Atorvastatin 20mg', time: '09:00 PM', status: 'Pending', instructions: 'Bedtime oral' },
        { id: 103, name: 'Aspirin 75mg', time: '08:00 AM', status: 'Administered', instructions: 'Taken with breakfast' }
      ],
      doctorInstructions: 'Maintain telemetry ECG monitor lead continuous. Strictly monitor fluid balance chart. Bed rest advised; report immediately if chest tightness recurs.',
      tasks: [
        { id: 201, title: 'Check 2-hourly SpO2 & BP log', completed: false, priority: 'High' },
        { id: 202, title: 'Flush 20G IV Cannula left forearm with heparinized saline', completed: true, priority: 'Normal' },
        { id: 203, title: 'Send evening repeat Fasting Lipid Panel requisition to Central Lab', completed: false, priority: 'Normal' }
      ]
    },
    {
      id: 2,
      name: 'Anita Deshmukh',
      uhid: 'UHID-8832',
      age: 48,
      gender: 'Female',
      ward: 'Ward A — Semi-Private Unit',
      bed: 'Bed 04',
      bedCode: '🟡',
      status: 'Scheduled Post-Op Intake',
      doctor: 'Dr. Vivek Mehra (Cardiology)',
      allergies: 'Sulfa Drugs',
      vitals: {
        temperature: '99.1 °F',
        bloodPressure: '124/78 mmHg',
        pulse: '82 bpm',
        spo2: '97%',
        respiratoryRate: '16 /min',
        weight: '62 kg',
        recordedAt: '07:45 AM'
      },
      medications: [
        { id: 104, name: 'Cefuroxime 500mg IV', time: '01:00 PM', status: 'DUE NOW', instructions: 'IV infusion over 30 mins' },
        { id: 105, name: 'Paracetamol 650mg', time: '03:00 PM', status: 'Pending', instructions: 'Oral post meal' }
      ],
      doctorInstructions: 'Post-CABG Day 3 recovery protocol. Incentive spirometry 10 breaths every 2 hours. Monitor drain output and sternal dressing.',
      tasks: [
        { id: 204, title: 'Inspect sternotomy dressing for active soakage', completed: false, priority: 'High' },
        { id: 205, title: 'Record drain volume in Shift B chart', completed: false, priority: 'Normal' }
      ]
    }
  ]);

  const [activeVitalsModalPatient, setActiveVitalsModalPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(1);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Administer Medication action
  const handleAdministerMed = (patientId, medId) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          medications: p.medications.map((m) =>
            m.id === medId ? { ...m, status: 'Administered' } : m
          )
        };
      })
    );
  };

  // Toggle Nurse Task completed
  const handleToggleTask = (patientId, taskId) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          tasks: p.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        };
      })
    );
  };

  // Save Vitals callback
  const handleSaveVitals = (newVitals) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.uhid !== newVitals.patientId) return p;
        return {
          ...p,
          vitals: {
            ...p.vitals,
            temperature: newVitals.temperature,
            bloodPressure: newVitals.bloodPressure,
            pulse: newVitals.pulse,
            spo2: newVitals.spo2,
            respiratoryRate: newVitals.respiratoryRate,
            weight: newVitals.weight,
            recordedAt: newVitals.recordedAt
          }
        };
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Ward Bed Census Bar matching User Spec:
          Ward A: 🟢 Bed 01, 🔴 Bed 02, 🟢 Bed 03, 🟡 Bed 04
      */}
      <div
        className="shos-card"
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Ward A Inpatient Roster & Bed Station
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
            Semi-Private Unit • Assigned Shift In-Charge: <strong>Sister Mary Joseph</strong>
          </p>
        </div>

        {/* Rapid bed switcher buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            Ward A Beds:
          </span>
          {[
            { id: 0, num: 'Bed 01', code: '🟢', status: 'Vacant', patientId: null },
            { id: 1, num: 'Bed 02', code: '🔴', status: 'Rahul Sharma', patientId: 1 },
            { id: 2, num: 'Bed 03', code: '🟢', status: 'Vacant', patientId: null },
            { id: 3, num: 'Bed 04', code: '🟡', status: 'Anita Deshmukh', patientId: 2 }
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              disabled={!b.patientId}
              onClick={() => b.patientId && setSelectedPatientId(b.patientId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: selectedPatientId === b.patientId ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: selectedPatientId === b.patientId ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                cursor: b.patientId ? 'pointer' : 'default',
                opacity: b.patientId ? 1 : 0.6
              }}
            >
              <span>{b.code}</span>
              <strong style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>{b.num}</strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                {b.patientId ? `(${b.status.split(' ')[0]})` : '(Free)'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Patient Ward View Container matching User Spec:
          - Patient
          - Bed
          - Vitals
          - Medication
          - Doctor Instructions
          - Tasks
      */}
      <div className="shos-card animate-fade-in" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
        {/* 1. Patient & Bed Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 16,
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 14
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--color-secondary-subtle)',
                color: 'var(--color-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}
            >
              {activePatient.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                  {activePatient.name}
                </h2>
                <Badge variant="primary">{activePatient.uhid}</Badge>
                <Badge variant="teal">{activePatient.bedCode} {activePatient.bed}</Badge>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                Age: <strong>{activePatient.age} Yrs</strong> / {activePatient.gender} • Doctor: <strong>{activePatient.doctor}</strong> • Status: {activePatient.status}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              variant="primary"
              size="sm"
              icon={Activity}
              onClick={() => setActiveVitalsModalPatient(activePatient)}
            >
              [Record Vitals]
            </Button>
          </div>
        </div>

        {/* Allergies Warning */}
        <div
          style={{
            backgroundColor: '#fff1f2',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.82rem',
            color: 'var(--color-critical)'
          }}
        >
          <AlertTriangle size={16} />
          <span>
            <strong>Allergy Flag:</strong> Patient is allergic to <strong>{activePatient.allergies}</strong>. Check all medication orders before administration.
          </span>
        </div>

        {/* 2. Vitals Snapshot Card */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Patient Clinical Vitals
              </h3>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
              Last checked: {activePatient.vitals.recordedAt}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            {[
              { label: 'Temperature', val: activePatient.vitals.temperature, icon: Thermometer, color: 'var(--color-text)' },
              { label: 'Blood Pressure', val: activePatient.vitals.bloodPressure, icon: Heart, color: 'var(--color-primary)' },
              { label: 'Pulse Rate', val: activePatient.vitals.pulse, icon: Activity, color: 'var(--color-secondary)' },
              { label: 'SpO2 Oxygen', val: activePatient.vitals.spo2, icon: Wind, color: 'var(--color-success)' },
              { label: 'Resp. Rate', val: activePatient.vitals.respiratoryRate, icon: Activity, color: 'var(--color-text)' },
              { label: 'Weight', val: activePatient.vitals.weight, icon: User, color: 'var(--color-text)' }
            ].map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {v.label}
                  </span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: v.color, margin: '4px 0 0' }}>
                    {v.val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Medication & Doctor Instructions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* Medication Schedule */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 18
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Pill size={18} style={{ color: 'var(--color-secondary)' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                  Medication Administration Schedule
                </h4>
              </div>
              <Badge variant="teal">Shift B Roster</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activePatient.medications.map((med) => {
                const isDue = med.status === 'DUE NOW';
                const isAdministered = med.status === 'Administered';
                return (
                  <div
                    key={med.id}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: isDue ? '1.5px solid var(--color-warning)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--color-text)' }}>
                        {med.name}
                      </strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                        Due: <strong>{med.time}</strong> • {med.instructions}
                      </div>
                    </div>

                    <div>
                      {isAdministered ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={15} /> Administered
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={isDue ? 'primary' : 'outline'}
                          onClick={() => handleAdministerMed(activePatient.id, med.id)}
                        >
                          Mark Given
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Doctor Instructions */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 18
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Doctor's Shift Standing Instructions
              </h4>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                fontSize: '0.86rem',
                lineHeight: 1.6,
                color: 'var(--color-text)'
              }}
            >
              <p style={{ margin: 0 }}>
                "{activePatient.doctorInstructions}"
              </p>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
                <span>Signed: {activePatient.doctor}</span>
                <span>Verified: Today 08:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Nursing Care Tasks Checklist */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CheckSquare size={18} style={{ color: 'var(--color-primary)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Assigned Nursing Care Tasks & Checklists
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activePatient.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(activePatient.id, task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: task.completed ? 'var(--color-surface)' : '#ffffff',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {task.completed ? (
                  <CheckSquare size={18} style={{ color: 'var(--color-success)' }} />
                ) : (
                  <Square size={18} style={{ color: 'var(--color-text-muted)' }} />
                )}
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: task.completed ? 500 : 600,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
                    flex: 1
                  }}
                >
                  {task.title}
                </span>
                <Badge variant={task.priority === 'High' ? 'critical' : 'secondary'}>
                  {task.priority} Priority
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals Entry Modal */}
      <VitalsEntryModal
        patient={activeVitalsModalPatient}
        isOpen={!!activeVitalsModalPatient}
        onClose={() => setActiveVitalsModalPatient(null)}
        onSaveVitals={handleSaveVitals}
      />
    </div>
  );
};
