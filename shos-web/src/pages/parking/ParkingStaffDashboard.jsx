import React, { useState } from 'react';
import {
  Car,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  LogOut,
  MapPin
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VehicleEntryForm } from './VehicleEntryForm';

export const ParkingStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'new_entry'

  // Exact 4 metrics requested by user:
  // - Total Slots
  // - Available
  // - Occupied
  // - Reserved
  const [stats, setStats] = useState({
    totalSlots: 250,
    available: 42,
    occupied: 196,
    reserved: 12
  });

  // Zone A slots matching user's exact specification:
  // Zone A
  // 🟢 A01
  // 🔴 A02
  // 🟢 A03
  const [zoneASlots, setZoneASlots] = useState([
    { id: 'A01', code: '🟢', status: 'Available', vehicle: null, type: 'Open', color: 'var(--color-success)' },
    { id: 'A02', code: '🔴', status: 'Occupied', vehicle: 'DL-03-CC-1024', type: 'Patient SUV (In Ward)', color: 'var(--color-critical)' },
    { id: 'A03', code: '🟢', status: 'Available', vehicle: null, type: 'Open', color: 'var(--color-success)' },
    { id: 'A04', code: '🟡', status: 'Reserved', vehicle: 'ALS-AMB-02', type: 'Emergency Standby Bay', color: 'var(--color-warning)' },
    { id: 'A05', code: '🔴', status: 'Occupied', vehicle: 'UP-16-BZ-8821', type: 'OPD Visitor Sedan', color: 'var(--color-critical)' },
    { id: 'A06', code: '🟢', status: 'Available', vehicle: null, type: 'Open', color: 'var(--color-success)' }
  ]);

  const [activeVehicles, setActiveVehicles] = useState([
    { id: 'PRK-892102', vehicle: 'DL-03-CC-1024', slot: 'Zone A — A02', type: 'Patient Car', entryTime: '08:15 AM', driver: 'Sunita Sharma' },
    { id: 'PRK-892099', vehicle: 'UP-16-BZ-8821', slot: 'Zone A — A05', type: 'Visitor Sedan', entryTime: '08:45 AM', driver: 'Alok Gupta' },
    { id: 'PRK-892080', vehicle: 'HR-26-DK-4091', slot: 'Zone B — B04', type: 'Doctor Sedan', entryTime: '07:50 AM', driver: 'Dr. Vivek Mehra' }
  ]);

  const handleVehicleEntry = (newPass) => {
    // Add to active parked list
    setActiveVehicles([
      {
        id: newPass.passId,
        vehicle: newPass.vehicleNumber,
        slot: newPass.slot,
        type: newPass.type,
        entryTime: newPass.entryTime,
        driver: newPass.driverName
      },
      ...activeVehicles
    ]);

    // Update slot status in Zone A if applicable
    const slotId = newPass.slot.split('—')[1]?.trim();
    if (slotId) {
      setZoneASlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? { ...s, code: '🔴', status: 'Occupied', vehicle: newPass.vehicleNumber, color: 'var(--color-critical)' }
            : s
        )
      );
    }

    setStats((prev) => ({
      ...prev,
      available: prev.available - 1,
      occupied: prev.occupied + 1
    }));
  };

  const handleReleaseVehicle = (vehicleId, slotName) => {
    setActiveVehicles(activeVehicles.filter((v) => v.id !== vehicleId));

    const slotId = slotName.split('—')[1]?.trim();
    if (slotId) {
      setZoneASlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? { ...s, code: '🟢', status: 'Available', vehicle: null, color: 'var(--color-success)' }
            : s
        )
      );
    }

    setStats((prev) => ({
      ...prev,
      available: prev.available + 1,
      occupied: prev.occupied - 1
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div
        className="shos-card"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #0369a1 100%)',
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
            <Car size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Hospital Parking & Barrier Control
              </h2>
              <Badge variant="teal">Boom Barrier 01 Active</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '4px 0 0' }}>
              Phase 21 Operations • Inbound Emergency Corridor & Multi-Level Facility
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => setActiveTab(activeTab === 'new_entry' ? 'overview' : 'new_entry')}
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            fontWeight: 800,
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {activeTab === 'new_entry' ? 'View Parking Grid' : '+ Vehicle Entry / Issue QR'}
        </Button>
      </div>

      {/* Exact 4 Parking Staff Metrics specified by user:
          - Total Slots
          - Available
          - Occupied
          - Reserved
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16
        }}
      >
        {[
          { title: 'Total Slots', val: stats.totalSlots, sub: 'Capacity across all 3 zones', color: 'var(--color-primary)', bg: 'var(--color-primary-subtle)', icon: Car },
          { title: 'Available', val: stats.available, sub: 'Vacant & ready for entry', color: 'var(--color-success)', bg: 'var(--color-success-subtle)', icon: CheckCircle2 },
          { title: 'Occupied', val: stats.occupied, sub: 'Currently parked vehicles', color: 'var(--color-critical)', bg: 'var(--color-critical-subtle)', icon: Clock },
          { title: 'Reserved', val: stats.reserved, sub: 'Emergency & Ambulance bays', color: 'var(--color-warning)', bg: 'var(--color-warning-subtle)', icon: AlertTriangle }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="shos-card hover-lift"
              style={{
                padding: '20px 18px',
                backgroundColor: 'var(--color-surface)',
                borderLeft: `4px solid ${m.color}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.title}
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text)', margin: '6px 0 2px', fontFamily: 'var(--font-mono)' }}>
                  {m.val}
                </div>
                <span style={{ fontSize: '0.74rem', color: m.color, fontWeight: 600 }}>
                  {m.sub}
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

      {/* Screen 1: Vehicle Entry Form with [Generate QR] */}
      {activeTab === 'new_entry' && (
        <VehicleEntryForm
          onVehicleAdded={handleVehicleEntry}
          onClose={() => setActiveTab('overview')}
        />
      )}

      {/* Screen 2: Zone A Visual Slot Layout (Exact User Specification) */}
      <div className="shos-card" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Parking: Zone A (Emergency Ground Portico)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Real-time slot visual telemetry with direct boom barrier sync
            </p>
          </div>

          <div style={{ display: 'flex', gap: 14, fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>🟢</span> Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>🔴</span> Occupied
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>🟡</span> Reserved Bay
            </span>
          </div>
        </div>

        {/* Zone A Slot Grid: 🟢 A01, 🔴 A02, 🟢 A03... */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 14
          }}
        >
          {zoneASlots.map((slot) => (
            <div
              key={slot.id}
              className="shos-card hover-lift"
              style={{
                padding: 16,
                backgroundColor: slot.status === 'Occupied' ? '#fff1f2' : slot.status === 'Reserved' ? '#fffbeb' : '#f0fdf4',
                border: `2px solid ${slot.color}`,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>{slot.code}</span>
                <strong style={{ fontSize: '1.15rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                  {slot.id}
                </strong>
                <Badge variant={slot.status === 'Available' ? 'success' : slot.status === 'Occupied' ? 'critical' : 'warning'}>
                  {slot.status}
                </Badge>
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 4 }}>
                {slot.vehicle || 'Empty Slot'}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                {slot.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Parked Vehicles Ledger */}
      <div className="shos-card" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Live Parked Vehicles Ledger ({activeVehicles.length} vehicles)
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Automatic tariff calculation on checkout
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Pass ID</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Vehicle #</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Allocated Slot</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Category / Type</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Entry Time</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Driver</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeVehicles.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontWeight: 700 }}>
                    {v.id}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--color-text)' }}>
                    {v.vehicle}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge variant="teal">{v.slot}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>
                    {v.type}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} style={{ color: 'var(--color-text-muted)' }} />
                      <span>{v.entryTime}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text)' }}>
                    {v.driver}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReleaseVehicle(v.id, v.slot)}
                    >
                      <LogOut size={13} style={{ marginRight: 4 }} />
                      Check Out & Clear
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
