import React, { useState } from 'react';
import {
  Share2,
  Building2,
  Clock,
  CheckCircle2,
  X,
  Stethoscope,
  Send
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ReferralModal = ({ patient, isOpen, onClose, onReferralSuccess }) => {
  const [specialty, setSpecialty] = useState('Cardiothoracic Surgery (CTVS)');
  const [referredDoctor, setReferredDoctor] = useState('Dr. Sanjeev Kapoor, MCh (CTVS)');
  const [reason, setReason] = useState('Evaluation for Coronary Artery Bypass Grafting (CABG) versus multi-vessel PCI based on recent coronary angiography findings.');
  const [priority, setPriority] = useState('Urgent');
  const [notes, setNotes] = useState('Patient stable on anti-platelet and statin therapy. Echocardiogram shows EF 48% with hypokinetic anterior wall.');
  const [referralSent, setReferralSent] = useState(false);

  if (!isOpen) return null;

  const specialties = [
    { name: 'Cardiothoracic Surgery (CTVS)', doctor: 'Dr. Sanjeev Kapoor, MCh (CTVS)' },
    { name: 'Neurology', doctor: 'Dr. Meenakshi Iyer, DM (Neurology)' },
    { name: 'Nephrology & Renal Transplant', doctor: 'Dr. Rajesh Nair, DM (Nephro)' },
    { name: 'Endocrinology & Diabetology', doctor: 'Dr. Priya Sharma, MD' },
    { name: 'Pulmonology & Chest Medicine', doctor: 'Dr. Amit Bansal, DNB' },
    { name: 'Orthopedics & Joint Replacement', doctor: 'Dr. Vikram Malhotra, MS (Ortho)' },
    { name: 'Medical Oncology', doctor: 'Dr. Sunita Rao, DM (Oncology)' }
  ];

  const handleSpecialtyChange = (e) => {
    const spec = e.target.value;
    setSpecialty(spec);
    const found = specialties.find((s) => s.name === spec);
    if (found) setReferredDoctor(found.doctor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      referralId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      specialty,
      referredDoctor,
      reason,
      priority,
      notes,
      patientId: patient?.uhid || 'UHID-10492',
      patientName: patient?.name || 'Rahul Sharma',
      referringDoctor: 'Dr. Vivek Mehra (Cardiology)',
      createdAt: new Date().toISOString()
    };

    if (onReferralSuccess) onReferralSuccess(payload);
    setReferralSent(true);
    setTimeout(() => {
      setReferralSent(false);
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
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Inter-Department Specialist Referral
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
          {referralSent ? (
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
              <strong style={{ fontSize: '1.05rem' }}>Referral Dispatched!</strong>
              <p style={{ fontSize: '0.82rem', margin: 0 }}>
                Patient transferred to <strong>{specialty}</strong> ({referredDoctor}) with <strong>{priority}</strong> urgency.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* 1. Refer To Specialty */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                  Refer To: Specialty / Department <span style={{ color: 'var(--color-critical)' }}>*</span>
                </label>
                <select
                  className="shos-input"
                  value={specialty}
                  onChange={handleSpecialtyChange}
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem' }}
                >
                  {specialties.map((s, idx) => (
                    <option key={idx} value={s.name}>
                      {s.name} — {s.doctor}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Reason for Referral */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                  Reason for Referral <span style={{ color: 'var(--color-critical)' }}>*</span>
                </label>
                <textarea
                  className="shos-input"
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Specific clinical question, surgical assessment, opinion requested..."
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.86rem' }}
                />
              </div>

              {/* 3. Priority */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                  Urgency / Priority <span style={{ color: 'var(--color-critical)' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                  {[
                    { id: 'Routine', label: 'Routine', color: 'var(--color-secondary)', desc: 'Next available OPD slot' },
                    { id: 'Urgent', label: 'Urgent', color: 'var(--color-warning)', desc: 'Consult within 24 hours' },
                    { id: 'Immediate', label: 'Immediate / STAT', color: 'var(--color-critical)', desc: 'Bedside / Urgent consult' }
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

              {/* 4. Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                  Accompanying Clinical History & Notes
                </label>
                <textarea
                  className="shos-input"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Pertinent findings, current stability, investigations already completed..."
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.86rem' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Share2}>
                  [Refer]
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
