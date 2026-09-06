import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  Building2,
  Sparkles
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AppointmentBookingModal = ({
  isOpen,
  onClose,
  initialDoctor = null,
  onBookingSuccess
}) => {
  const [step, setStep] = useState(initialDoctor ? 3 : 1);
  const [selectedDept, setSelectedDept] = useState(initialDoctor ? initialDoctor.department : 'Cardiology');
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('09:30 AM');
  const [createdToken, setCreatedToken] = useState(null);

  const departments = [
    'Cardiology',
    'Orthopaedics',
    'Neurology',
    'General Medicine',
    'Pediatrics',
    'Pulmonology'
  ];

  const doctorsByDept = {
    Cardiology: [
      { id: 'DOC-01', name: 'Dr. Vivek Mehra', experience: '18 yrs', fee: '₹ 800', cabin: 'OPD-204' },
      { id: 'DOC-11', name: 'Dr. Arvind Sharma', experience: '11 yrs', fee: '₹ 700', cabin: 'OPD-205' }
    ],
    Orthopaedics: [
      { id: 'DOC-02', name: 'Dr. Ananya Nair', experience: '14 yrs', fee: '₹ 750', cabin: 'OPD-108' }
    ],
    Neurology: [
      { id: 'DOC-03', name: 'Dr. Rohan Mathur', experience: '12 yrs', fee: '₹ 900', cabin: 'OPD-302' }
    ],
    'General Medicine': [
      { id: 'DOC-04', name: 'Dr. Radhika Roy', experience: '16 yrs', fee: '₹ 600', cabin: 'OPD-102' }
    ],
    Pediatrics: [
      { id: 'DOC-05', name: 'Dr. Meenakshi Rao', experience: '15 yrs', fee: '₹ 700', cabin: 'OPD-115' }
    ],
    Pulmonology: [
      { id: 'DOC-06', name: 'Dr. S. K. Gupta', experience: '20 yrs', fee: '₹ 800', cabin: 'OPD-210' }
    ]
  };

  const availableSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM'
  ];

  const handleConfirmBooking = () => {
    const tokenNumber = `T-${Math.floor(100 + Math.random() * 900)}`;
    const newAppointment = {
      token: tokenNumber,
      patient: 'Rahul Sharma',
      dept: selectedDept,
      doctor: selectedDoctor?.name || 'Dr. Vivek Mehra',
      slot: `${selectedDate} at ${selectedSlot}`,
      status: 'Waiting'
    };

    setCreatedToken(tokenNumber);
    setStep(6); // Success Step
    onBookingSuccess?.(newAppointment);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedDoctor(null);
    setCreatedToken(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Book Doctor OPD Appointment"
      maxWidth={540}
    >
      {/* Progress Steps Header */}
      {step <= 5 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Step {step} of 5: {step === 1 ? 'Select Department' : step === 2 ? 'Select Doctor' : step === 3 ? 'Select Date' : step === 4 ? 'Select Slot' : 'Confirm'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
            Instant Token Issuance
          </span>
        </div>
      )}

      {/* Step 1: Select Department */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
            Choose the clinical specialty for your medical consultation:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                className="btn btn-outline"
                style={{
                  padding: '14px',
                  justifyContent: 'flex-start',
                  border: selectedDept === dept ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: selectedDept === dept ? 'var(--color-primary-subtle)' : 'var(--color-surface)'
                }}
                onClick={() => setSelectedDept(dept)}
              >
                <Building2 size={16} style={{ color: 'var(--color-primary)' }} />
                <span>{dept}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button variant="primary" icon={ChevronRight} iconPosition="right" onClick={() => setStep(2)}>
              Next: Choose Doctor
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Doctor */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Specialists available in <strong>{selectedDept}</strong>:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(doctorsByDept[selectedDept] || []).map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  border: selectedDoctor?.id === doc.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: selectedDoctor?.id === doc.id ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.92rem' }}>{doc.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                    {doc.experience} • Fee: {doc.fee}
                  </div>
                </div>
                <Badge variant="primary" size="sm">{doc.cabin}</Badge>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              disabled={!selectedDoctor}
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => setStep(3)}
            >
              Next: Choose Date
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Select your preferred consultation date for <strong>{selectedDoctor?.name}</strong>:
          </p>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="shos-input-field"
            style={{ fontSize: '1rem', padding: '12px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" icon={ChevronRight} iconPosition="right" onClick={() => setStep(4)}>
              Next: Select Slot
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Select Available Slot */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Available OPD time slots for <strong>{selectedDate}</strong>:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: 8 }}>
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className="btn btn-outline"
                style={{
                  fontSize: '0.8rem',
                  padding: '10px 4px',
                  border: selectedSlot === slot ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: selectedSlot === slot ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                  color: selectedSlot === slot ? 'var(--color-primary)' : 'inherit'
                }}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(3)}>
              Back
            </Button>
            <Button variant="primary" icon={ChevronRight} iconPosition="right" onClick={() => setStep(5)}>
              Review & Confirm
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 16, backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>
              Appointment Summary
            </h4>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>Department: <strong>{selectedDept}</strong></div>
              <div>Physician: <strong>{selectedDoctor?.name}</strong> ({selectedDoctor?.cabin})</div>
              <div>Consultation Date: <strong>{selectedDate}</strong></div>
              <div>Time Slot: <strong>{selectedSlot}</strong></div>
              <div>Consultation Fee: <strong>{selectedDoctor?.fee || '₹ 800'}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(4)}>
              Back
            </Button>
            <Button variant="success" icon={CheckCircle2} onClick={handleConfirmBooking}>
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}

      {/* Step 6: Success & Generated Token */}
      {step === 6 && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '16px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-success-subtle)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={36} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Appointment Confirmed!
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Your electronic OPD token has been generated.
            </p>
          </div>

          <div style={{ padding: '14px 28px', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-primary)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Your Token Number
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
              {createdToken}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {selectedDoctor?.cabin || 'OPD-204'} • {selectedSlot}
            </span>
          </div>

          <Button variant="primary" size="md" onClick={handleReset} style={{ width: '100%', marginTop: 8 }}>
            Done & Return to Appointments
          </Button>
        </div>
      )}
    </Modal>
  );
};
