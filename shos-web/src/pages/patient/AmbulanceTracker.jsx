import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Navigation,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const AmbulanceTracker = ({ emergencyData, onCancel, onCallDriver }) => {
  const [etaMinutes, setEtaMinutes] = useState(8);
  const [etaSeconds, setEtaSeconds] = useState(0);
  const [ambulanceProgress, setAmbulanceProgress] = useState(38); // percentage along route
  const [status, setStatus] = useState('En Route');

  // Simulated countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prevSec) => {
        if (prevSec > 0) {
          return prevSec - 1;
        } else {
          setEtaMinutes((prevMin) => {
            if (prevMin > 1) {
              return prevMin - 1;
            } else {
              setStatus('Arrived at Location');
              return 0;
            }
          });
          return 59;
        }
      });

      setAmbulanceProgress((prev) => (prev < 90 ? prev + 1 : 90));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const ambulanceInfo = {
    unitId: 'ALS-04 (Advanced Cardiac Life Support)',
    vehicleReg: 'DL-01-AX-9924',
    driver: 'Manoj Kumar',
    driverPhone: '+91 98110 55432',
    emt: 'Sister Deepa Roy (Paramedic Lead)',
    hospitalBase: 'SHOS Apex Super Specialty Trauma Portico',
    destination: emergencyData?.location || 'Flat 402, Lotus Greens, Sector 12'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner with Pulse Alert */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff1f2',
          border: '2px solid var(--color-critical)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--color-critical)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 0 8px rgba(220, 38, 38, 0.2)'
            }}
          >
            <Truck size={24} className="animate-pulse" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong style={{ fontSize: '1.2rem', color: 'var(--color-critical)' }}>
                Ambulance Assigned & Dispatched
              </strong>
              <Badge variant="critical">
                <Radio size={12} className="animate-pulse" style={{ marginRight: 4 }} />
                {status}
              </Badge>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {ambulanceInfo.unitId} • Reg: <strong>{ambulanceInfo.vehicleReg}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              textAlign: 'right',
              backgroundColor: 'var(--color-surface)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(220,38,38,0.2)'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Estimated Arrival (ETA)
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-critical)' }}>
              {String(etaMinutes).padStart(2, '0')}:{String(etaSeconds).padStart(2, '0')}{' '}
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schematic Map Visualizer as requested by User:
          Patient 📍
             ↑
             │
         🚑 Ambulance
             │
             ↓
        🏥 Hospital
      */}
      <div
        className="shos-card"
        style={{
          padding: 24,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Navigation size={18} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#94a3b8' }}>
              Live Telemetric Transit Route
            </span>
          </div>
          <Badge variant="teal">GPS Synchronized • ±3m accuracy</Badge>
        </div>

        {/* Schematic Route Line Visual */}
        <div
          style={{
            position: 'relative',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28
          }}
        >
          {/* Vertical Connecting Pulse Track */}
          <div
            style={{
              position: 'absolute',
              left: 45,
              top: 50,
              bottom: 50,
              width: 4,
              backgroundColor: '#334155',
              borderRadius: 2
            }}
          >
            {/* Active glowing trail */}
            <div
              style={{
                width: '100%',
                height: `${ambulanceProgress}%`,
                backgroundColor: 'var(--color-critical)',
                boxShadow: '0 0 12px var(--color-critical)',
                transition: 'height 1s linear'
              }}
            />
          </div>

          {/* Node 1: Patient 📍 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, zIndex: 2 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.6)',
                border: '3px solid #ffffff'
              }}
            >
              <MapPin size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                  Patient Location 📍
                </span>
                <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '2px 8px', borderRadius: 4 }}>
                  Destination
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0' }}>
                {ambulanceInfo.destination}
              </p>
            </div>
          </div>

          {/* Node 2: 🚑 Ambulance (Dynamic Position) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              zIndex: 2,
              paddingLeft: 4,
              transition: 'all 0.5s ease'
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px #38bdf8',
                border: '3px solid #0284c7'
              }}
            >
              <Truck size={20} color="#dc2626" />
            </div>
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid #475569',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                flex: 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                  🚑 Ambulance ALS-04 (En Route)
                </span>
                <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Speed: <strong>54 km/h</strong> • Ring Road Flyover
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 0' }}>
                Passing Outer Ring Road, 2.4 km away from patient portico. Siren & Priority Corridor Active.
              </p>
            </div>
          </div>

          {/* Node 3: 🏥 Hospital */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, zIndex: 2 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(30, 64, 175, 0.5)',
                border: '3px solid #ffffff'
              }}
            >
              <Building2 size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                  🏥 Hospital Base Portico
                </span>
                <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(30,64,175,0.3)', color: '#93c5fd', padding: '2px 8px', borderRadius: 4 }}>
                  Dispatched From
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0' }}>
                {ambulanceInfo.hospitalBase}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crew & Contact Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16
        }}
      >
        {/* Driver Card */}
        <div
          className="shos-card"
          style={{
            padding: 18,
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                fontWeight: 700
              }}
            >
              MK
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Ambulance Pilot / Driver
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {ambulanceInfo.driver}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {ambulanceInfo.driverPhone}
              </span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (onCallDriver) onCallDriver(ambulanceInfo.driverPhone);
              else alert(`Calling driver ${ambulanceInfo.driver} at ${ambulanceInfo.driverPhone}`);
            }}
          >
            <Phone size={14} style={{ marginRight: 6 }} />
            Call Driver
          </Button>
        </div>

        {/* Paramedic EMT Card */}
        <div
          className="shos-card"
          style={{
            padding: 18,
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: 'var(--color-secondary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-secondary)',
                fontWeight: 700
              }}
            >
              DR
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Attending EMT Paramedic
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {ambulanceInfo.emt}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>
                • Oxygen & Defibrillator Primed
              </span>
            </div>
          </div>
          <Badge variant="teal">On-Board</Badge>
        </div>
      </div>

      {/* Emergency Guidance Instructions */}
      <div
        style={{
          padding: '14px 18px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text)' }}>
            <strong>While you wait:</strong> Keep patient calm, loosen tight clothing, unlock house door, and have patient ID/prescriptions ready.
          </span>
        </div>

        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel} style={{ color: 'var(--color-critical)', borderColor: 'var(--color-critical)' }}>
            Cancel Request
          </Button>
        )}
      </div>
    </div>
  );
};
