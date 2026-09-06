import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  FlaskConical,
  Pill,
  Activity,
  PlayCircle,
  UserCheck,
  CheckCircle2,
  Stethoscope,
  TrendingUp,
  ArrowRight,
  Volume2,
  FileText,
  X,
  PhoneCall
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const DoctorDashboardHome = ({ onNavigate, onCallNext, activePatient }) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Today's Workload Patient Queue with explicit names and clinical complaints
  const [patientQueue, setPatientQueue] = useState([
    {
      id: 1,
      name: 'Ramesh Chand',
      uhid: 'UHID-10492',
      age: 48,
      gender: 'Male',
      complaint: 'Severe Acute Angina, Retrosternal Pressure',
      urgency: 'HIGH',
      token: '#21',
      status: 'Attended',
      time: '08:45 AM',
      vitals: 'BP: 140/90 • HR: 88 • SpO2: 96%'
    },
    {
      id: 2,
      name: 'Ananya Deshmukh',
      uhid: 'UHID-10501',
      age: 34,
      gender: 'Female',
      complaint: 'Atrial Fibrillation & Episodes of Palpitations',
      urgency: 'MODERATE',
      token: '#22',
      status: 'Attended',
      time: '09:05 AM',
      vitals: 'BP: 122/80 • HR: 104 • SpO2: 98%'
    },
    {
      id: 3,
      name: 'Rahul Sharma',
      uhid: 'UHID-10492',
      age: 45,
      gender: 'Male',
      complaint: 'Exertional Chest Tightness (3 days) • Penicillin Allergy',
      urgency: 'URGENT',
      token: '#24',
      status: 'In Consultation',
      time: '09:20 AM',
      vitals: 'BP: 130/85 • HR: 76 • SpO2: 98%'
    },
    {
      id: 4,
      name: 'Pooja Verma',
      uhid: 'UHID-10844',
      age: 38,
      gender: 'Female',
      complaint: 'Mitral Valve Prolapse Routine Echocardiogram Review',
      urgency: 'ROUTINE',
      token: '#25',
      status: 'Waiting',
      time: '09:40 AM',
      vitals: 'BP: 118/76 • HR: 72 • SpO2: 99%'
    },
    {
      id: 5,
      name: 'Vikramaditya Rao',
      uhid: 'UHID-10902',
      age: 64,
      gender: 'Male',
      complaint: 'Acute Coronary Syndrome (STEMI) • Diaphoresis',
      urgency: 'CRITICAL',
      token: '#26',
      status: 'Emergency STAT',
      time: '10:00 AM',
      vitals: 'BP: 95/60 • HR: 112 • SpO2: 91%'
    },
    {
      id: 6,
      name: 'Harish Chandra',
      uhid: 'UHID-10955',
      age: 59,
      gender: 'Male',
      complaint: 'Dyspnea on Exertion (NYHA III) & Bilateral Pedal Edema',
      urgency: 'MODERATE',
      token: '#27',
      status: 'Waiting',
      time: '10:15 AM',
      vitals: 'BP: 138/88 • HR: 82 • SpO2: 95%'
    }
  ]);

  const filteredPatients = patientQueue.filter((p) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'WAITING') return p.status === 'Waiting';
    if (filterStatus === 'EMERGENCY') return p.urgency === 'CRITICAL' || p.status.includes('Emergency');
    if (filterStatus === 'ATTENDED') return p.status === 'Attended';
    return true;
  });

  const handleMarkAttended = (patientId) => {
    setPatientQueue((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: 'Attended' } : p))
    );
    setSelectedPatientModal(null);
    showToast('✅ Consultation marked completed. Prescription logged to Pharmacy queue.');
  };

  const handleBroadcastChime = (patient) => {
    showToast(`🔔 Chime Broadcast: Calling Token ${patient.token} — ${patient.name} to Cabin 104!`);
  };

  const handleOrderTests = (patient) => {
    showToast(`🧪 Diagnostic requisition (ECG + Troponin-I) dispatched to Central Lab for ${patient.name}.`);
    setSelectedPatientModal(null);
  };

  // 6 metrics specified by user
  const metrics = [
    {
      title: "Today's Appointments",
      value: '24',
      subtitle: '16 Completed • 8 Remaining',
      icon: Calendar,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-subtle)',
      filter: 'ALL'
    },
    {
      title: 'Waiting Patients',
      value: '05',
      subtitle: 'Average waiting time: 18m',
      icon: Clock,
      color: 'var(--color-secondary)',
      bg: 'var(--color-secondary-subtle)',
      filter: 'WAITING'
    },
    {
      title: 'Emergency Cases',
      value: '02',
      subtitle: '1 In Resuscitation Bay',
      icon: AlertTriangle,
      color: 'var(--color-critical)',
      bg: '#fee2e2',
      filter: 'EMERGENCY'
    },
    {
      title: 'Pending Reports',
      value: '04',
      subtitle: 'Cardiac Echo & Lipid ready',
      icon: FlaskConical,
      color: 'var(--color-warning)',
      bg: '#fef3c7',
      filter: 'ALL'
    },
    {
      title: 'Pending Prescriptions',
      value: '03',
      subtitle: 'Awaiting digital sign-off',
      icon: Pill,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-subtle)',
      filter: 'ALL'
    },
    {
      title: "Today's Workload",
      value: '67%',
      subtitle: 'Tap to view all patients',
      icon: Activity,
      color: 'var(--color-success)',
      bg: '#dcfce7',
      filter: 'ALL'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 28,
            zIndex: 9999,
            backgroundColor: '#071321',
            color: '#00ff88',
            border: '1.5px solid #00ff88',
            padding: '14px 22px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0, 255, 136, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}
          className="animate-scale-up"
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Welcome & Call Next Patient Banner */}
      <div
        className="shos-card"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Stethoscope size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Dr. Vivek Mehra, MD, DM
              </h2>
              <Badge variant="teal">Senior Cardiologist</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '4px 0 0' }}>
              Cardiology OPD • Cabin 104 • Shift Hours: 08:30 AM – 02:30 PM
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={onCallNext}
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-primary)',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <PlayCircle size={18} style={{ marginRight: 6 }} />
            Call Next Patient (Token #25)
          </Button>
        </div>
      </div>

      {/* Exactly 6 Doctor Dashboard Metric Cards (Interactive Filters) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16
        }}
      >
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          const isSelected = filterStatus === m.filter && m.filter !== 'ALL';

          return (
            <div
              key={idx}
              className="shos-card hover-lift"
              onClick={() => setFilterStatus(m.filter)}
              style={{
                padding: '20px 18px',
                backgroundColor: isSelected ? 'var(--color-surface)' : 'var(--color-surface)',
                borderLeft: `4px solid ${m.color}`,
                borderWidth: isSelected ? '2px' : '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? m.color : 'var(--color-border)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.title}
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '6px 0 2px' }}>
                  {m.value}
                </div>
                <span style={{ fontSize: '0.76rem', color: m.color, fontWeight: 600 }}>
                  {m.subtitle}
                </span>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: m.bg,
                  color: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Currently In Consultation Spotlight Card */}
      <div
        className="shos-card"
        style={{
          padding: 24,
          backgroundColor: 'var(--color-surface)',
          border: '1.5px solid var(--color-primary)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block' }} />
            <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
              Currently Inside Cabin 104
            </strong>
            <Badge variant="primary">Token #24</Badge>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button size="sm" variant="outline" onClick={() => handleBroadcastChime({ token: '#24', name: 'Rahul Sharma' })}>
              <Volume2 size={14} style={{ marginRight: 4 }} />
              Chime Token
            </Button>
            <Button size="sm" variant="primary" onClick={() => onNavigate('clinical_view')}>
              Open Clinical EHR & Prescribe
              <ArrowRight size={14} style={{ marginLeft: 6 }} />
            </Button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            backgroundColor: 'var(--color-surface)',
            padding: 16,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Patient Name & UHID
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Rahul Sharma (45 / M)
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
              UHID-10492 • Ward A Bed 02
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Chief Complaint
            </span>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Exertional Chest Tightness (3 days)
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-critical)', fontWeight: 600 }}>
              Allergic to Penicillin
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Vitals Check
            </span>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text)' }}>
              BP: 130/85 • SpO2: 98% • Pulse: 76
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-success)', fontWeight: 600 }}>
              Hemodynamically Stable
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Consultation Status
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              Under Active Exam
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
              Started at 09:20 AM
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S PATIENT WORKLOAD QUEUE (Interactive Named Workload Cards) */}
      <Card
        title={`Today's Patient Workload Queue (${filteredPatients.length} Patients)`}
        subtitle="Click any patient card to launch clinical consultation actions, call chime token, or order diagnostics"
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {['ALL', 'WAITING', 'EMERGENCY', 'ATTENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: filterStatus === st ? '#0284c7' : 'var(--color-surface)',
                color: filterStatus === st ? '#ffffff' : 'var(--color-text)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: filterStatus === st ? '#0284c7' : 'var(--color-border)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filteredPatients.map((patient) => {
            const isAttended = patient.status === 'Attended';
            const isEmergency = patient.urgency === 'CRITICAL' || patient.status.includes('Emergency');
            const isInConsult = patient.status === 'In Consultation';

            return (
              <div
                key={patient.id}
                className="shos-card hover-lift"
                onClick={() => setSelectedPatientModal(patient)}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-surface)',
                  borderLeft: isEmergency ? '4px solid #e11d48' : isInConsult ? '4px solid #0284c7' : isAttended ? '4px solid #10b981' : '4px solid #f59e0b',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                      Token {patient.token}
                    </span>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>
                      {patient.name} ({patient.age}Y / {patient.gender[0]})
                    </strong>
                  </div>
                  <Badge variant={isEmergency ? 'critical' : isAttended ? 'success' : 'warning'}>
                    {patient.status}
                  </Badge>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  UHID: <strong>{patient.uhid}</strong> • Slot: {patient.time}
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--color-text)', fontWeight: 600, margin: '2px 0' }}>
                  {patient.complaint}
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {patient.vitals}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                    Click to Open Clinical Action Sheet →
                  </span>
                  <Badge variant={patient.urgency === 'CRITICAL' ? 'critical' : 'secondary'} size="sm">
                    {patient.urgency}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Patient Consultation Modal */}
      {selectedPatientModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="shos-card animate-scale-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge variant="primary">Token {selectedPatientModal.token}</Badge>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--color-text)' }}>
                    {selectedPatientModal.name}
                  </strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {selectedPatientModal.uhid} • {selectedPatientModal.age}Y • {selectedPatientModal.gender}
                </div>
              </div>
              <button onClick={() => setSelectedPatientModal(null)} style={closeBtnStyle}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 16 }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Chief Complaint & Triage Presentation
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 4 }}>
                {selectedPatientModal.complaint}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                Vitals: {selectedPatientModal.vitals}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSelectedPatientModal(null);
                  onNavigate('clinical_view');
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Stethoscope size={16} />
                Consult Patient & Open Full EHR
              </Button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBroadcastChime(selectedPatientModal)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Volume2 size={15} />
                  Chime Call Token
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOrderTests(selectedPatientModal)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <FlaskConical size={15} />
                  Order STAT Tests
                </Button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMarkAttended(selectedPatientModal.id)}
                style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, marginTop: 4 }}
              >
                <CheckCircle2 size={16} style={{ marginRight: 6 }} />
                Mark Consultation Attended & Completed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.65)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
  padding: 20
};

const modalContentStyle = {
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  width: '100%',
  maxWidth: 480,
  padding: 24,
  boxShadow: 'var(--shadow-xl)',
  border: '1px solid var(--color-border)'
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-text-muted)'
};

