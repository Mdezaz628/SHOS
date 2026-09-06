import React, { useState } from 'react';
import {
  BedDouble,
  Activity,
  CheckCircle2,
  AlertCircle,
  Wind,
  Layers,
  Sparkles,
  PlusCircle,
  Trash2,
  UserPlus,
  LogOut,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const BedsPage = () => {
  const {
    wards,
    toggleBedStatus,
    addBed,
    removeBed,
    assignBedPatient,
    dischargeBedPatient,
    recommendations
  } = useHospital();

  const [activeWardTab, setActiveWardTab] = useState(0);

  // Modals
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [newBedId, setNewBedId] = useState('');
  const [newBedVentilator, setNewBedVentilator] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientUhid, setPatientUhid] = useState('');

  // Aggregated Bed Calculations
  const totalBeds = wards.reduce((acc, w) => acc + w.total, 0);
  const totalOccupied = wards.reduce((acc, w) => acc + w.occupied, 0);
  const totalAvailable = totalBeds - totalOccupied;
  const overallOccupancyPct = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;

  const currentWard = wards[activeWardTab] || wards[0];
  const bedRec = recommendations.find((r) => r.code.includes('BED'));

  const handleCreateBed = (e) => {
    e.preventDefault();
    if (!newBedId.trim()) return;
    addBed(activeWardTab, { id: newBedId.trim(), ventilator: newBedVentilator });
    setShowAddBedModal(false);
    setNewBedId('');
    setNewBedVentilator(false);
  };

  const handleOpenAssignModal = (bedId) => {
    setSelectedBedId(bedId);
    setPatientName('');
    setPatientUhid(`UHID-${Math.floor(10000 + Math.random() * 90000)}`);
    setShowAssignModal(true);
  };

  const handleAssignPatient = (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    assignBedPatient(activeWardTab, selectedBedId, patientName.trim(), patientUhid, 'Stable');
    setShowAssignModal(false);
  };

  const handleDischarge = (bedId, patient) => {
    if (window.confirm(`Discharge ${patient || 'patient'} from Bed ${bedId}?`)) {
      dischargeBedPatient(activeWardTab, bedId);
    }
  };

  const handleRemove = (bedId) => {
    if (window.confirm(`Decommission Bed ${bedId}?`)) {
      removeBed(activeWardTab, bedId);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <BedDouble className="text-amber" />
            Wards & Bed Occupancy Management
          </h1>
          <p className="page-subtitle">
            Real-time multi-ward bed matrix, ventilator allocation, and AI admission capacity forecasting.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setShowAddBedModal(true)}
          >
            <PlusCircle size={16} /> + Provision Bed
          </button>
          <span className="badge badge-warning">
            {overallOccupancyPct}% Total Occupancy
          </span>
        </div>
      </div>

      {/* Bed Stats */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Total Monitored Beds</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <BedDouble size={18} className="text-amber" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value">{totalBeds}</div>
          </div>
          <div className="stat-footer">
            <span>Across 4 Inpatient Wards</span>
            <span>250 Licensed</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Occupied Beds</span>
            <div className="stat-icon-wrap bg-rose-glow">
              <Activity size={18} className="text-rose" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-rose">{totalOccupied}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              <AlertCircle size={14} /> High census
            </span>
            <span>{overallOccupancyPct}% capacity</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Available & Sanitized</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle2 size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-emerald">{totalAvailable}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-down">
              Ready for immediate intake
            </span>
            <span>Sanitization: 18m avg</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Ventilator Support</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <Wind size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-cyan">24 Active</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              6 Spare units available
            </span>
            <span>ICU / HDU priority</span>
          </div>
        </div>
      </div>

      {/* AI Bed Optimization Callout */}
      {bedRec && (
        <div
          className="section-panel glass-panel-glow"
          style={{
            marginBottom: '24px',
            borderLeft: '4px solid var(--cyan-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="stat-icon-wrap bg-cyan-glow" style={{ width: '42px', height: '42px' }}>
              <Sparkles className="text-cyan" size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-ai">AI Bed Model Alert</span>
                <strong style={{ fontSize: '0.95rem' }}>{bedRec.title}</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                {bedRec.reasoning}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-cyan">{bedRec.impact}</span>
          </div>
        </div>
      )}

      {/* Ward Selector Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
        {wards.map((ward, idx) => {
          const occPct = ward.total > 0 ? Math.round((ward.occupied / ward.total) * 100) : 0;
          return (
            <button
              key={ward.name}
              className={`btn ${activeWardTab === idx ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}
              onClick={() => setActiveWardTab(idx)}
            >
              <span>{ward.name}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {ward.occupied}/{ward.total} ({occPct}%)
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Ward Detailed Panel */}
      <div className="section-panel glass-panel">
        <div className="section-panel-header">
          <div>
            <div className="section-panel-title">
              <Layers className="text-cyan" size={20} />
              <span>{currentWard.name}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Ward Classification: <strong>{currentWard.type}</strong> • Nurse-to-Patient Ratio: <strong>{currentWard.nurseRatio}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn btn-sm btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => setShowAddBedModal(true)}
            >
              <PlusCircle size={14} /> + Add Bed to {currentWard.name}
            </button>
          </div>
        </div>

        {/* Bed Matrix Grid */}
        <div className="bed-matrix-grid">
          {currentWard.beds.map((bed) => {
            const isOccupied = bed.status === 'Occupied';
            const isReserved = bed.status.includes('Reserved');

            return (
              <div
                key={bed.id}
                className={`bed-box ${isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available'}`}
                style={{ position: 'relative' }}
              >
                <div className="bed-header">
                  <span className="bed-number">{bed.id}</span>
                  <span
                    className={`badge ${
                      isOccupied ? 'badge-danger' : isReserved ? 'badge-warning' : 'badge-success'
                    }`}
                  >
                    {isOccupied ? 'Occupied' : isReserved ? 'Reserved' : 'Available'}
                  </span>
                </div>

                <div className="bed-patient">
                  {bed.patient ? (
                    <strong>{bed.patient}</strong>
                  ) : (
                    <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Empty Bed</span>
                  )}
                </div>

                <div className="bed-meta">
                  <span>{bed.condition}</span>
                  {bed.ventilator && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        color: 'var(--cyan-light)',
                        fontWeight: 600
                      }}
                    >
                      <Wind size={12} /> Vent
                    </span>
                  )}
                </div>

                {/* Bed Actions Toolbar */}
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {!isOccupied ? (
                    <button
                      onClick={() => handleOpenAssignModal(bed.id)}
                      className="btn btn-sm btn-primary"
                      style={{ flex: 1, fontSize: '0.72rem', padding: '4px 6px' }}
                    >
                      <UserPlus size={12} style={{ marginRight: 4 }} /> Admit
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDischarge(bed.id, bed.patient)}
                      className="btn btn-sm btn-secondary"
                      style={{ flex: 1, fontSize: '0.72rem', padding: '4px 6px', color: '#10b981', borderColor: '#10b981' }}
                    >
                      <LogOut size={12} style={{ marginRight: 4 }} /> Discharge
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(bed.id)}
                    title="Decommission Bed"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 6px',
                      cursor: 'pointer',
                      color: '#e11d48'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add Bed */}
      {showAddBedModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="glass-panel animate-scale-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <strong>Provision New Bed in {currentWard.name}</strong>
              <button onClick={() => setShowAddBedModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateBed} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6 }}>Bed Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. ICU-108, GWM-305"
                  value={newBedId}
                  onChange={(e) => setNewBedId(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="modalVent"
                  checked={newBedVentilator}
                  onChange={(e) => setNewBedVentilator(e.target.checked)}
                />
                <label htmlFor="modalVent" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  Equipped with Invasive Ventilator Support
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddBedModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Provision Bed</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admit Patient */}
      {showAssignModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="glass-panel animate-scale-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <strong>Admit Patient to Bed {selectedBedId}</strong>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAssignPatient} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6 }}>Patient Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Rathi"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6 }}>UHID</label>
                <input
                  type="text"
                  value={patientUhid}
                  onChange={(e) => setPatientUhid(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Admit Patient</button>
              </div>
            </form>
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
  width: '100%',
  maxWidth: 460,
  padding: 24,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)'
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.15)',
  backgroundColor: 'rgba(0,0,0,0.2)',
  color: '#ffffff',
  fontSize: '0.88rem'
};

