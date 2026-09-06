import React, { useState } from 'react';
import {
  User,
  Activity,
  Heart,
  FileText,
  FlaskConical,
  Pill,
  BedDouble,
  AlertTriangle,
  Plus,
  ArrowLeft,
  Calendar,
  Share2,
  Clock,
  CheckCircle2,
  Phone,
  Thermometer,
  Eye
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ClinicalNotesForm } from './ClinicalNotesForm';
import { PrescriptionCreator } from './PrescriptionCreator';
import { LabOrderModal } from './LabOrderModal';
import { ReferralModal } from './ReferralModal';

export const PatientClinicalView = ({ patient: propPatient, onBack }) => {
  // Default demo patient with rich data matching EHR specifications
  const [patient, setPatient] = useState(
    propPatient || {
      name: 'Rahul Sharma',
      uhid: 'UHID-10492',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98765 43210',
      admittedBed: 'Ward A — Bed 02',
      admissionStatus: 'Admitted Inpatient (Post-Angina Observation)',
      assignedDoctor: 'Dr. Vivek Mehra (Cardiology)'
    }
  );

  // Active modal / drawer state
  const [activeAction, setActiveAction] = useState(null); // 'notes', 'rx', 'lab', 'referral', null

  // Patient Clinical Data States
  const [medicalHistory, setMedicalHistory] = useState([
    { condition: 'Essential Hypertension', diagnosed: '2019 (6 yrs)', status: 'Active (On ACEi)' },
    { condition: 'Type-2 Diabetes Mellitus', diagnosed: '2021 (4 yrs)', status: 'Under Control (HbA1c 6.8%)' },
    { condition: 'Dyslipidemia', diagnosed: '2022', status: 'On Atorvastatin' },
    { condition: 'Appendectomy', diagnosed: '2015', status: 'Surgical Resection (Uneventful)' }
  ]);

  const [vitals, setVitals] = useState({
    temperature: '98.6 °F',
    bloodPressure: '130/85 mmHg',
    pulse: '76 bpm',
    spo2: '98%',
    respiratoryRate: '18 /min',
    weight: '74 kg',
    recordedAt: 'Today, 08:30 AM by Sister Deepa'
  });

  const [allergies, setAllergies] = useState([
    { allergen: 'Penicillin & Amoxicillin', reaction: 'Anaphylactoid Urticaria / Bronchospasm', severity: 'High / Critical' },
    { allergen: 'Sulfa Drugs (Sulfonamides)', reaction: 'Maculopapular Rash', severity: 'Moderate' }
  ]);

  const [previousReports, setPreviousReports] = useState([
    { title: '12-Lead Electrocardiogram (ECG)', date: '04 Sep 2026', result: 'Sinus rhythm, T-wave inversion in V4-V6', status: 'Reviewed' },
    { title: '2D Echocardiography', date: '01 Sep 2026', result: 'LVEF 52%, Mild concentric LVH, No clot', status: 'Normal' },
    { title: 'Chest Radiograph (X-Ray PA View)', date: '15 Aug 2026', result: 'Normal cardiothoracic ratio, clear costophrenic angles', status: 'Normal' }
  ]);

  const [labReports, setLabReports] = useState([
    { test: 'Lipid Profile Comprehensive', date: 'Today, 07:00 AM', result: 'Total Chol: 218 mg/dL (High), LDL: 134 mg/dL', status: 'Ready' },
    { test: 'Troponin-I High Sensitivity (hs-cTnI)', date: '04 Sep 2026', result: '0.012 ng/mL (Negative / Normal < 0.04)', status: 'Ready' },
    { test: 'Complete Blood Count (CBC)', date: '04 Sep 2026', result: 'Hb: 14.2 g/dL, WBC: 7,800 /mcL, Plt: 240k', status: 'Ready' },
    { test: 'Serum Creatinine & Urea (KFT)', date: '04 Sep 2026', result: 'Creatinine: 0.9 mg/dL, BUN: 14 mg/dL', status: 'Ready' }
  ]);

  const [prescriptions, setPrescriptions] = useState([
    { medicine: 'Atorvastatin 20mg', dosage: '20mg', frequency: '0-0-1', duration: '30 Days', instructions: 'After Food (Night)' },
    { medicine: 'Metoprolol Succinate 50mg', dosage: '50mg', frequency: '1-0-1', duration: '15 Days', instructions: 'After Food' },
    { medicine: 'Aspirin 75mg', dosage: '75mg', frequency: '1-0-0', duration: '30 Days', instructions: 'After Food' },
    { medicine: 'Pantoprazole 40mg', dosage: '40mg', frequency: '1-0-0', duration: '14 Days', instructions: 'Before Breakfast' }
  ]);

  const [admissions, setAdmissions] = useState([
    { ward: 'Ward A — Semi-Private Unit', bed: 'Bed 02', admittedDate: '04 Sep 2026', doctor: 'Dr. Vivek Mehra', reason: 'Unstable Angina observation', status: 'Current Active' },
    { ward: 'Day Care Surgery Unit', bed: 'Bed 08', admittedDate: '12 Jan 2024', doctor: 'Dr. R. Gupta', reason: 'Diagnostic Coronary Angiography', status: 'Discharged' }
  ]);

  const [clinicalNotesList, setClinicalNotesList] = useState([
    {
      date: '04 Sep 2026, 09:00 PM',
      doctor: 'Dr. Vivek Mehra',
      assessment: 'Class II Angina Pectoris, hemodynamically stable.',
      plan: 'Start dual antiplatelets and statins, admit to Ward A Bed 02 for 48h ECG monitoring.'
    }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Clinical Header & Action Bar */}
      <div
        className="shos-card"
        style={{
          padding: '20px 24px',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '5px solid var(--color-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft size={16} style={{ marginRight: 4 }} />
              Back
            </Button>
          )}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}
          >
            {patient.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                {patient.name}
              </h2>
              <Badge variant="primary">{patient.uhid}</Badge>
              <Badge variant="teal">{patient.admittedBed}</Badge>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Age: <strong>{patient.age} Yrs</strong> • Gender: <strong>{patient.gender}</strong> • Blood Group: <strong style={{ color: 'var(--color-critical)' }}>{patient.bloodGroup}</strong> • Phone: {patient.phone}
            </p>
          </div>
        </div>

        {/* 4 Major Clinical Action Triggers from Specification */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveAction('notes')}
          >
            <FileText size={15} style={{ marginRight: 6 }} />
            [Clinical Notes]
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveAction('rx')}
          >
            <Pill size={15} style={{ marginRight: 6 }} />
            [Prescription]
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveAction('lab')}
          >
            <FlaskConical size={15} style={{ marginRight: 6 }} />
            [Order Lab Test]
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveAction('referral')}
          >
            <Share2 size={15} style={{ marginRight: 6 }} />
            [Refer Specialist]
          </Button>
        </div>
      </div>

      {/* Embedded Action Drawers / Modals */}
      {activeAction === 'notes' && (
        <ClinicalNotesForm
          patient={patient}
          onSave={(newNotes) => {
            setClinicalNotesList([
              {
                date: 'Just Now',
                doctor: 'Dr. Vivek Mehra',
                assessment: newNotes.assessment,
                plan: newNotes.clinicalNotes
              },
              ...clinicalNotesList
            ]);
          }}
          onCancel={() => setActiveAction(null)}
        />
      )}

      {activeAction === 'rx' && (
        <PrescriptionCreator
          patient={patient}
          onSavePrescription={(newRx) => {
            setPrescriptions([...newRx.medicines, ...prescriptions]);
          }}
          onCancel={() => setActiveAction(null)}
        />
      )}

      <LabOrderModal
        patient={patient}
        isOpen={activeAction === 'lab'}
        onClose={() => setActiveAction(null)}
        onOrderSuccess={(order) => {
          setLabReports([
            { test: order.testName, date: 'Today (Just Ordered)', result: 'Processing in Lab', status: 'Pending' },
            ...labReports
          ]);
        }}
      />

      <ReferralModal
        patient={patient}
        isOpen={activeAction === 'referral'}
        onClose={() => setActiveAction(null)}
        onReferralSuccess={(ref) => {
          alert(`Referral sent to ${ref.specialty} successfully!`);
        }}
      />

      {/* 🔴 Allergies Warning Banner (Phase 14 Specification) */}
      <div
        className="shos-card"
        style={{
          padding: '14px 20px',
          backgroundColor: '#fff1f2',
          border: '1.5px solid #f87171',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={22} style={{ color: 'var(--color-critical)' }} />
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-critical)' }}>
              KNOWN PATIENT ALLERGIES & ADVERSE DRUG REACTIONS
            </strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {allergies.map((all, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-critical)',
                    color: 'var(--color-critical)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4
                  }}
                >
                  ⚠️ {all.allergen} ({all.reaction} • {all.severity})
                </span>
              ))}
            </div>
          </div>
        </div>
        <Badge variant="critical">Do Not Administer Beta-Lactams</Badge>
      </div>

      {/* Vitals Telemetry Grid (Phase 14 Specification) */}
      <div className="shos-card" style={{ padding: 20, backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Live Clinical Vitals Telemetry
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Recorded: {vitals.recordedAt}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          {[
            { label: 'Temp', val: vitals.temperature, icon: Thermometer, color: 'var(--color-text)' },
            { label: 'BP', val: vitals.bloodPressure, icon: Heart, color: 'var(--color-primary)' },
            { label: 'Pulse Rate', val: vitals.pulse, icon: Activity, color: 'var(--color-secondary)' },
            { label: 'SpO2 Level', val: vitals.spo2, icon: Activity, color: 'var(--color-success)' },
            { label: 'Resp. Rate', val: vitals.respiratoryRate, icon: Activity, color: 'var(--color-text)' },
            { label: 'Body Weight', val: vitals.weight, icon: User, color: 'var(--color-text)' }
          ].map((item, idx) => {
            const Icon = item.icon;
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
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {item.label}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: item.color, margin: '4px 0 0' }}>
                  {item.val}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Medical History & Inpatient Admissions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* Medical History */}
        <div className="shos-card" style={{ padding: 20, backgroundColor: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FileText size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Past Medical & Surgical History
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {medicalHistory.map((hist, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--color-text)' }}>
                    {hist.condition}
                  </strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    Diagnosed: {hist.diagnosed}
                  </div>
                </div>
                <Badge variant="teal">{hist.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Admissions History */}
        <div className="shos-card" style={{ padding: 20, backgroundColor: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <BedDouble size={18} style={{ color: 'var(--color-secondary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Inpatient Admissions & Bed Allocations
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {admissions.map((adm, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--color-text)' }}>
                    {adm.ward} • {adm.bed}
                  </strong>
                  <Badge variant={adm.status.includes('Active') ? 'success' : 'secondary'}>
                    {adm.status}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Reason: {adm.reason} • Admitted: {adm.admittedDate} by {adm.doctor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Lab Reports & Active Prescriptions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* Lab Reports & Diagnostic Investigations */}
        <div className="shos-card" style={{ padding: 20, backgroundColor: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlaskConical size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Diagnostic & Pathology Reports
              </h3>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setActiveAction('lab')}>
              + Order New
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {labReports.map((report, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
                    {report.test}
                  </strong>
                  <Badge variant={report.status === 'Ready' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: 4 }}>
                  {report.result}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {report.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Active Prescriptions */}
        <div className="shos-card" style={{ padding: 20, backgroundColor: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pill size={18} style={{ color: 'var(--color-secondary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Active Prescriptions (Rx)
              </h3>
            </div>
            <Button size="sm" variant="primary" onClick={() => setActiveAction('rx')}>
              + New Rx
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {prescriptions.map((rx, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--color-text)' }}>
                    {rx.medicine}
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {rx.instructions} • {rx.duration}
                  </div>
                </div>
                <span
                  style={{
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {rx.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
