import React from 'react';
import {
  Heart,
  Activity,
  AlertTriangle,
  Ambulance,
  BedDouble,
  Droplet,
  Wind,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const HospitalTicker = () => {
  return (
    <div className="hospital-ticker-strip">
      {/* Hospital Identity & Accreditation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 16 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            color: '#38bdf8',
            fontWeight: 800,
            fontSize: '0.76rem',
            letterSpacing: '0.04em'
          }}
        >
          <Radio size={12} className="text-emerald animate-pulse" />
          <span>SHOS APEX HOSPITAL & TRAUMA CENTER</span>
        </span>
        <span
          style={{
            fontSize: '0.62rem',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            color: '#7dd3fc',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontWeight: 700
          }}
        >
          NABH & JCI ACCREDITED
        </span>
      </div>

      {/* Live ECG Waveform Animation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 16 }}>
        <Heart size={14} style={{ color: '#ef4444' }} className="animate-heartbeat" />
        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ER MONITORS:</span>
        <svg width="84" height="20" viewBox="0 0 84 20" style={{ stroke: '#00ff88', fill: 'none', strokeWidth: 1.8 }}>
          <path
            d="M0,10 L18,10 L22,4 L26,17 L30,2 L34,16 L38,10 L54,10 L58,4 L62,17 L66,2 L70,16 L74,10 L84,10"
            className="animate-ecg"
          />
        </svg>
        <span className="vitals-val-green" style={{ fontSize: '0.78rem' }}>76 BPM</span>
      </div>

      {/* Code Red / Trauma Alert */}
      <div className="hospital-ticker-item">
        <span className="animate-strobe" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#ff0055', fontWeight: 800 }}>
          <AlertTriangle size={13} />
          <span>CODE RED:</span>
        </span>
        <span style={{ color: '#fecdd3', fontWeight: 600 }}>Trauma Bay 1 Active (STEMI Inbound)</span>
      </div>

      {/* ICU Bed Saturation */}
      <div className="hospital-ticker-item">
        <BedDouble size={13} style={{ color: '#ffb703' }} />
        <span>ICU SATURATION:</span>
        <span className="vitals-val-amber">91.4% (CRITICAL)</span>
      </div>

      {/* Inbound Ambulances */}
      <div className="hospital-ticker-item">
        <Ambulance size={13} style={{ color: '#38bdf8' }} />
        <span>AMBULANCES:</span>
        <span className="vitals-val-cyan">3 En Route (Avg ETA: 06m)</span>
      </div>

      {/* Blood Bank Alert */}
      <div className="hospital-ticker-item">
        <Droplet size={13} style={{ color: '#ef4444' }} />
        <span>BLOOD BANK:</span>
        <span style={{ color: '#f87171', fontWeight: 700 }}>O-Negative (2 Units STAT)</span>
      </div>

      {/* O2 Reserve */}
      <div className="hospital-ticker-item">
        <Wind size={13} style={{ color: '#00ff88' }} />
        <span>LIQUID O2:</span>
        <span className="vitals-val-green">3,400L (4.2 Bar Normal)</span>
      </div>
    </div>
  );
};
