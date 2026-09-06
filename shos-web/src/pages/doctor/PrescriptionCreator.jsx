import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Calendar,
  Save,
  FileSignature,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const PrescriptionCreator = ({ patient, onSavePrescription, onCancel }) => {
  // Current medicine inputs
  const [currentMed, setCurrentMed] = useState({
    medicine: 'Atorvastatin 20mg Tablet',
    dosage: '20mg',
    frequency: '0-0-1',
    duration: '30 Days',
    instructions: 'After Food (Bedtime)'
  });

  // Prescribed items list
  const [items, setItems] = useState([
    {
      id: 1,
      medicine: 'Metoprolol Succinate 50mg Tablet',
      dosage: '50mg',
      frequency: '1-0-1',
      duration: '15 Days',
      instructions: 'After Food'
    },
    {
      id: 2,
      medicine: 'Aspirin 75mg Gastro-Resistant Tablet',
      dosage: '75mg',
      frequency: '1-0-0',
      duration: '30 Days',
      instructions: 'After Food'
    },
    {
      id: 3,
      medicine: 'Pantoprazole 40mg Tablet',
      dosage: '40mg',
      frequency: '1-0-0',
      duration: '14 Days',
      instructions: 'Before Breakfast'
    }
  ]);

  const [doctorNotes, setDoctorNotes] = useState('Maintain low salt diet, avoid strenuous unaccustomed weight lifting, monitor BP every 3 days.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Common medicine presets for rapid selection
  const commonMeds = [
    { name: 'Atorvastatin 20mg Tablet', dosage: '20mg', defaultFreq: '0-0-1', defaultDur: '30 Days', defaultInst: 'After Food (Bedtime)' },
    { name: 'Telmisartan 40mg Tablet', dosage: '40mg', defaultFreq: '1-0-0', defaultDur: '30 Days', defaultInst: 'After Food' },
    { name: 'Metformin 500mg SR Tablet', dosage: '500mg', defaultFreq: '1-0-1', defaultDur: '30 Days', defaultInst: 'With Meals' },
    { name: 'Amoxicillin + Clavulanic 625mg', dosage: '625mg', defaultFreq: '1-0-1', defaultDur: '5 Days', defaultInst: 'After Food' },
    { name: 'Paracetamol 650mg Tablet', dosage: '650mg', defaultFreq: '1-1-1 (SOS)', defaultDur: '5 Days', defaultInst: 'After Food if Fever >100°F' }
  ];

  const handleAddMedicine = (e) => {
    e?.preventDefault();
    if (!currentMed.medicine.trim()) return;

    const newItem = {
      id: Date.now(),
      medicine: currentMed.medicine,
      dosage: currentMed.dosage || 'Standard',
      frequency: currentMed.frequency || '1-0-1',
      duration: currentMed.duration || '5 Days',
      instructions: currentMed.instructions || 'After Food'
    };

    setItems([...items, newItem]);
    // Reset to empty or default
    setCurrentMed({
      medicine: '',
      dosage: '',
      frequency: '1-0-1',
      duration: '5 Days',
      instructions: 'After Food'
    });
  };

  const handleRemoveMedicine = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one medicine to the prescription.');
      return;
    }

    const prescriptionPayload = {
      prescriptionId: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      patientId: patient?.uhid || 'UHID-10492',
      patientName: patient?.name || 'Rahul Sharma',
      doctor: 'Dr. Vivek Mehra, MD, DM (Cardiology)',
      date: new Date().toLocaleDateString('en-GB'),
      medicines: items,
      notes: doctorNotes
    };

    if (onSavePrescription) {
      onSavePrescription(prescriptionPayload);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onCancel) onCancel();
    }, 1500);
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
            <Pill size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Digital Prescription Generator (Rx)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Rx for <strong>{patient?.name || 'Rahul Sharma'}</strong> • Age: {patient?.age || '45'} • UHID: {patient?.uhid || 'UHID-10492'}
            </span>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}
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
          Digital Prescription generated, digitally signed, and routed to Hospital Pharmacy!
        </div>
      )}

      {/* Allergies Caution Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: '#fff1f2',
          border: '1px solid #fca5a5',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
          marginBottom: 18,
          fontSize: '0.8rem',
          color: 'var(--color-critical)'
        }}
      >
        <AlertTriangle size={16} />
        <span>
          <strong>Patient Allergy Warning:</strong> Allergic to <strong>Penicillin & Amoxicillin Derivatives</strong>. Avoid prescribing Beta-lactams.
        </span>
      </div>

      {/* Add Medicine Form (Phase 14 Specification) */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 18,
          marginBottom: 20
        }}
      >
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 12 }}>
          Add Medicine Item
        </h4>

        {/* Quick select presets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', alignSelf: 'center', fontWeight: 700 }}>
            Quick Rx:
          </span>
          {commonMeds.map((med, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() =>
                setCurrentMed({
                  medicine: med.name,
                  dosage: med.dosage,
                  frequency: med.defaultFreq,
                  duration: med.defaultDur,
                  instructions: med.defaultInst
                })
              }
              style={{
                fontSize: '0.72rem',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                cursor: 'pointer'
              }}
            >
              + {med.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            alignItems: 'flex-end'
          }}
        >
          {/* Medicine */}
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              Medicine Name <span style={{ color: 'var(--color-critical)' }}>*</span>
            </label>
            <input
              type="text"
              className="shos-input"
              value={currentMed.medicine}
              onChange={(e) => setCurrentMed({ ...currentMed, medicine: e.target.value })}
              placeholder="e.g., Atorvastatin 20mg Tablet"
              style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
            />
          </div>

          {/* Dosage */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              Dosage
            </label>
            <input
              type="text"
              className="shos-input"
              value={currentMed.dosage}
              onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
              placeholder="e.g., 20mg / 5ml"
              style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
            />
          </div>

          {/* Frequency: 1-0-1 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              Frequency (e.g. 1-0-1) <span style={{ color: 'var(--color-critical)' }}>*</span>
            </label>
            <input
              type="text"
              className="shos-input"
              value={currentMed.frequency}
              onChange={(e) => setCurrentMed({ ...currentMed, frequency: e.target.value })}
              placeholder="1-0-1 or 1-0-0"
              style={{ width: '100%', backgroundColor: 'var(--color-surface)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {/* Duration: 5 Days */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              Duration <span style={{ color: 'var(--color-critical)' }}>*</span>
            </label>
            <input
              type="text"
              className="shos-input"
              value={currentMed.duration}
              onChange={(e) => setCurrentMed({ ...currentMed, duration: e.target.value })}
              placeholder="5 Days / 1 Month"
              style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
            />
          </div>

          {/* Instructions: After Food */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              Instructions <span style={{ color: 'var(--color-critical)' }}>*</span>
            </label>
            <input
              type="text"
              className="shos-input"
              value={currentMed.instructions}
              onChange={(e) => setCurrentMed({ ...currentMed, instructions: e.target.value })}
              placeholder="After Food / Before Food"
              style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
            />
          </div>

          {/* [Add Medicine] Button */}
          <div>
            <Button
              type="button"
              variant="secondary"
              icon={Plus}
              onClick={handleAddMedicine}
              style={{ width: '100%' }}
            >
              [Add Medicine]
            </Button>
          </div>
        </div>
      </div>

      {/* Medicines Table / List */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 10 }}>
          Prescribed Medications ({items.length} items)
        </h4>

        {items.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)' }}>
            No medicines added to this prescription yet. Use the form above to add medicines.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>#</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Medicine</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Dosage</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Frequency</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Duration</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Instructions</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text)' }}>
                      {item.medicine}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', fontWeight: 600 }}>
                        {item.dosage}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--color-primary-subtle)',
                          color: 'var(--color-primary)',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        {item.frequency}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--color-text)' }}>{item.duration}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{item.instructions}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-critical)',
                          padding: 4
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* General Advice / Notes */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
          General Lifestyle Advice & Dietary Instructions
        </label>
        <textarea
          className="shos-input"
          rows={2}
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
          placeholder="Advice on hydration, diet, exercise restrictions, warning symptoms..."
          style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Footer / [Save Prescription] Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <FileSignature size={16} />
          Digitally signed by <strong>Dr. Vivek Mehra (Reg: MCI-40912)</strong>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="button" variant="primary" icon={Save} onClick={handleSave}>
            [Save Prescription]
          </Button>
        </div>
      </div>
    </div>
  );
};
