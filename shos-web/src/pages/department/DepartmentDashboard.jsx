import React, { useState } from 'react';
import {
  Building2,
  Users,
  BedDouble,
  Activity,
  AlertTriangle,
  Calendar,
  FlaskConical,
  Gauge,
  Stethoscope,
  Clock,
  CheckCircle2,
  Heart,
  Wind,
  Plus,
  Send,
  Radio,
  FileText,
  UserCheck
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const DepartmentDashboard = () => {
  const [selectedDeptKey, setSelectedDeptKey] = useState('cardio');
  const [activeModal, setActiveModal] = useState(null); // 'reallocate' | 'relief' | 'sbar'
  const [reallocateWard, setReallocateWard] = useState('Ward B (HDU)');
  const [bedCount, setBedCount] = useState(4);
  const [reliefCadre, setReliefCadre] = useState('Staff Nurse');
  const [reliefCount, setReliefCount] = useState(3);
  const [sbarMemo, setSbarMemo] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const departments = {
    cardio: {
      name: 'Cardiology & Cath Lab',
      hod: 'Prof. Dr. Vivek Mehra (MD, DM, FACC)',
      leadNurse: 'Sister Jessy Thomas (RN, B.Sc)',
      location: 'Block A, 3rd Floor',
      stats: {
        patients: 144,
        appointments: 86,
        bedOccupancy: '75.4%',
        bedsOccupied: 42,
        bedsTotal: 50,
        staff: 68,
        emergency: 38,
        lab: 466,
        workload: '91%',
        resources: 4
      },
      beds: [
        { id: 'C-01', patient: 'Rajesh Malhotra', uhid: 'SHOS-89421', diagnosis: 'Acute STEMI (Cath Lab Post-PTCA)', vitals: 'HR 74 • SpO2 98%', o2: '2L Cannula', status: 'occupied' },
        { id: 'C-02', patient: 'Sunita Sharma', uhid: 'SHOS-88310', diagnosis: 'Unstable Angina', vitals: 'HR 88 • SpO2 97%', o2: 'Room Air', status: 'occupied' },
        { id: 'C-03', patient: 'Vikram Sethi', uhid: 'SHOS-90124', diagnosis: 'Heart Failure NYHA-III', vitals: 'HR 82 • SpO2 95%', o2: '4L Mask', status: 'occupied' },
        { id: 'C-04', patient: 'Available', uhid: '--', diagnosis: 'Sanitized & Ready', vitals: '--', o2: 'Central O2 OK', status: 'available' },
        { id: 'C-05', patient: 'Anita Joshi', uhid: 'SHOS-91204', diagnosis: 'Atrial Fibrillation with RVR', vitals: 'HR 102 • SpO2 96%', o2: 'Room Air', status: 'occupied' },
        { id: 'C-06', patient: 'Available', uhid: '--', diagnosis: 'Disinfected', vitals: '--', o2: 'Central O2 OK', status: 'available' }
      ],
      hourlyRush: [
        { hour: '08:00', load: 14 },
        { hour: '09:00', load: 28 },
        { hour: '10:00', load: 38 }, // Peak
        { hour: '11:00', load: 34 },
        { hour: '12:00', load: 22 },
        { hour: '13:00', load: 16 },
        { hour: '14:00', load: 20 },
        { hour: '15:00', load: 26 },
        { hour: '16:00', load: 30 },
        { hour: '17:00', load: 32 }, // Evening Surge
        { hour: '18:00', load: 24 }
      ],
      dutyStaff: [
        { name: 'Dr. Vivek Mehra', role: 'Senior Interventional Cardiologist', status: 'In Cath Lab (Stent Case)', pager: 'Ext 301' },
        { name: 'Dr. Priya Nambiar', role: 'Clinical Fellow (Cardio)', status: 'CCU Bedside Rounds', pager: 'Ext 304' },
        { name: 'Sister Jessy Thomas', role: 'Nurse Incharge', status: 'Medication Administration', pager: 'Ext 310' },
        { name: 'Nurse Rahul Sen', role: 'Staff Nurse (Critical)', status: 'Vitals & ECG Recording', pager: 'Ext 312' }
      ]
    },
    ortho: {
      name: 'Trauma & Orthopaedics',
      hod: 'Dr. Ananya Nair (MS, MCh Ortho)',
      leadNurse: 'Sister Manpreet Kaur',
      location: 'Block B, 2nd Floor',
      stats: {
        patients: 128,
        appointments: 74,
        bedOccupancy: '82.0%',
        bedsOccupied: 41,
        bedsTotal: 50,
        staff: 54,
        emergency: 42,
        lab: 380,
        workload: '86%',
        resources: 2
      },
      beds: [
        { id: 'O-01', patient: 'Harish Kumar', uhid: 'SHOS-82103', diagnosis: 'Femur Fracture Post-ORIF', vitals: 'HR 78 • SpO2 99%', o2: 'Room Air', status: 'occupied' },
        { id: 'O-02', patient: 'Available', uhid: '--', diagnosis: 'Ready for Admission', vitals: '--', o2: 'Central O2 OK', status: 'available' }
      ],
      hourlyRush: [
        { hour: '08:00', load: 10 },
        { hour: '10:00', load: 32 },
        { hour: '12:00', load: 25 },
        { hour: '14:00', load: 18 },
        { hour: '16:00', load: 28 }
      ],
      dutyStaff: [
        { name: 'Dr. Ananya Nair', role: 'Chief Orthopaedic Surgeon', status: 'Major OT 2', pager: 'Ext 201' },
        { name: 'Sister Manpreet Kaur', role: 'Charge Nurse', status: 'Traction Ward Rounds', pager: 'Ext 210' }
      ]
    },
    icu: {
      name: 'Critical Care (ICU / HDU)',
      hod: 'Dr. Radhika Roy (MD, EDIC)',
      leadNurse: 'Sister Beena Varghese',
      location: 'Block A, 1st Floor',
      stats: {
        patients: 156,
        appointments: 32,
        bedOccupancy: '94.2%',
        bedsOccupied: 48,
        bedsTotal: 51,
        staff: 82,
        emergency: 46,
        lab: 590,
        workload: '96%',
        resources: 6
      },
      beds: [
        { id: 'ICU-01', patient: 'Ramesh Chander', uhid: 'SHOS-78901', diagnosis: 'Septic Shock (Norepinephrine)', vitals: 'HR 108 • SpO2 93%', o2: 'Ventilator SIMV', status: 'occupied' },
        { id: 'ICU-02', patient: 'Meena Kapoor', uhid: 'SHOS-79012', diagnosis: 'Severe ARDS (Prone Position)', vitals: 'HR 92 • SpO2 92%', o2: 'FiO2 60% Vent', status: 'occupied' }
      ],
      hourlyRush: [
        { hour: '08:00', load: 22 },
        { hour: '10:00', load: 40 },
        { hour: '12:00', load: 35 },
        { hour: '14:00', load: 30 },
        { hour: '16:00', load: 45 }
      ],
      dutyStaff: [
        { name: 'Dr. Radhika Roy', role: 'Intensivist HOD', status: 'Central Line Insertion', pager: 'Ext 101' },
        { name: 'Sister Beena Varghese', role: 'Senior Critical Care RN', status: 'ABG Blood Analysis', pager: 'Ext 108' }
      ]
    }
  };

  const currentDept = departments[selectedDeptKey] || departments.cardio;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReallocate = () => {
    showToast(`Successfully reallocated ${bedCount} beds from ${currentDept.name} to ${reallocateWard}`);
    setActiveModal(null);
  };

  const handleReliefRequest = () => {
    showToast(`Emergency relief requested for ${reliefCount} ${reliefCadre}s via Central Nursing Pool`);
    setActiveModal(null);
  };

  const handleSbarBroadcast = () => {
    showToast(`Clinical SBAR Memo broadcasted to all ${currentDept.name} nursing stations & on-call residents`);
    setActiveModal(null);
    setSbarMemo('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Toast Banner */}
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

      {/* Header with Hospital Department Meta */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          backgroundColor: 'var(--color-surface)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={20} />
            </span>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', margin: 0 }}>
                {currentDept.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                <span><strong>HOD:</strong> {currentDept.hod}</span>
                <span>•</span>
                <span><strong>Location:</strong> {currentDept.location}</span>
                <span>•</span>
                <Badge variant="teal" size="sm">Active Clinical Census</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Department Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedDeptKey('cardio')}
            className={`btn btn-sm ${selectedDeptKey === 'cardio' ? 'btn-primary' : 'btn-outline'}`}
          >
            🫀 Cardiology
          </button>
          <button
            onClick={() => setSelectedDeptKey('ortho')}
            className={`btn btn-sm ${selectedDeptKey === 'ortho' ? 'btn-primary' : 'btn-outline'}`}
          >
            🦴 Orthopaedics
          </button>
          <button
            onClick={() => setSelectedDeptKey('icu')}
            className={`btn btn-sm ${selectedDeptKey === 'icu' ? 'btn-primary' : 'btn-outline'}`}
          >
            ⚡ Critical Care ICU
          </button>
        </div>
      </div>

      {/* 8 Official Department Overview Stats (Phase 26 User Specification) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
        {/* 1. Patients */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>Inpatients</span>
            <Users size={15} style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '6px 0' }}>
            {currentDept.stats.patients}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>Active in Ward</div>
        </div>

        {/* 2. Appointments */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid #0d9488' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>Appointments</span>
            <Calendar size={15} style={{ color: '#0d9488' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '6px 0' }}>
            {currentDept.stats.appointments}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: 600 }}>Today's OPD Bookings</div>
        </div>

        {/* 3. Beds */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>Bed Occupancy</span>
            <BedDouble size={15} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#b45309', margin: '6px 0' }}>
            {currentDept.stats.bedOccupancy}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>
            {currentDept.stats.bedsOccupied} / {currentDept.stats.bedsTotal} Occupied
          </div>
        </div>

        {/* 4. Staff */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>On-Duty Staff</span>
            <Stethoscope size={15} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '6px 0' }}>
            {currentDept.stats.staff}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>Doctors & RNs Active</div>
        </div>

        {/* 5. Emergency */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid #e11d48' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>Emergency (ER)</span>
            <Activity size={15} style={{ color: '#e11d48' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#e11d48', margin: '6px 0' }}>
            {currentDept.stats.emergency}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: 600 }}>Trauma Triage Influx</div>
        </div>

        {/* 6. Lab */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>Lab Assays</span>
            <FlaskConical size={15} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '6px 0' }}>
            {currentDept.stats.lab}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>Pathology & Blood Gas</div>
        </div>

        {/* 7. Workload */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>Workload Index</span>
            <Gauge size={15} style={{ color: '#f97316' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#c2410c', margin: '6px 0' }}>
            {currentDept.stats.workload}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: 700 }}>🔴 High Shift Strain</div>
        </div>

        {/* 8. Resources */}
        <div className="shos-card" style={{ padding: '16px 14px', borderTop: '3px solid var(--color-critical)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
            <span>Resource Alert</span>
            <AlertTriangle size={15} style={{ color: 'var(--color-critical)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-critical)', margin: '6px 0' }}>
            {currentDept.stats.resources} Low
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-critical)', fontWeight: 600 }}>O2 & Syringe Pumps</div>
        </div>
      </div>

      {/* Action Strip: 3 Department Clinical Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button variant="primary" icon={BedDouble} onClick={() => setActiveModal('reallocate')}>
          Reallocate Department Beds
        </Button>
        <Button variant="secondary" icon={UserCheck} onClick={() => setActiveModal('relief')}>
          Request Float Nurse / Resident Relief
        </Button>
        <Button variant="outline" icon={Radio} onClick={() => setActiveModal('sbar')}>
          Broadcast SBAR Clinical Handover
        </Button>
      </div>

      {/* Visual Charts: Hourly Inpatient Footfall Curve & Bed Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20 }}>
        {/* Hourly Rush Visual Curve */}
        <Card
          title="Hourly Patient Influx & OPD Rush Curve"
          subtitle="Real-time clinical throughput & peak load times"
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 170, padding: '16px 8px 8px 8px', borderBottom: '1px solid var(--color-border)' }}>
            {currentDept.hourlyRush.map((item) => {
              const heightPercent = (item.load / 45) * 100;
              const isPeak = item.load >= 30;
              return (
                <div key={item.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isPeak ? '#e11d48' : 'var(--color-text)' }}>
                    {item.load}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 24,
                      height: `${heightPercent}%`,
                      borderRadius: '4px 4px 0 0',
                      background: isPeak
                        ? 'linear-gradient(180deg, #e11d48 0%, #be123c 100%)'
                        : 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                      boxShadow: isPeak ? '0 4px 12px rgba(225, 29, 72, 0.3)' : '0 2px 6px rgba(2, 132, 199, 0.2)',
                      transition: 'height 0.4s ease'
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', transform: 'rotate(-45deg)', origin: 'center', marginTop: 8 }}>
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <span>🟡 Morning Surge: 10:00 - 11:30</span>
            <span>🔴 Evening Triage Surge: 16:30 - 18:00</span>
          </div>
        </Card>

        {/* Department Bed Census Matrix */}
        <Card
          title="Clinical Bed Telemetry Matrix"
          subtitle="Real-time bedside vitals and oxygen cannula feed"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {currentDept.beds.map((b) => (
              <div
                key={b.id}
                className={`clinical-bed-card ${b.status}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.88rem' }}>
                    {b.id}
                  </span>
                  <Badge variant={b.status === 'occupied' ? 'critical' : 'success'} size="sm">
                    {b.status === 'occupied' ? 'OCCUPIED' : 'READY'}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.patient}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)' }}>
                  {b.uhid}
                </div>
                {b.status === 'occupied' && (
                  <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600, marginTop: 4 }}>
                    {b.vitals}
                  </div>
                )}
                <div style={{ fontSize: '0.68rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Wind size={11} /> {b.o2}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Clinician & Nursing Roster on Duty */}
      <Card
        title="Department Clinicians & Specialist Roster"
        subtitle="On-duty consultants, clinical fellows, and charge nurses with direct paging"
      >
        <div className="shos-table-container">
          <table className="shos-table">
            <thead>
              <tr>
                <th>Medical Personnel</th>
                <th>Designation / Role</th>
                <th>Clinical Assignment</th>
                <th>Internal Pager</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentDept.dutyStaff.map((staff, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem'
                        }}
                      >
                        {staff.name.charAt(staff.name.indexOf(' ') + 1) || 'D'}
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.86rem' }}>{staff.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Verified Clinical Staff</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{staff.role}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#0284c7' }} />
                      {staff.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text)' }}>
                      {staff.pager}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => showToast(`Emergency paging notification sent to ${staff.name} (${staff.pager})`)}
                      className="btn btn-sm btn-outline"
                    >
                      📟 Page
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal 1: Reallocate Department Beds */}
      <Modal
        isOpen={activeModal === 'reallocate'}
        onClose={() => setActiveModal(null)}
        title="Reallocate Department Beds"
        subtitle="Dynamically adjust step-down and acute care bed assignments"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
              Target Receiving Ward
            </label>
            <select
              value={reallocateWard}
              onChange={(e) => setReallocateWard(e.target.value)}
              className="shos-input"
            >
              <option value="Ward B (HDU)">Ward B (HDU Step-Down)</option>
              <option value="Ward C (Pulmonology)">Ward C (Pulmonology Acute)</option>
              <option value="Trauma Observation Portico">Trauma Observation Portico</option>
              <option value="Emergency Step-Down Bay">Emergency Step-Down Bay</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
              Number of Beds to Reallocate
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={bedCount}
              onChange={(e) => setBedCount(Number(e.target.value))}
              className="shos-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleReallocate}>Confirm Reallocation</Button>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Request Float Staff Relief */}
      <Modal
        isOpen={activeModal === 'relief'}
        onClose={() => setActiveModal(null)}
        title="Emergency Relief Staffing Request"
        subtitle="Request on-call personnel mobilization from Central Nursing & Resident Office"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
              Staff Cadre Needed
            </label>
            <select
              value={reliefCadre}
              onChange={(e) => setReliefCadre(e.target.value)}
              className="shos-input"
            >
              <option value="Staff Nurse">Staff Nurse (ICU/HDU Trained)</option>
              <option value="Junior Resident">Junior Resident (Medical/Surgical)</option>
              <option value="Respiratory Therapist">Respiratory Therapist</option>
              <option value="Ward Support / Orderly">Ward Support / Orderly</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
              Required Count
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={reliefCount}
              onChange={(e) => setReliefCount(Number(e.target.value))}
              className="shos-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="secondary" onClick={handleReliefRequest}>Dispatch Relief Alert</Button>
          </div>
        </div>
      </Modal>

      {/* Modal 3: Broadcast SBAR Handover */}
      <Modal
        isOpen={activeModal === 'sbar'}
        onClose={() => setActiveModal(null)}
        title="Broadcast Clinical SBAR Handover"
        subtitle="Situation - Background - Assessment - Recommendation Memo"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
              Clinical Handover Notes (SBAR)
            </label>
            <textarea
              rows={4}
              value={sbarMemo}
              onChange={(e) => setSbarMemo(e.target.value)}
              placeholder="S: Bed 01 STEMI post-stent; B: History of CAD; A: Vitals stable on 2L O2; R: Check repeat cardiac enzymes at 16:00..."
              className="shos-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" icon={Send} onClick={handleSbarBroadcast}>Broadcast to Ward Station</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
