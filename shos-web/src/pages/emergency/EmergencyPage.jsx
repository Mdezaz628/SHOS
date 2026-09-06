import React, { useState } from 'react';
import {
  Ambulance,
  HeartPulse,
  AlertOctagon,
  Clock,
  PlusCircle,
  Stethoscope,
  Activity,
  UserCheck,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { MOCK_AMBULANCES } from '../../services/mockData';

export const EmergencyPage = () => {
  const { emergencyCases, addEmergencyCase } = useHospital();
  const [showModal, setShowModal] = useState(false);

  // Form state for new emergency patient
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [complaint, setComplaint] = useState('');
  const [triageLevel, setTriageLevel] = useState('Level 2 - Emergent');
  const [bay, setBay] = useState('Trauma Bay 2');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Vivek Mehra (Cardiology)');

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const triageColor = triageLevel.startsWith('Level 1')
      ? 'danger'
      : triageLevel.startsWith('Level 2')
      ? 'warning'
      : 'primary';

    const newCase = {
      id: `ER-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      age: Number(age) || 30,
      gender,
      triageLevel,
      triageColor,
      complaint,
      arrivalTime: 'Just now',
      assignedDoctor,
      bay,
      status: 'Admitted, Triage in Progress'
    };

    addEmergencyCase(newCase);
    setShowModal(false);
    // Reset form
    setPatientName('');
    setAge('');
    setComplaint('');
  };

  const level1Count = emergencyCases.filter((c) => c.triageLevel.startsWith('Level 1')).length;
  const level2Count = emergencyCases.filter((c) => c.triageLevel.startsWith('Level 2')).length;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <HeartPulse className="text-rose" />
            Emergency & Trauma Operations
          </h1>
          <p className="page-subtitle">
            Rapid trauma triage, resuscitation bays, and live ambulance fleet coordination.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-danger" onClick={() => setShowModal(true)}>
            <PlusCircle size={16} /> Fast-Track Triage Intake
          </button>
        </div>
      </div>

      {/* Emergency Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Active Trauma Patients</span>
            <div className="stat-icon-wrap bg-rose-glow">
              <Activity size={18} className="text-rose" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-rose">{emergencyCases.length}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              Immediate attention active
            </span>
            <span>All ER Bays 85% full</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Level 1 Resuscitation</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(244, 63, 94, 0.2)' }}>
              <AlertOctagon size={18} className="text-rose" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-rose">{level1Count} CRITICAL</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              Cath Lab / CPR Protocol
            </span>
            <span>Zero wait time</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Level 2 Emergent</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <ShieldAlert size={18} className="text-amber" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-amber">{level2Count} High-Risk</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              Target response &lt;15m
            </span>
            <span>Stabilization active</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Ambulance Fleet</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <Ambulance size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-cyan">4 Units</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-down">
              1 incoming (ETA 6m)
            </span>
            <span>2 stationed ready</span>
          </div>
        </div>
      </div>

      {/* Main Active Cases Table */}
      <div className="section-panel glass-panel" style={{ marginBottom: '24px' }}>
        <div className="section-panel-header">
          <div className="section-panel-title">
            <Activity className="text-rose" size={20} />
            <span>Emergency Department Live Triage Roster</span>
          </div>
          <span className="badge badge-danger pulse">Live Trauma Feed</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Patient Details</th>
                <th>Triage Priority</th>
                <th>Presenting Condition & Vitals</th>
                <th>Assigned Bay & Specialist</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {emergencyCases.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-light)' }}>
                    {c.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{c.patientName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {c.age} yrs • {c.gender === 'M' ? 'Male' : 'Female'} • Arr: {c.arrivalTime}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${c.triageColor}`}>
                      {c.triageLevel}
                    </span>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                      {c.complaint}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.bay}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {c.assignedDoctor}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--cyan-light)', fontWeight: 600 }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ambulances Telemetry & Quick Dispatch */}
      <div className="section-panel glass-panel">
        <div className="section-panel-header">
          <div className="section-panel-title">
            <Radio className="text-cyan" size={20} />
            <span>Live GPS Ambulance & Critical Transport Units</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {MOCK_AMBULANCES.map((amb) => (
            <div
              key={amb.id}
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                  {amb.id}
                </span>
                <span
                  className={`badge ${
                    amb.status.includes('Route')
                      ? 'badge-danger'
                      : amb.status.includes('Returning')
                      ? 'badge-warning'
                      : 'badge-success'
                  }`}
                >
                  {amb.status.split(' (')[0]}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{amb.type}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Paramedic:</strong> {amb.driver}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>GPS Sector:</strong> {amb.location}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  color: 'var(--cyan-light)',
                  marginTop: '4px'
                }}
              >
                Payload: {amb.patient}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fast-Track Admission Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box glass-panel-glow" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <HeartPulse className="text-rose" size={24} />
              <h3 style={{ margin: 0 }}>Fast-Track Emergency Patient Intake</h3>
            </div>

            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    marginTop: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      marginTop: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      marginTop: '4px'
                    }}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Triage Classification
                </label>
                <select
                  value={triageLevel}
                  onChange={(e) => setTriageLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    marginTop: '4px'
                  }}
                >
                  <option value="Level 1 - Resuscitation">Level 1 - Resuscitation (Red)</option>
                  <option value="Level 2 - Emergent">Level 2 - Emergent (Amber)</option>
                  <option value="Level 3 - Urgent">Level 3 - Urgent (Cyan)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Presenting Chief Complaint & Vitals
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Unresponsive, GCS 7, SpO2 78%, severe blunt abdominal trauma"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    marginTop: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Allocated Bay
                  </label>
                  <input
                    type="text"
                    value={bay}
                    onChange={(e) => setBay(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      marginTop: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Attending Physician
                  </label>
                  <input
                    type="text"
                    value={assignedDoctor}
                    onChange={(e) => setAssignedDoctor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      marginTop: '4px'
                    }}
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Admit to ER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
