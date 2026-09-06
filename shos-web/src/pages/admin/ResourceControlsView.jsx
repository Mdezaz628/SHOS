import React, { useState } from 'react';
import {
  BedDouble,
  Wind,
  Activity,
  PlusCircle,
  Trash2,
  UserPlus,
  LogOut,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Droplet,
  Flame,
  Volume2,
  RefreshCw,
  Sliders,
  X,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ResourceControlsView = ({ showToast }) => {
  const {
    wards,
    equipment,
    oxygenTelemetry,
    bloodBank,
    activeCodeAlert,
    addBed,
    removeBed,
    assignBedPatient,
    dischargeBedPatient,
    addEquipment,
    removeEquipment,
    updateEquipmentStatus,
    refillOxygen,
    addBloodUnits,
    deductBloodUnits,
    broadcastEmergencyCode,
    clearEmergencyCode
  } = useHospital();

  const [selectedWardIdx, setSelectedWardIdx] = useState(0);

  // Modals state
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [newBedId, setNewBedId] = useState('');
  const [newBedVentilator, setNewBedVentilator] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientUhid, setPatientUhid] = useState('');
  const [patientCondition, setPatientCondition] = useState('Stable');

  const [showAddEquipModal, setShowAddEquipModal] = useState(false);
  const [equipName, setEquipName] = useState('');
  const [equipCategory, setEquipCategory] = useState('Respiratory Support');
  const [equipDept, setEquipDept] = useState('ICU');
  const [equipSerial, setEquipSerial] = useState('');

  const [showAddBloodModal, setShowAddBloodModal] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [bloodQty, setBloodQty] = useState('5');
  const [bloodSource, setBloodSource] = useState('Red Cross Drive');

  const currentWard = wards[selectedWardIdx] || wards[0];
  const totalBeds = wards.reduce((acc, w) => acc + w.total, 0);
  const totalOccupied = wards.reduce((acc, w) => acc + w.occupied, 0);
  const totalBloodUnits = bloodBank.reduce((acc, b) => acc + b.units, 0);

  // Handlers
  const handleCreateBed = (e) => {
    e.preventDefault();
    if (!newBedId.trim()) return;
    addBed(selectedWardIdx, { id: newBedId.trim(), ventilator: newBedVentilator });
    setShowAddBedModal(false);
    setNewBedId('');
    setNewBedVentilator(false);
    showToast(`✅ Bed ${newBedId} successfully provisioned in ${currentWard.name}.`);
  };

  const handleRemoveBed = (bedId) => {
    if (window.confirm(`Are you sure you want to decommission and remove Bed ${bedId}?`)) {
      removeBed(selectedWardIdx, bedId);
      showToast(`🗑️ Bed ${bedId} decommissioned from ${currentWard.name}.`);
    }
  };

  const handleOpenAssignModal = (bedId) => {
    setSelectedBedId(bedId);
    setPatientName('');
    setPatientUhid(`UHID-${Math.floor(10000 + Math.random() * 90000)}`);
    setPatientCondition('Stable');
    setShowAssignModal(true);
  };

  const handleAssignPatient = (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    assignBedPatient(selectedWardIdx, selectedBedId, patientName.trim(), patientUhid, patientCondition);
    setShowAssignModal(false);
    showToast(`🏥 Patient ${patientName} admitted to Bed ${selectedBedId}.`);
  };

  const handleDischargePatient = (bedId, currentPatient) => {
    if (window.confirm(`Confirm discharge for ${currentPatient || 'patient'} from Bed ${bedId}?`)) {
      dischargeBedPatient(selectedWardIdx, bedId);
      showToast(`✨ Patient discharged. Bed ${bedId} sent for sanitization.`);
    }
  };

  const handleCreateEquipment = (e) => {
    e.preventDefault();
    if (!equipName.trim()) return;
    addEquipment({
      name: equipName.trim(),
      category: equipCategory,
      department: equipDept,
      serialNumber: equipSerial.trim()
    });
    setShowAddEquipModal(false);
    setEquipName('');
    setEquipSerial('');
    showToast(`✅ Asset ${equipName} added to ${equipDept} biomedical inventory.`);
  };

  const handleRefillOxygenTank = () => {
    refillOxygen();
    showToast('❄️ Liquid Medical Oxygen Plant Cryo Tank A refilled to 100% capacity.');
  };

  const handleAddBloodDonation = (e) => {
    e.preventDefault();
    const qty = parseInt(bloodQty, 10);
    if (isNaN(qty) || qty <= 0) return;
    addBloodUnits(bloodGroup, qty);
    setShowAddBloodModal(false);
    showToast(`🩸 Logged ${qty} bags of ${bloodGroup} PRBC from ${bloodSource}.`);
  };

  const handleTriggerSiren = (code, title) => {
    broadcastEmergencyCode(code, title);
    showToast(`🚨 HOSPITAL EMERGENCY ${code.toUpperCase()} BROADCASTED ON ALL CHANNELS!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Active Hospital Emergency Broadcast Banner */}
      {activeCodeAlert && (
        <div
          style={{
            backgroundColor: '#881337',
            border: '2px solid #f43f5e',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 24px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.4)',
            animation: 'pulse 2s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Radio size={32} color="#f43f5e" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.08em' }}>
                  ACTIVE CODE: {activeCodeAlert.code}
                </span>
                <Badge variant="critical">BROADCAST ACTIVE</Badge>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.88rem', opacity: 0.95 }}>
                {activeCodeAlert.details} • Dispatched at {activeCodeAlert.timestamp}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={clearEmergencyCode} style={{ backgroundColor: '#ffffff', color: '#881337', fontWeight: 800 }}>
            Dismiss Siren
          </Button>
        </div>
      )}

      {/* Emergency Siren Broadcast Bar */}
      <div
        className="shos-card"
        style={{
          padding: '18px 24px',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          borderLeft: '5px solid #e11d48'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Volume2 size={24} color="#e11d48" />
          <div>
            <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>
              Hospital Emergency Broadcast Sirens
            </strong>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              One-touch audio pagers & mobile alert broadcast across campus
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleTriggerSiren('Code Blue', 'Cardiac Arrest in Inpatient Ward — Crash Cart & Resuscitation Team Dispatched')}
            style={{
              backgroundColor: '#1e40af',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Activity size={15} /> Code Blue (Cardiac)
          </button>

          <button
            onClick={() => handleTriggerSiren('Code Red', 'Fire & Smoke Alert — Automatic Fire Doors Sealed, Emergency Evacuation Route Active')}
            style={{
              backgroundColor: '#b91c1c',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Flame size={15} /> Code Red (Fire)
          </button>

          <button
            onClick={() => handleTriggerSiren('Code Yellow', 'Mass Casualty Disaster Surge — Trauma Surge Bay 1-4 Activated')}
            style={{
              backgroundColor: '#d97706',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <AlertTriangle size={15} /> Code Yellow (Disaster)
          </button>
        </div>
      </div>

      {/* Resource Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
            Total Monitored Beds
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '4px 0' }}>
            {totalOccupied} / {totalBeds}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 600 }}>
            {Math.round((totalOccupied / totalBeds) * 100)}% Hospital Occupancy
          </div>
        </div>

        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
            Biomedical Assets
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '4px 0' }}>
            {equipment.length} Units
          </div>
          <div style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>
            {equipment.filter((e) => e.status === 'Operational').length} Operational
          </div>
        </div>

        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
            Liquid Medical Oxygen
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '4px 0' }}>
            {oxygenTelemetry.level}%
          </div>
          <div style={{ fontSize: '0.76rem', color: '#06b6d4', fontWeight: 600 }}>
            {oxygenTelemetry.bufferHours}h Buffer • {oxygenTelemetry.pressure}
          </div>
        </div>

        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '4px solid #e11d48' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
            Blood Bank Cold Storage
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '4px 0' }}>
            {totalBloodUnits} Bags
          </div>
          <div style={{ fontSize: '0.76rem', color: '#e11d48', fontWeight: 600 }}>
            PRBC Across 8 Groups
          </div>
        </div>
      </div>

      {/* Section 1: Campus Beds & ICU Management (CRUD) */}
      <Card
        title="1. Bed & ICU Capacity Management (Admin CRUD)"
        subtitle="Provision beds, assign incoming patients with UHID, discharge, or decommission units"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          {/* Ward Tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {wards.map((ward, idx) => (
              <button
                key={ward.name}
                onClick={() => setSelectedWardIdx(idx)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: selectedWardIdx === idx ? '#0284c7' : 'var(--color-surface)',
                  color: selectedWardIdx === idx ? '#ffffff' : 'var(--color-text)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: selectedWardIdx === idx ? '#0284c7' : 'var(--color-border)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
              >
                {ward.name} ({ward.occupied}/{ward.total})
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={() => setShowAddBedModal(true)}>
            <PlusCircle size={15} style={{ marginRight: 6 }} />
            + Add Bed to {currentWard.name}
          </Button>
        </div>

        {/* Beds Matrix Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14
          }}
        >
          {currentWard.beds.map((bed) => {
            const isOccupied = bed.status === 'Occupied';
            const isReserved = bed.status.includes('Reserved');

            return (
              <div
                key={bed.id}
                className="shos-card"
                style={{
                  padding: '16px',
                  borderLeft: isOccupied ? '4px solid #e11d48' : isReserved ? '4px solid #f59e0b' : '4px solid #10b981',
                  backgroundColor: 'var(--color-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BedDouble size={18} color="var(--color-primary)" />
                    <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>{bed.id}</strong>
                  </div>
                  <Badge variant={isOccupied ? 'critical' : isReserved ? 'warning' : 'success'}>
                    {bed.status}
                  </Badge>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Assigned Patient
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    {bed.patient || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>None (Vacant Bed)</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  <span>Status: {bed.condition}</span>
                  {bed.ventilator && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0284c7', fontWeight: 700 }}>
                      <Wind size={13} /> Ventilator
                    </span>
                  )}
                </div>

                {/* Bed Admin Action Buttons */}
                <div style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
                  {!isOccupied ? (
                    <Button size="sm" variant="primary" style={{ flex: 1 }} onClick={() => handleOpenAssignModal(bed.id)}>
                      <UserPlus size={13} style={{ marginRight: 4 }} />
                      Admit Patient
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" style={{ flex: 1, borderColor: '#10b981', color: '#10b981' }} onClick={() => handleDischargePatient(bed.id, bed.patient)}>
                      <LogOut size={13} style={{ marginRight: 4 }} />
                      Discharge
                    </Button>
                  )}
                  <button
                    onClick={() => handleRemoveBed(bed.id)}
                    title="Decommission Bed"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      color: '#e11d48'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section 2: Biomedical Assets & Oxygen Plant Control */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {/* Oxygen Plant Controller */}
        <Card
          title="Central Cryogenic Oxygen Plant Controller"
          subtitle="Real-time telemetry and cryogenic liquid medical oxygen tank command"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                  {oxygenTelemetry.tankId}
                </strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Last refill: {oxygenTelemetry.lastRefill}
                </div>
              </div>
              <Badge variant="teal">{oxygenTelemetry.pressure}</Badge>
            </div>

            {/* Gauge bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                <span>Liquid Oxygen Level: {oxygenTelemetry.level}%</span>
                <span>Buffer Remaining: {oxygenTelemetry.bufferHours} Hours</span>
              </div>
              <div style={{ height: 16, backgroundColor: 'var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${oxygenTelemetry.level}%`,
                    backgroundColor: oxygenTelemetry.level > 50 ? '#06b6d4' : '#f59e0b',
                    borderRadius: 8,
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>

            <Button variant="primary" size="md" onClick={handleRefillOxygenTank}>
              <RefreshCw size={16} style={{ marginRight: 8 }} />
              Refill Cryogenic Tank to 100%
            </Button>
          </div>
        </Card>

        {/* Biomedical Equipment CRUD */}
        <Card
          title="Biomedical Assets Registry (Full CRUD)"
          subtitle="Ventilators, Defibrillators, and Hemodialysis units control"
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <Button variant="primary" size="sm" onClick={() => setShowAddEquipModal(true)}>
              <PlusCircle size={15} style={{ marginRight: 6 }} />
              + Register New Asset
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
            {equipment.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>
                    {item.name}
                  </strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    {item.category} • {item.department} • SN: {item.serialNumber}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateEquipmentStatus(item.id, item.status === 'Operational' ? 'Under Maintenance' : 'Operational')}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: item.status === 'Operational' ? '#dcfce7' : '#fee2e2',
                      color: item.status === 'Operational' ? '#15803d' : '#b91c1c'
                    }}
                  >
                    {item.status}
                  </button>
                  <button
                    onClick={() => removeEquipment(item.id)}
                    style={{ border: 'none', background: 'transparent', color: '#e11d48', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Section 3: Blood Bank Cold Storage (CRUD & Steppers) */}
      <Card
        title="3. Blood Bank Inventory & Transfusion Reserve (Admin Steppers)"
        subtitle="Real-time PRBC unit controls, donation batch logging, and emergency blood requisition"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Central Cold Storage Buffer • Safety Minimum: 10 Units / Group
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAddBloodModal(true)}>
            <PlusCircle size={15} style={{ marginRight: 6 }} />
            + Receive Donation Batch
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {bloodBank.map((item) => {
            const isCritical = item.units < 10;

            return (
              <div
                key={item.group}
                className="shos-card"
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: isCritical ? '1.5px solid #e11d48' : '1px solid var(--color-border)',
                  backgroundColor: isCritical ? 'rgba(225, 29, 72, 0.05)' : 'var(--color-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e11d48' }}>
                    {item.group}
                  </span>
                  <Badge variant={isCritical ? 'critical' : 'success'}>
                    {isCritical ? 'LOW' : 'OK'}
                  </Badge>
                </div>

                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text)' }}>
                  {item.units} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Bags</span>
                </div>

                {/* Admin Steppers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginTop: 4 }}>
                  <button
                    onClick={() => {
                      if (item.units <= 0) {
                        alert(`No ${item.group} bags left to issue.`);
                        return;
                      }
                      deductBloodUnits(item.group, 1);
                      showToast(`🩸 1 bag of ${item.group} issued for transfusion.`);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #e11d48',
                      backgroundColor: 'rgba(225, 29, 72, 0.1)',
                      color: '#e11d48',
                      fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    -1
                  </button>
                  <button
                    onClick={() => {
                      addBloodUnits(item.group, 1);
                      showToast(`✅ 1 bag added to ${item.group} cold reserve.`);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    +1
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modal: Add Bed */}
      {showAddBedModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="shos-card animate-scale-up">
            <div style={modalHeaderStyle}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                Provision New Bed in {currentWard.name}
              </strong>
              <button onClick={() => setShowAddBedModal(false)} style={closeBtnStyle}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateBed} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Bed Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. ICU-108, HDU-205"
                  value={newBedId}
                  onChange={(e) => setNewBedId(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="ventCheck"
                  checked={newBedVentilator}
                  onChange={(e) => setNewBedVentilator(e.target.checked)}
                />
                <label htmlFor="ventCheck" style={{ fontSize: '0.85rem', color: 'var(--color-text)', cursor: 'pointer' }}>
                  Equipped with Invasive Ventilator Support
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddBedModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Provision Bed</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Patient to Bed */}
      {showAssignModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="shos-card animate-scale-up">
            <div style={modalHeaderStyle}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                Admit & Assign Patient to Bed {selectedBedId}
              </strong>
              <button onClick={() => setShowAssignModal(false)} style={closeBtnStyle}><X size={18} /></button>
            </div>
            <form onSubmit={handleAssignPatient} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Patient Full Name</label>
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
                <label style={labelStyle}>UHID</label>
                <input
                  type="text"
                  value={patientUhid}
                  onChange={(e) => setPatientUhid(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Clinical Condition</label>
                <select
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Stable">Stable</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Guarded">Guarded</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Admit Patient</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Equipment */}
      {showAddEquipModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="shos-card animate-scale-up">
            <div style={modalHeaderStyle}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                Register Biomedical Equipment Asset
              </strong>
              <button onClick={() => setShowAddEquipModal(false)} style={closeBtnStyle}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateEquipment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Asset Name & Model</label>
                <input
                  type="text"
                  placeholder="e.g. Dräger Evita V500 Ventilator"
                  value={equipName}
                  onChange={(e) => setEquipName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <input
                  type="text"
                  placeholder="e.g. ICU, Emergency Trauma, OT"
                  value={equipDept}
                  onChange={(e) => setEquipDept(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Serial Number</label>
                <input
                  type="text"
                  placeholder="e.g. SN-99421-DRG"
                  value={equipSerial}
                  onChange={(e) => setEquipSerial(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddEquipModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Register Asset</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Blood Batch */}
      {showAddBloodModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="shos-card animate-scale-up">
            <div style={modalHeaderStyle}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                Receive Blood Donation Batch
              </strong>
              <button onClick={() => setShowAddBloodModal(false)} style={closeBtnStyle}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddBloodDonation} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={inputStyle}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                    <option key={grp} value={grp}>{grp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Number of Bags (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={bloodQty}
                  onChange={(e) => setBloodQty(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Donation Source / Camp</label>
                <input
                  type="text"
                  placeholder="e.g. Red Cross Drive, Voluntary Donor"
                  value={bloodSource}
                  onChange={(e) => setBloodSource(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddBloodModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Intake Units</Button>
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
  backgroundColor: 'rgba(0,0,0,0.6)',
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

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-text-muted)'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 6
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontSize: '0.88rem'
};
