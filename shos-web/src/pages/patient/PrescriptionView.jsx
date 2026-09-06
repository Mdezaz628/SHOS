import React from 'react';
import {
  Pill,
  Calendar,
  User,
  Clock,
  Printer,
  Download,
  ShoppingCart,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';

export const PrescriptionView = () => {
  const currentPrescription = {
    id: 'RX-2026-9042',
    doctor: 'Dr. Vivek Mehra',
    qualification: 'MD, DM (Cardiology)',
    department: 'Department of Cardiology',
    date: '05 Sep 2026',
    diagnosis: 'Mild Essential Hypertension & Dyslipidemia (Stage 1)',
    nextFollowUp: '19 Sep 2026 (After 2 weeks)',
    medicines: [
      {
        name: 'Paracetamol',
        dosage: '500 mg',
        frequency: '1-0-1',
        duration: '5 Days',
        instructions: 'After Food (SOS if fever or headache)'
      },
      {
        name: 'Atorvastatin',
        dosage: '20 mg',
        frequency: '0-0-1',
        duration: '30 Days',
        instructions: 'After Dinner (Daily lipid control)'
      },
      {
        name: 'Pantoprazole',
        dosage: '40 mg',
        frequency: '1-0-0',
        duration: '15 Days',
        instructions: 'Before Breakfast on empty stomach'
      },
      {
        name: 'Amlodipine',
        dosage: '5 mg',
        frequency: '0-0-1',
        duration: '30 Days',
        instructions: 'At Bedtime (Blood pressure management)'
      }
    ]
  };

  const medicineCols = [
    { header: 'Medicine Name', key: 'name', render: (r) => <strong style={{ color: 'var(--color-text)' }}>{r.name}</strong> },
    { header: 'Dosage', key: 'dosage', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.dosage}</span> },
    { header: 'Frequency', key: 'frequency', render: (r) => <Badge variant="primary" size="sm">{r.frequency}</Badge> },
    { header: 'Duration', key: 'duration', render: (r) => <span>{r.duration}</span> },
    { header: 'Instructions', key: 'instructions', render: (r) => <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{r.instructions}</span> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960, margin: '0 auto' }}>
      {/* Header with Print & Order Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Digital Medical Prescription
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Digitally signed outpatient prescription and medication instructions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" icon={Printer} onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="primary" size="sm" icon={ShoppingCart} onClick={() => alert('Order forwarded to SHOS Pharmacy. You can collect at Window 3.')}>
            Order from Pharmacy
          </Button>
        </div>
      </div>

      {/* Structured Prescription Sheet */}
      <div
        className="shos-card animate-fade-in"
        style={{
          padding: '28px 32px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Doctor & Hospital Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--color-primary-subtle)', paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {currentPrescription.doctor}
            </h3>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              {currentPrescription.qualification} • {currentPrescription.department}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
              SHOS Central Multispecialty Hospital • Reg No: MCI-2014-9812
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
              Prescription ID
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-text)' }}>
              {currentPrescription.id}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              Date: <strong>{currentPrescription.date}</strong>
            </div>
          </div>
        </div>

        {/* Patient & Diagnosis Bar */}
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: '0.82rem' }}>
          <div>
            Patient: <strong>Rahul Sharma</strong> (32y / Male) • UHID: <span style={{ fontFamily: 'var(--font-mono)' }}>SHOS-P-90214</span>
          </div>
          <div>
            Provisional Diagnosis: <strong style={{ color: 'var(--color-primary)' }}>{currentPrescription.diagnosis}</strong>
          </div>
        </div>

        {/* Prescription Table (Rx) */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'serif', color: 'var(--color-primary)' }}>
              ℞
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Prescribed Medications
            </span>
          </div>

          <Table columns={medicineCols} data={currentPrescription.medicines} />
        </div>

        {/* General Instructions & Follow-up */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
              Special Clinical Advice:
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              1. Monitor blood pressure once daily in the morning.<br />
              2. Avoid excessive dietary salt and processed snacks.<br />
              3. Repeat Fasting Lipid Profile in 4 weeks before next consultation.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Next Follow-Up Date
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>
              {currentPrescription.nextFollowUp}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: 4 }}>
              Digitally Signed by {currentPrescription.doctor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
