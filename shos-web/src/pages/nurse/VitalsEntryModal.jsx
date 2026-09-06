import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Scale,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const VitalsEntryModal = ({ patient, isOpen, onClose, onSaveVitals }) => {
  const [formData, setFormData] = useState({
    temperature: patient?.vitals?.temperature?.replace(' °F', '') || '98.6',
    bloodPressureSys: '120',
    bloodPressureDia: '80',
    pulse: patient?.vitals?.pulse?.replace(' bpm', '') || '74',
    spo2: patient?.vitals?.spo2?.replace('%', '') || '98',
    respiratoryRate: patient?.vitals?.respiratoryRate?.replace(' /min', '') || '16',
    weight: patient?.vitals?.weight?.replace(' kg', '') || '72',
    notes: 'Patient resting comfortably in bed. No acute respiratory or cardiac distress reported.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedVitals = {
      temperature: `${formData.temperature} °F`,
      bloodPressure: `${formData.bloodPressureSys}/${formData.bloodPressureDia} mmHg`,
      pulse: `${formData.pulse} bpm`,
      spo2: `${formData.spo2}%`,
      respiratoryRate: `${formData.respiratoryRate} /min`,
      weight: `${formData.weight} kg`,
      notes: formData.notes,
      recordedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by Nurse Station`,
      patientId: patient?.uhid || 'UHID-10492',
      patientName: patient?.name || 'Rahul Sharma'
    };

    if (onSaveVitals) onSaveVitals(formattedVitals);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  // Live clinical vitals alerts
  const spo2Num = parseFloat(formData.spo2);
  const sysNum = parseFloat(formData.bloodPressureSys);
  const tempNum = parseFloat(formData.temperature);

  const isHypoxic = spo2Num < 95;
  const isHypertensive = sysNum >= 140;
  const isFever = tempNum >= 100.4;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16
      }}
    >
      <div
        className="shos-card animate-scale-up"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: 560,
          width: '100%',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--color-surface)'
          }}
        >
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
              <Activity size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Nursing Vitals Charting Entry
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Patient: <strong>{patient?.name || 'Rahul Sharma'}</strong> • Bed: <strong>{patient?.bed || 'Ward A — Bed 02'}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {savedSuccess ? (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                color: '#15803d',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10
              }}
            >
              <CheckCircle2 size={36} />
              <strong style={{ fontSize: '1.1rem' }}>Vitals Logged Successfully!</strong>
              <p style={{ fontSize: '0.82rem', margin: 0 }}>
                Telemetry updated across Nurse Station, Ward Board, and Doctor Clinical View.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Clinical Warning Flags */}
              {(isHypoxic || isHypertensive || isFever) && (
                <div
                  style={{
                    backgroundColor: '#fff1f2',
                    border: '1px solid #f87171',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    color: 'var(--color-critical)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>
                    <strong>Clinical Attention Required:</strong>{' '}
                    {isHypoxic && 'SpO2 < 95% (Hypoxia). '}
                    {isHypertensive && 'Systolic BP ≥ 140 mmHg (Hypertension). '}
                    {isFever && 'Temp ≥ 100.4 °F (Pyrexia). '}
                  </span>
                </div>
              )}

              {/* Vitals Form Grid (Exact User Specification) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 14
                }}
              >
                {/* 1. Temperature */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    <Thermometer size={14} style={{ color: 'var(--color-critical)' }} />
                    Temperature (°F) <span style={{ color: 'var(--color-critical)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="shos-input"
                    required
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Normal: 97.8 – 99.0 °F</span>
                </div>

                {/* 2. Blood Pressure (Sys / Dia) */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    <Heart size={14} style={{ color: 'var(--color-primary)' }} />
                    Blood Pressure (mmHg) <span style={{ color: 'var(--color-critical)' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="number"
                      className="shos-input"
                      placeholder="Sys"
                      required
                      value={formData.bloodPressureSys}
                      onChange={(e) => setFormData({ ...formData, bloodPressureSys: e.target.value })}
                      style={{ width: '50%', fontWeight: 700 }}
                    />
                    <span style={{ fontWeight: 800 }}>/</span>
                    <input
                      type="number"
                      className="shos-input"
                      placeholder="Dia"
                      required
                      value={formData.bloodPressureDia}
                      onChange={(e) => setFormData({ ...formData, bloodPressureDia: e.target.value })}
                      style={{ width: '50%', fontWeight: 700 }}
                    />
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Target: 120/80 mmHg</span>
                </div>

                {/* 3. Pulse */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    <Activity size={14} style={{ color: 'var(--color-secondary)' }} />
                    Pulse Rate (bpm) <span style={{ color: 'var(--color-critical)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="shos-input"
                    required
                    value={formData.pulse}
                    onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Normal: 60 – 100 bpm</span>
                </div>

                {/* 4. SpO2 */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    <Wind size={14} style={{ color: 'var(--color-success)' }} />
                    SpO2 Oxygen (%) <span style={{ color: 'var(--color-critical)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    className="shos-input"
                    required
                    value={formData.spo2}
                    onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Normal: 95 – 100%</span>
                </div>

                {/* 5. Respiratory Rate */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    <Activity size={14} style={{ color: 'var(--color-text)' }} />
                    Respiratory Rate (/min) <span style={{ color: 'var(--color-critical)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="shos-input"
                    required
                    value={formData.respiratoryRate}
                    onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Normal: 12 – 20 /min</span>
                </div>

                {/* 6. Weight */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                    <Scale size={14} style={{ color: 'var(--color-text)' }} />
                    Weight (kg) <span style={{ color: 'var(--color-critical)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className="shos-input"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Baseline weight</span>
                </div>
              </div>

              {/* Nursing Clinical Remarks */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                  Nursing Remarks / Patient Comfort Observations
                </label>
                <textarea
                  className="shos-input"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Patient posture, pain score (1-10), IV cannula site status..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem' }}
                />
              </div>

              {/* Actions: [Save Vitals] */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Save}>
                  [Save Vitals]
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
