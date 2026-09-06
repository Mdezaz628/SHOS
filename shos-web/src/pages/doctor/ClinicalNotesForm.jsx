import React, { useState } from 'react';
import {
  FileText,
  Save,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  Stethoscope
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ClinicalNotesForm = ({ patient, initialNotes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    chiefComplaint: initialNotes?.chiefComplaint || 'Exertional retrosternal chest tightness for 3 days, accompanied by shortness of breath on climbing 1 flight of stairs.',
    observations: initialNotes?.observations || 'Patient conscious, oriented, mildly anxious. S1, S2 present, no audible murmurs or gallops. Bilateral vesicular breath sounds, no rales. JVP not elevated. Mild bilateral pitting ankle edema (Grade 1).',
    assessment: initialNotes?.assessment || 'Stable Angina Pectoris (Class II NYHA) in background of Essential Systemic Hypertension and Type-2 Diabetes Mellitus.',
    clinicalNotes: initialNotes?.clinicalNotes || 'Advised dietary salt restriction (<2g/day) and low saturated fat. Advised to continue current ACE inhibitors and beta-blockers. Advised immediate report to ER if chest pain occurs at rest or exceeds 15 minutes.',
    followUpDate: initialNotes?.followUpDate || '2026-09-16',
    followUpInstructions: initialNotes?.followUpInstructions || 'Follow-up in Cardiology OPD in 10 days with repeat Fasting Lipid Profile & 2D Echocardiogram report.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        patientId: patient?.uhid || 'UHID-10492',
        patientName: patient?.name || 'Rahul Sharma',
        recordedAt: new Date().toISOString()
      });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onCancel) onCancel();
    }, 1200);
  };

  return (
    <div className="shos-card animate-fade-in" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--color-border)', paddingBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Stethoscope size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Clinical Examination & Progress Notes
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Patient: <strong>{patient?.name || 'Rahul Sharma'}</strong> (Age: {patient?.age || '45'} • UHID: {patient?.uhid || 'UHID-10492'})
            </span>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {savedSuccess && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            color: '#15803d',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
        >
          <CheckCircle2 size={18} />
          Clinical notes saved and synchronized to Patient EHR successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 1. Chief Complaint */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
            Chief Complaint & History of Present Illness (HPI) <span style={{ color: 'var(--color-critical)' }}>*</span>
          </label>
          <textarea
            className="shos-input"
            rows={2}
            required
            value={formData.chiefComplaint}
            onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
            placeholder="Document patient's primary symptoms, duration, and precipitating factors..."
            style={{ width: '100%', padding: '10px 12px', fontSize: '0.86rem' }}
          />
        </div>

        {/* 2. Observations */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
            Objective Observations & Physical Examination <span style={{ color: 'var(--color-critical)' }}>*</span>
          </label>
          <textarea
            className="shos-input"
            rows={3}
            required
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Clinical findings (Heart sounds, chest auscultation, abdominal exam, edema, neurological signs)..."
            style={{ width: '100%', padding: '10px 12px', fontSize: '0.86rem' }}
          />
        </div>

        {/* 3. Assessment */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
            Clinical Assessment & Differential / Working Diagnosis <span style={{ color: 'var(--color-critical)' }}>*</span>
          </label>
          <textarea
            className="shos-input"
            rows={2}
            required
            value={formData.assessment}
            onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
            placeholder="ICD-10 or clinical diagnostic assessment..."
            style={{ width: '100%', padding: '10px 12px', fontSize: '0.86rem' }}
          />
        </div>

        {/* 4. Clinical Notes */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
            Doctor's Detailed Clinical Notes & Management Plan
          </label>
          <textarea
            className="shos-input"
            rows={3}
            value={formData.clinicalNotes}
            onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
            placeholder="Dietary recommendations, therapy goals, patient counseling, lifestyle changes..."
            style={{ width: '100%', padding: '10px 12px', fontSize: '0.86rem' }}
          />
        </div>

        {/* 5. Follow-up */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            backgroundColor: 'var(--color-surface)',
            padding: 14,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4 }}>
              <Calendar size={14} /> Follow-up Date
            </label>
            <input
              type="date"
              className="shos-input"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4 }}>
              <Clock size={14} /> Follow-up Instructions
            </label>
            <input
              type="text"
              className="shos-input"
              value={formData.followUpInstructions}
              onChange={(e) => setFormData({ ...formData, followUpInstructions: e.target.value })}
              placeholder="e.g. Return in 10 days with repeat lipid panel"
              style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" icon={Save}>
            [Save Clinical Notes]
          </Button>
        </div>
      </form>
    </div>
  );
};
