import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  UserPlus,
  Ticket,
  BedDouble,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  PlusCircle,
  Building2,
  Stethoscope,
  Printer,
  Volume2,
  Eye,
  FileText
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ReceptionStaffDashboard = () => {
  // Exact 6 Reception Dashboard metrics specified by user:
  // - Today's Patients
  // - Appointments
  // - Walk-ins
  // - Queue
  // - Admissions
  // - Discharges
  const [metrics, setMetrics] = useState({
    todaysPatients: 144,
    appointments: 92,
    walkIns: 52,
    queue: 18,
    admissions: 8,
    discharges: 14
  });

  // Active Action Modal: 'register', 'appointment', 'token', 'admission', 'discharge', null
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPatientPass, setSelectedPatientPass] = useState(null);
  const [receptionToast, setReceptionToast] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Reception Patient Ledger
  const [patientLedger, setPatientLedger] = useState([
    { token: 'T-101', uhid: 'UHID-10492', name: 'Rahul Sharma', dept: 'Cardiology', doctor: 'Dr. Vikram Malhotra', slot: '09:20 AM', status: 'Consulting', type: 'Appointment' },
    { token: 'T-102', uhid: 'UHID-10844', name: 'Pooja Verma', dept: 'Cardiology', doctor: 'Dr. Vikram Malhotra', slot: '09:40 AM', status: 'Waiting', type: 'Appointment' },
    { token: 'T-103', uhid: 'UHID-10902', name: 'Vikramaditya Rao', dept: 'Emergency Trauma', doctor: 'Dr. Sunita Rao', slot: '10:00 AM', status: 'Emergency', type: 'Walk-in' },
    { token: 'T-104', uhid: 'UHID-10955', name: 'Harish Chandra', dept: 'General Medicine', doctor: 'Dr. Meera Nambiar', slot: '10:15 AM', status: 'Waiting', type: 'Walk-in' },
  ]);

  const handleChimeToken = (row) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
    setReceptionToast(`🔊 Chime: Calling Token ${row.token} — ${row.name} to ${row.dept} (${row.doctor})`);
    setTimeout(() => setReceptionToast(''), 4500);
  };

  // Live Sync with Backend Appointments
  React.useEffect(() => {
    const fetchLiveBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/appointments');
        const json = await res.json();
        if (json.success && json.data) {
          const formatted = json.data.map((appt, idx) => ({
            token: `T-${appt.tokenNumber || (110 + idx)}`,
            uhid: appt.patientId || appt.uhid || `UHID-${Math.floor(10000 + Math.random() * 90000)}`,
            name: appt.patientName,
            dept: appt.department || 'Cardiology',
            doctor: appt.doctorName,
            slot: appt.timeSlot || appt.time || '10:00 AM',
            status: appt.status === 'Confirmed' ? 'Booked (Awaiting Check-in)' : appt.status,
            type: 'Online / App Booking',
            rawAppt: appt,
          }));

          setPatientLedger((prev) => {
            // Merge without duplicates by token or id
            const existingTokens = new Set(prev.map((p) => p.token));
            const newOnes = formatted.filter((f) => !existingTokens.has(f.token));
            return [...newOnes, ...prev];
          });
        }
      } catch (err) {
        console.log('[ReceptionStaffDashboard] Backend sync offline, using local ledger');
      }
    };

    fetchLiveBookings();
    const interval = setInterval(fetchLiveBookings, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckInPatient = (row) => {
    setPatientLedger((prev) =>
      prev.map((p) =>
        p.token === row.token
          ? { ...p, status: 'Checked In (Waiting Queue)' }
          : p
      )
    );
    setMetrics((prev) => ({ ...prev, queue: prev.queue + 1, walkIns: prev.walkIns + 1 }));
  };

  // Form states for modals
  const [regForm, setRegForm] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    phone: '',
    bloodGroup: 'B+',
    address: ''
  });

  const [tokenForm, setTokenForm] = useState({
    patientName: 'Kunal Singhania',
    department: 'General Medicine',
    doctor: 'Dr. Radhika Roy',
    type: 'Walk-in Spot'
  });

  const [admissionForm, setAdmissionForm] = useState({
    patientName: 'Rahul Sharma',
    uhid: 'UHID-10492',
    ward: 'Ward A — Semi-Private Unit',
    room: 'Room 204',
    bed: 'Bed 02',
    doctor: 'Dr. Vivek Mehra (Cardiology)'
  });

  const [dischargeForm, setDischargeForm] = useState({
    patientName: 'Sunita Mehra',
    uhid: 'UHID-10210',
    ward: 'Ward B — Private Deluxe',
    bed: 'Bed 01',
    billClearance: 'Paid & Cleared (₹ 24,500)'
  });

  const [lastIssuedToken, setLastIssuedToken] = useState(null);

  // Handle Register Patient
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    const newUhid = `UHID-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEntry = {
      token: `T-${100 + patientLedger.length + 1}`,
      uhid: newUhid,
      name: regForm.fullName,
      dept: 'General Medicine',
      doctor: 'Dr. Radhika Roy',
      slot: 'Next Available',
      status: 'Waiting',
      type: 'Walk-in'
    };
    setPatientLedger([newEntry, ...patientLedger]);
    setMetrics({ ...metrics, todaysPatients: metrics.todaysPatients + 1, walkIns: metrics.walkIns + 1, queue: metrics.queue + 1 });
    alert(`Registered ${regForm.fullName} successfully with ${newUhid}!`);
    setActiveModal(null);
    setRegForm({ fullName: '', age: '', gender: 'Male', phone: '', bloodGroup: 'B+', address: '' });
  };

  // Handle Generate Token
  const handleGenerateToken = (e) => {
    e.preventDefault();
    const issued = {
      tokenNumber: `#${patientLedger.length + 24}`,
      patientName: tokenForm.patientName,
      dept: tokenForm.department,
      doctor: tokenForm.doctor,
      cabin: 'OPD Cabin 104',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLastIssuedToken(issued);
    setMetrics({ ...metrics, queue: metrics.queue + 1 });
  };

  // Handle Admission
  const handleAdmission = (e) => {
    e.preventDefault();
    setMetrics({ ...metrics, admissions: metrics.admissions + 1 });
    alert(`Inpatient Admission confirmed for ${admissionForm.patientName} in ${admissionForm.ward} (${admissionForm.bed})!`);
    setActiveModal(null);
  };

  // Handle Discharge
  const handleDischarge = (e) => {
    e.preventDefault();
    setMetrics({ ...metrics, discharges: metrics.discharges + 1 });
    alert(`Discharge summary generated & bed released for ${dischargeForm.patientName}!`);
    setActiveModal(null);
  };

  const filteredLedger = patientLedger.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.token.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || p.dept.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Reception Action Toast */}
      {receptionToast && (
        <div
          className="animate-scale-up"
          style={{
            backgroundColor: '#1e40af',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 24px rgba(30,64,175,0.3)',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}
        >
          <Volume2 size={18} />
          <span>{receptionToast}</span>
        </div>
      )}

      {/* Banner */}
      <div
        className="shos-card"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)',
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
            <Building2 size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Central Hospital Reception & Intake Portico
              </h2>
              <Badge variant="teal">Fast-Track Front Desk</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '4px 0 0' }}>
              Phase 22 Operations • Patient Onboarding, Appointments, Token Dispensation & Care Intake
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => setActiveModal('token')}
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            fontWeight: 800,
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <Ticket size={18} style={{ marginRight: 6 }} />
          Fast-Track Token Dispenser
        </Button>
      </div>

      {/* Exactly 6 Reception Dashboard Metrics specified by user:
          - Today's Patients
          - Appointments
          - Walk-ins
          - Queue
          - Admissions
          - Discharges
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14
        }}
      >
        {[
          { title: "Today's Patients", val: metrics.todaysPatients, color: 'var(--color-primary)', icon: Users },
          { title: 'Appointments', val: metrics.appointments, color: 'var(--color-secondary)', icon: Calendar },
          { title: 'Walk-ins', val: metrics.walkIns, color: 'var(--color-text)', icon: UserPlus },
          { title: 'Live Queue', val: metrics.queue, color: 'var(--color-warning)', icon: Clock },
          { title: 'Admissions', val: metrics.admissions, color: 'var(--color-primary)', icon: BedDouble },
          { title: 'Discharges', val: metrics.discharges, color: 'var(--color-success)', icon: LogOut }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="shos-card hover-lift"
              style={{
                padding: '18px 16px',
                backgroundColor: 'var(--color-surface)',
                borderLeft: `4px solid ${m.color}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.title}
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '4px 0 0', fontFamily: 'var(--font-mono)' }}>
                  {m.val}
                </div>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  color: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Exactly 5 Reception Action Buttons specified by user:
          - Register Patient
          - Book Appointment
          - Generate Token
          - Admission
          - Discharge
      */}
      <div
        className="shos-card"
        style={{
          padding: 20,
          backgroundColor: 'var(--color-surface)'
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 14 }}>
          Reception Desk Action Center (Phase 22 Specification)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setActiveModal('register')}
            style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6, height: 'auto' }}
          >
            <strong>Register Patient</strong>
            <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>New UHID Creation</span>
          </Button>

          <Button
            variant="secondary"
            icon={Calendar}
            onClick={() => setActiveModal('appointment')}
            style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6, height: 'auto' }}
          >
            <strong>Book Appointment</strong>
            <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>Doctor & Slot Booking</span>
          </Button>

          <Button
            variant="outline"
            icon={Ticket}
            onClick={() => setActiveModal('token')}
            style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6, height: 'auto' }}
          >
            <strong>Generate Token</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>OPD Queue Ticket</span>
          </Button>

          <Button
            variant="outline"
            icon={BedDouble}
            onClick={() => setActiveModal('admission')}
            style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6, height: 'auto' }}
          >
            <strong>Admission</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Ward Bed Intake</span>
          </Button>

          <Button
            variant="outline"
            icon={LogOut}
            onClick={() => setActiveModal('discharge')}
            style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6, height: 'auto' }}
          >
            <strong>Discharge</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Discharge Clearance</span>
          </Button>
        </div>
      </div>

      {/* ACTION MODAL 1: Register Patient */}
      {activeModal === 'register' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div className="shos-card animate-scale-up" style={{ backgroundColor: 'var(--color-surface)', maxWidth: 520, width: '100%', padding: 24, borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Fast-Track Patient Registration</h3>
              <button type="button" onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleRegisterPatient} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Full Name *</label>
                <input type="text" className="shos-input" required value={regForm.fullName} onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })} placeholder="e.g. Ramesh Patel" style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Age</label>
                  <input type="number" className="shos-input" value={regForm.age} onChange={(e) => setRegForm({ ...regForm, age: e.target.value })} placeholder="42" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Gender</label>
                  <select className="shos-input" value={regForm.gender} onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })} style={{ width: '100%' }}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Blood</label>
                  <select className="shos-input" value={regForm.bloodGroup} onChange={(e) => setRegForm({ ...regForm, bloodGroup: e.target.value })} style={{ width: '100%' }}>
                    <option>A+</option><option>B+</option><option>O+</option><option>AB+</option><option>O-</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Mobile Number *</label>
                <input type="tel" className="shos-input" required value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} placeholder="+91 98765 43210" style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Generate UHID & Register</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTION MODAL 2: Book Appointment */}
      {activeModal === 'appointment' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div className="shos-card animate-scale-up" style={{ backgroundColor: 'var(--color-surface)', maxWidth: 520, width: '100%', padding: 24, borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Book OPD Consultation</h3>
              <button type="button" onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Select Specialty</label>
                <select className="shos-input" style={{ width: '100%' }}>
                  <option>Cardiology (Dr. Vivek Mehra)</option>
                  <option>General Medicine (Dr. Radhika Roy)</option>
                  <option>Orthopedics (Dr. Vikram Malhotra)</option>
                  <option>Neurology (Dr. Meenakshi Iyer)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Date & Preferred Slot</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="date" className="shos-input" defaultValue="2026-09-06" style={{ width: '60%' }} />
                  <select className="shos-input" style={{ width: '40%' }}>
                    <option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button variant="primary" onClick={() => { alert('Appointment confirmed & SMS sent to patient.'); setActiveModal(null); }}>
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL 3: Generate Token */}
      {activeModal === 'token' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div className="shos-card animate-scale-up" style={{ backgroundColor: 'var(--color-surface)', maxWidth: 480, width: '100%', padding: 24, borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Generate OPD Token</h3>
              <button type="button" onClick={() => { setActiveModal(null); setLastIssuedToken(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {lastIssuedToken ? (
              <div style={{ textAlign: 'center', padding: 16 }}>
                <Badge variant="teal">TOKEN ISSUED SUCCESSFULLY</Badge>
                <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', margin: '12px 0' }}>
                  {lastIssuedToken.tokenNumber}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  {lastIssuedToken.patientName}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '4px 0 16px' }}>
                  {lastIssuedToken.dept} • {lastIssuedToken.doctor} ({lastIssuedToken.cabin})
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <Button variant="primary" icon={Printer} onClick={() => alert(`Printing thermal slip for Token ${lastIssuedToken.tokenNumber}`)}>
                    Print Token Slip
                  </Button>
                  <Button variant="outline" onClick={() => setLastIssuedToken(null)}>
                    Next Patient
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateToken} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Patient Name *</label>
                  <input type="text" className="shos-input" required value={tokenForm.patientName} onChange={(e) => setTokenForm({ ...tokenForm, patientName: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Department</label>
                  <select className="shos-input" value={tokenForm.department} onChange={(e) => setTokenForm({ ...tokenForm, department: e.target.value })} style={{ width: '100%' }}>
                    <option>Cardiology</option><option>General Medicine</option><option>Orthopedics</option><option>Pediatrics</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                  <Button type="submit" variant="primary" icon={Ticket}>[Generate Token]</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ACTION MODAL 4: Admission */}
      {activeModal === 'admission' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div className="shos-card animate-scale-up" style={{ backgroundColor: 'var(--color-surface)', maxWidth: 500, width: '100%', padding: 24, borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Initiate Inpatient Admission</h3>
              <button type="button" onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdmission} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Patient & UHID</label>
                <input type="text" className="shos-input" value={`${admissionForm.patientName} (${admissionForm.uhid})`} readOnly style={{ width: '100%', backgroundColor: 'var(--color-surface)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Ward & Bed Assignment</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <select className="shos-input" value={admissionForm.ward} onChange={(e) => setAdmissionForm({ ...admissionForm, ward: e.target.value })} style={{ width: '70%' }}>
                    <option>Ward A — Semi-Private Unit</option>
                    <option>Ward B — General Ward</option>
                    <option>ICU Step-Down Unit</option>
                  </select>
                  <select className="shos-input" value={admissionForm.bed} onChange={(e) => setAdmissionForm({ ...admissionForm, bed: e.target.value })} style={{ width: '30%', fontWeight: 700 }}>
                    <option>Bed 01</option><option>Bed 02</option><option>Bed 03</option><option>Bed 04</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">[Confirm Admission]</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTION MODAL 5: Discharge */}
      {activeModal === 'discharge' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div className="shos-card animate-scale-up" style={{ backgroundColor: 'var(--color-surface)', maxWidth: 500, width: '100%', padding: 24, borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Patient Discharge Clearance</h3>
              <button type="button" onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleDischarge} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>Select Inpatient</label>
                <input type="text" className="shos-input" value={`${dischargeForm.patientName} (${dischargeForm.uhid}) — ${dischargeForm.ward} ${dischargeForm.bed}`} readOnly style={{ width: '100%', backgroundColor: 'var(--color-surface)' }} />
              </div>
              <div style={{ backgroundColor: 'var(--color-success-subtle)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-success)', fontSize: '0.8rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} />
                <span>Billing Status: <strong>{dischargeForm.billClearance}</strong></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary" style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}>[Generate Discharge Slip]</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Reception Patients Ledger Table */}
      <div className="shos-card" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Today's Patient Intake Ledger
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Real-time synchronization across OPD clinics, triage, and admissions
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                className="shos-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, token, UHID..."
                style={{ paddingLeft: 30, width: '100%', fontSize: '0.8rem' }}
              />
            </div>
            <select
              className="shos-input"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All Clinics</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Token #</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Patient Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>UHID</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Department</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Doctor</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Time Slot</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Front Desk Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedger.map((row) => (
                <tr key={row.token} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                    {row.token}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={() => setSelectedPatientPass(row)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 800,
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      title="Click to view Patient Gate Pass & Token"
                    >
                      <span>{row.name}</span>
                      <Eye size={13} style={{ opacity: 0.6 }} />
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                    {row.uhid}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {row.dept}
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>
                    {row.doctor}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {row.slot}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge variant={row.status === 'Emergency' ? 'critical' : row.status === 'Consulting' ? 'primary' : row.status === 'Completed' ? 'success' : 'warning'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    {row.status.includes('Awaiting Check-in') || row.status === 'Confirmed' ? (
                      <Button
                        size="xs"
                        variant="primary"
                        icon={Ticket}
                        onClick={() => handleCheckInPatient(row)}
                      >
                        Check-In & Token
                      </Button>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={Volume2}
                          onClick={() => handleChimeToken(row)}
                          title="Chime Audio Token Announcement"
                        >
                          Chime
                        </Button>
                        <Button
                          size="xs"
                          variant="secondary"
                          icon={Printer}
                          onClick={() => setSelectedPatientPass(row)}
                          title="View / Print Patient Gate Pass"
                        >
                          Pass
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PATIENT GATE PASS & INTAKE SLIP MODAL */}
      {selectedPatientPass && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
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
              maxWidth: 480,
              width: '100%',
              padding: 24,
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 12,
                borderBottom: '1px solid var(--color-border)',
                marginBottom: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ticket size={20} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                  Hospital OPD & Intake Gate Pass
                </h3>
              </div>
              <button
                onClick={() => setSelectedPatientPass(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Pass Paper Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '2px dashed var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--color-text-muted)', fontWeight: 700 }}>
                Smart Hospital Operating System (SHOS)
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                Token {selectedPatientPass.token}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)' }}>
                {selectedPatientPass.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                UHID: {selectedPatientPass.uhid}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'left', marginTop: 8, padding: 12, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Department</span>
                  <strong style={{ fontSize: '0.82rem' }}>{selectedPatientPass.dept}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Consultant</span>
                  <strong style={{ fontSize: '0.82rem' }}>{selectedPatientPass.doctor}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Appt Slot</span>
                  <strong style={{ fontSize: '0.82rem' }}>{selectedPatientPass.slot}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Admission/Intake</span>
                  <strong style={{ fontSize: '0.82rem' }}>{selectedPatientPass.type}</strong>
                </div>
              </div>

              {/* Simulated Barcode */}
              <div style={{ marginTop: 8, padding: '8px 0', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ height: 26, width: '70%', background: 'repeating-linear-gradient(90deg, #1e293b, #1e293b 2px, transparent 2px, transparent 5px)' }} />
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                  *{selectedPatientPass.uhid}*{selectedPatientPass.token}*
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
              <Button
                variant="outline"
                icon={Volume2}
                onClick={() => handleChimeToken(selectedPatientPass)}
              >
                Chime Token 🔊
              </Button>

              <div style={{ display: 'flex', gap: 10 }}>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPatientPass(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  icon={Printer}
                  onClick={() => {
                    alert(`Printing OPD Token Gate Pass for ${selectedPatientPass.name} (${selectedPatientPass.token})...`);
                  }}
                >
                  Print Gate Pass
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
