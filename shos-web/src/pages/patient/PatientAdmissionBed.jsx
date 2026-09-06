import React, { useState } from 'react';
import {
  BedDouble,
  User,
  Calendar,
  Stethoscope,
  Building2,
  Wind,
  CheckCircle2,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const PatientAdmissionBed = ({ currentUser }) => {
  // Inpatient admission details
  const admissionInfo = {
    status: 'Admitted Inpatient',
    assignedWard: 'Ward A — Semi-Private Step-Down Unit',
    room: 'Room 204 (2nd Floor, East Wing)',
    bed: 'Bed 02',
    admissionDate: '04 Sep 2026, 08:30 PM',
    assignedDoctor: 'Dr. Vivek Mehra (Cardiology)',
    attendingNurse: 'Sister Mary Joseph (Shift B)'
  };

  // Bed visual matching user's exact specification:
  // Ward A: 🟢 Bed 01, 🔴 Bed 02, 🟢 Bed 03, 🟡 Bed 04
  const [wardBeds, setWardBeds] = useState([
    {
      number: 'Bed 01',
      status: 'Available',
      code: '🟢',
      color: 'var(--color-success)',
      patient: null,
      condition: 'Sanitized & Ready',
      ventilator: false
    },
    {
      number: 'Bed 02',
      status: 'Occupied',
      code: '🔴',
      color: 'var(--color-critical)',
      patient: currentUser?.name?.split(' (')[0] || 'Rahul Sharma (You)',
      condition: 'Under Observation (Stable)',
      ventilator: true,
      isUserBed: true
    },
    {
      number: 'Bed 03',
      status: 'Available',
      code: '🟢',
      color: 'var(--color-success)',
      patient: null,
      condition: 'Sanitized & Ready',
      ventilator: false
    },
    {
      number: 'Bed 04',
      status: 'Reserved / Cleaning',
      code: '🟡',
      color: 'var(--color-warning)',
      patient: 'Scheduled Post-Op Intake',
      condition: 'Terminal Sterilization',
      ventilator: true
    }
  ]);

  const [selectedBed, setSelectedBed] = useState(wardBeds[1]); // Default selected user's bed

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)' }}>
          Inpatient Admission & Ward Bed Allocation
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Live telemetry of your assigned hospital room, bed census, and ward facilities.
        </p>
      </div>

      {/* Admission Summary Card */}
      <div
        className="shos-card animate-fade-in"
        style={{
          padding: '24px 28px',
          borderLeft: '5px solid var(--color-primary)',
          backgroundColor: 'var(--color-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BedDouble size={24} style={{ color: 'var(--color-primary)' }} />
            <div>
              <strong style={{ fontSize: '1.15rem', color: 'var(--color-text)' }}>
                {admissionInfo.assignedWard}
              </strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                {admissionInfo.room}
              </div>
            </div>
          </div>
          <Badge variant="primary" size="md">
            {admissionInfo.status}
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, fontSize: '0.85rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Your Assigned Bed</span>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
              {admissionInfo.bed}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Admission Date & Time</span>
            <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              {admissionInfo.admissionDate}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Attending Physician</span>
            <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              {admissionInfo.assignedDoctor}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Shift Charge Nurse</span>
            <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              {admissionInfo.attendingNurse}
            </div>
          </div>
        </div>
      </div>

      {/* Bed Visual Section (User's Exact Specification) */}
      <Card
        title="Ward A — Bed Map & Occupancy Visualizer"
        subtitle="Real-time multi-bed status: 🟢 Available, 🔴 Occupied, 🟡 Reserved/Cleaning"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 8 }}>
          {wardBeds.map((bed) => {
            const isSelected = selectedBed?.number === bed.number;
            return (
              <div
                key={bed.number}
                className="shos-card"
                onClick={() => setSelectedBed(bed)}
                style={{
                  padding: 18,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: bed.isUserBed ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  position: 'relative'
                }}
              >
                {bed.isUserBed && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-surface)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-primary)'
                    }}
                  >
                    Your Bed
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>{bed.code}</span>
                  <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{bed.number}</strong>
                </div>

                <div style={{ fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                    {bed.patient || 'Empty Bed'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                    {bed.condition}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                  <span style={{ fontWeight: 700, color: bed.color }}>{bed.status}</span>
                  {bed.ventilator && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)' }}>
                      <Wind size={12} /> Oxygen/Vent
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Bed Details Preview */}
        {selectedBed && (
          <div style={{ marginTop: 20, padding: 16, backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Selected Bed Telemetry:
              </span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 2 }}>
                {selectedBed.number} • Status: <span style={{ color: selectedBed.color }}>{selectedBed.status}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Patient: {selectedBed.patient || 'None (Available for immediate allocation)'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" size="sm" onClick={() => alert(`Nurse call alert triggered for ${selectedBed.number}. Station notified.`)}>
                Call Duty Nurse
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
