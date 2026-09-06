import React from 'react';
import {
  Calendar,
  Clock,
  User,
  BedDouble,
  FlaskConical,
  Receipt,
  Ambulance,
  HeartPulse,
  Pill,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const PatientHome = ({
  currentUser,
  onNavigate,
  onOpenBooking,
  onOpenEmergency
}) => {
  // Determine greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const patientName = currentUser?.name?.split(' (')[0] || 'Rahul Sharma';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Patient Greeting & Status Banner */}
      <div
        style={{
          padding: '24px 28px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Patient Care Command
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>
            {getGreeting()}, {patientName}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
            UHID: <strong style={{ fontFamily: 'var(--font-mono)' }}>SHOS-P-90214</strong> • Blood Group: <strong style={{ color: 'var(--color-critical)' }}>B+</strong> • Status: <strong>Active OPD Patient</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="critical" icon={HeartPulse} onClick={onOpenEmergency}>
            Emergency SOS
          </Button>
          <Button variant="primary" icon={Calendar} onClick={onOpenBooking}>
            Book Appointment
          </Button>
        </div>
      </div>

      {/* 6 Core Summary Telemetry Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {/* 1. Upcoming Appointment */}
        <div
          className="shos-card"
          onClick={() => onNavigate('appointments')}
          style={{ padding: 18, cursor: 'pointer', borderLeft: '4px solid var(--color-primary)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>UPCOMING APPOINTMENT</span>
            <Calendar size={16} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', margin: '8px 0 4px 0' }}>
            Today, 09:20 AM
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            Cardiology • Dr. Vivek Mehra
          </span>
        </div>

        {/* 2. Today's Token */}
        <div
          className="shos-card"
          onClick={() => onNavigate('queue')}
          style={{ padding: 18, cursor: 'pointer', borderLeft: '4px solid var(--color-secondary)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>TODAY'S TOKEN</span>
            <Clock size={16} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', margin: '6px 0 4px 0' }}>
            #24
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Room OPD-204 (~35m wait)
          </span>
        </div>

        {/* 3. Assigned Doctor */}
        <div
          className="shos-card"
          onClick={() => onNavigate('doctors')}
          style={{ padding: 18, cursor: 'pointer', borderLeft: '4px solid var(--color-primary-light)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>ASSIGNED DOCTOR</span>
            <User size={16} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: '8px 0 4px 0' }}>
            Dr. Vivek Mehra
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
            Senior Interventional Cardiologist
          </span>
        </div>

        {/* 4. Bed Status */}
        <div
          className="shos-card hover-lift"
          onClick={() => onNavigate('admission_bed')}
          style={{ padding: 18, cursor: 'pointer', borderLeft: '4px solid var(--color-success)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>BED STATUS</span>
            <BedDouble size={16} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: '8px 0 4px 0' }}>
            Ward A • Bed 02
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>
            🟢 Admitted (View Census)
          </span>
        </div>

        {/* 5. Pending Reports */}
        <div
          className="shos-card hover-lift"
          onClick={() => onNavigate('reports')}
          style={{ padding: 18, cursor: 'pointer', borderLeft: '4px solid var(--color-warning)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>PENDING REPORTS</span>
            <FlaskConical size={16} />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-warning)', margin: '8px 0 4px 0' }}>
            1 Report Ready
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Lipid Profile & ECG
          </span>
        </div>

        {/* 6. Pending Bills */}
        <div
          className="shos-card hover-lift"
          onClick={() => onNavigate('bills')}
          style={{ padding: 18, cursor: 'pointer', borderLeft: '4px solid var(--color-critical)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>PENDING BILLS</span>
            <Receipt size={16} />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-critical)', margin: '8px 0 4px 0' }}>
            ₹ 1,450.00
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-critical)', fontWeight: 600 }}>
            Pharmacy Dispensation Due
          </span>
        </div>
      </div>

      {/* Quick Actions Grid (Phase 6 Specification) */}
      <Card title="Quick Hospital Actions" subtitle="One-tap access to primary patient services">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, height: 'auto', textAlign: 'center' }}
            onClick={onOpenBooking}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem' }}>Book Appointment</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Select Doctor & Slot</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, height: 'auto', textAlign: 'center' }}
            onClick={() => onNavigate('emergency')}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--color-critical-subtle)', color: 'var(--color-critical)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartPulse size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-critical)' }}>🚨 Emergency SOS</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Ambulance & Trauma</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, height: 'auto', textAlign: 'center' }}
            onClick={() => onNavigate('reports')}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem' }}>Medical Reports</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Blood, X-Ray, CT, MRI</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, height: 'auto', textAlign: 'center' }}
            onClick={() => onNavigate('prescriptions')}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem' }}>Prescriptions</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Dosage & Timing</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, height: 'auto', textAlign: 'center' }}
            onClick={() => onNavigate('ambulance')}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--color-warning-subtle)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ambulance size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem' }}>Ambulance Tracker</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Live GPS Route</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, height: 'auto', textAlign: 'center' }}
            onClick={() => onNavigate('bills')}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={20} />
            </div>
            <strong style={{ fontSize: '0.85rem' }}>Bills & Invoices</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Pay & Download</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
