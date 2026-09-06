import React, { useState } from 'react';
import {
  FlaskConical,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Send,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const LabOrderModal = ({ patient, isOpen, onClose, onOrderSuccess }) => {
  const [selectedTest, setSelectedTest] = useState('Lipid Profile Comprehensive');
  const [priority, setPriority] = useState('Routine');
  const [clinicalNotes, setClinicalNotes] = useState('Fasting 12 hours required. Rule out hypercholesterolemia and assess atherogenic risk index.');
  const [orderSent, setOrderSent] = useState(false);

  if (!isOpen) return null;

  const availableTests = [
    { name: 'Lipid Profile Comprehensive', dept: 'Biochemistry', sample: 'Serum / Fasting' },
    { name: 'Complete Blood Count (CBC) with ESR', dept: 'Hematology', sample: 'Whole Blood EDTA' },
    { name: 'Troponin-I High Sensitivity (hs-cTnI)', dept: 'Cardiac Markers', sample: 'Serum STAT' },
    { name: '12-Lead Electrocardiogram (ECG)', dept: 'Cardiology Diagnostics', sample: 'Non-invasive' },
    { name: '2D Echocardiography with Color Doppler', dept: 'Cardiology Imaging', sample: 'Ultrasound' },
    { name: 'Glycated Hemoglobin (HbA1c)', dept: 'Biochemistry', sample: 'Whole Blood EDTA' },
    { name: 'Kidney Function Test (KFT / RFT)', dept: 'Biochemistry', sample: 'Serum' },
    { name: 'Liver Function Test (LFT)', dept: 'Biochemistry', sample: 'Serum' },
    { name: 'Chest X-Ray PA View', dept: 'Radiology', sample: 'Digital Radiograph' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderPayload = {
      orderId: `LAB-${Math.floor(100000 + Math.random() * 900000)}`,
      testName: selectedTest,
      priority,
      clinicalNotes,
      patientId: patient?.uhid || 'UHID-10492',
      patientName: patient?.name || 'Rahul Sharma',
      orderedBy: 'Dr. Vivek Mehra',
      orderedAt: new Date().toISOString()
    };

    if (onOrderSuccess) onOrderSuccess(orderPayload);
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
          maxWidth: 540,
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
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FlaskConical size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Order Laboratory / Diagnostic Investigation
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Patient: <strong>{patient?.name || 'Rahul Sharma'}</strong> ({patient?.uhid || 'UHID-10492'})
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
          {orderSent ? (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                color: '#15803d',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}
            >
              <CheckCircle2 size={32} />
              <strong style={{ fontSize: '1.05rem' }}>Lab Order Placed & Dispatched!</strong>
              <p style={{ fontSize: '0.82rem', margin: 0 }}>
                {selectedTest} queued for Central Pathology Lab with <strong>{priority}</strong> priority.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* 1. Select Test */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                  Select Diagnostic Test / Investigation <span style={{ color: 'var(--color-critical)' }}>*</span>
                </label>
                <select
                  className="shos-input"
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem' }}
                >
                  {availableTests.map((t, idx) => (
                    <option key={idx} value={t.name}>
                      {t.name} ({t.dept} • {t.sample})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Priority Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                  Priority Level <span style={{ color: 'var(--color-critical)' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                  {[
                    { id: 'Routine', label: 'Routine', color: 'var(--color-secondary)', desc: 'Standard turnaround' },
                    { id: 'Urgent', label: 'Urgent', color: 'var(--color-warning)', desc: 'Turnaround < 2 hours' },
                    { id: 'STAT', label: 'STAT (Emergency)', color: 'var(--color-critical)', desc: 'Immediate processing' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: priority === p.id ? `2px solid ${p.color}` : '1px solid var(--color-border)',
                        backgroundColor: priority === p.id ? 'var(--color-surface)' : 'var(--color-bg-subtle)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <strong style={{ fontSize: '0.85rem', color: p.color, display: 'block' }}>
                        {p.label}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {p.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Clinical Notes / Indication */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                  Clinical Notes & Diagnostic Indications <span style={{ color: 'var(--color-critical)' }}>*</span>
                </label>
                <textarea
                  className="shos-input"
                  rows={3}
                  required
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Clinical reason, fasting state instructions, differential to evaluate..."
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.86rem' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={FlaskConical}>
                  [Order Test]
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
