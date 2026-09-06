import React, { useState } from 'react';
import {
  Activity,
  BedDouble,
  Ambulance,
  BrainCircuit,
  AlertOctagon,
  Users,
  Calendar,
  Sparkles,
  BarChart3,
  Stethoscope,
  Pill,
  FlaskConical,
  Wind,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Clock,
  Radio,
  FileCheck,
  Droplet,
  Sliders
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BedCard } from '../../components/hospital/BedCard';
import { EmergencyCard } from '../../components/hospital/EmergencyCard';
import { AmbulanceCard } from '../../components/hospital/AmbulanceCard';
import { MOCK_AMBULANCES } from '../../services/mockData';

// Sub-views for Phase 28, 29, 30 & Governance
import { HospitalPlanView } from './HospitalPlanView';
import { AIRecommendationCenter } from './AIRecommendationCenter';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { StaffGovernanceView } from './StaffGovernanceView';
import { ResourceControlsView } from './ResourceControlsView';

export const AdminDashboard = () => {
  const { metrics, emergencyCases, wards, toggleBedStatus } = useHospital();
  const [activeTab, setActiveTab] = useState('command'); // 'command' | 'plan' | 'recommendations' | 'analytics' | 'governance' | 'resources'
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleMobilizeReserves = () => {
    showToast('🚨 EMERGENCY DIRECTIVE ISSUED: 22 Registry Nurses & 5 On-Call Specialists Mobilized.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
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

      {/* Hospital Command Center Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'var(--color-surface)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <button
          onClick={() => setActiveTab('command')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'command' ? '#0284c7' : 'transparent',
            color: activeTab === 'command' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <Activity size={16} />
          <span>1. Live Command Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'plan' ? '#0284c7' : 'transparent',
            color: activeTab === 'plan' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <FileCheck size={16} />
          <span>2. Tomorrow's Hospital Plan</span>
          <span style={{ fontSize: '0.68rem', backgroundColor: '#e11d48', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
            CRITICAL
          </span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'recommendations' ? '#0284c7' : 'transparent',
            color: activeTab === 'recommendations' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <Sparkles size={16} />
          <span>3. AI Recommendation Center</span>
          <span style={{ fontSize: '0.68rem', backgroundColor: '#0d9488', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
            3 Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'analytics' ? '#0284c7' : 'transparent',
            color: activeTab === 'analytics' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <BarChart3 size={16} />
          <span>4. Predictive ML Analytics</span>
          <span style={{ fontSize: '0.68rem', backgroundColor: '#8b5cf6', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
            11 Models
          </span>
        </button>

        <button
          onClick={() => setActiveTab('governance')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'governance' ? '#0284c7' : 'transparent',
            color: activeTab === 'governance' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <Users size={16} />
          <span>5. Staff & User Governance</span>
          <span style={{ fontSize: '0.68rem', backgroundColor: '#059669', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
            Full Authority
          </span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'resources' ? '#0284c7' : 'transparent',
            color: activeTab === 'resources' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <BedDouble size={16} />
          <span>6. Resource & Asset Controls (CRUD)</span>
          <span style={{ fontSize: '0.68rem', backgroundColor: '#f59e0b', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
            Full Control
          </span>
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'plan' && <HospitalPlanView onNavigateToRecs={() => setActiveTab('recommendations')} />}
      {activeTab === 'recommendations' && <AIRecommendationCenter />}
      {activeTab === 'analytics' && <AIAnalyticsDashboard />}
      {activeTab === 'governance' && <StaffGovernanceView showToast={showToast} />}
      {activeTab === 'resources' && <ResourceControlsView showToast={showToast} />}

      {activeTab === 'command' && (
        <>
          {/* Critical Alerts Banner (Phase 27 User Specification: Doctor shortage 5, Nurse shortage 22) */}
          <div
            style={{
              backgroundColor: 'var(--color-critical-subtle)',
              border: '2px solid var(--color-critical)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              boxShadow: 'var(--shadow-critical)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                className="animate-strobe"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-critical)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <AlertOctagon size={26} />
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-critical)' }}>
                    CRITICAL SYSTEM ALERT: TOMORROW'S STAFFING DEFICIT
                  </strong>
                  <Badge variant="critical" size="sm">URGENT ACTION</Badge>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text)', marginTop: 3 }}>
                  ⚠️ <strong>Doctor shortage: 5 specialists</strong> (Cath Lab & Traumatology) • ⚠️ <strong>Nurse shortage: 22 critical care nurses</strong> (ICU & Emergency Wards)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setActiveTab('plan')}
                className="btn btn-sm btn-outline"
                style={{ borderColor: 'var(--color-critical)', color: 'var(--color-critical)' }}
              >
                Inspect Plan
              </button>
              <button
                onClick={handleMobilizeReserves}
                className="btn btn-sm btn-critical"
              >
                🚨 Mobilize On-Call Reserves
              </button>
            </div>
          </div>

          {/* Fast Resource Controls Bar */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              backgroundColor: 'var(--color-surface)',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
              <Sliders size={18} color="var(--color-primary)" />
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                Admin Resource Authority Controls:
              </strong>
            </div>

            <Button variant="outline" size="sm" onClick={() => setActiveTab('resources')}>
              <BedDouble size={14} style={{ marginRight: 6 }} />
              Manage / Admit Beds (CRUD)
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('resources')}>
              <Wind size={14} style={{ marginRight: 6 }} />
              Biomedical Assets & O2 Plant
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('resources')}>
              <Droplet size={14} style={{ marginRight: 6 }} />
              Blood Bank Steppers (+ / -)
            </Button>
            <Button variant="primary" size="sm" onClick={() => setActiveTab('governance')}>
              <Users size={14} style={{ marginRight: 6 }} />
              Staff Governance
            </Button>
          </div>

          {/* Main Dashboard Header Stats (Phase 27 User Specification) */}
          {/* Patients: 144, Emergency: 38, Beds: 75.39%, Staff: Critical */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {/* 1. Patients */}
            <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Patients (Inpatients)</span>
                <Users size={17} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '8px 0' }}>
                144
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                +18 Expected Today
              </div>
            </div>

            {/* 2. Emergency */}
            <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid var(--color-critical)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Emergency (ER Traumas)</span>
                <Activity size={17} style={{ color: 'var(--color-critical)' }} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-critical)', margin: '8px 0' }}>
                38
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-critical)', fontWeight: 700 }}>
                Level 1 Trauma Alert Active
              </div>
            </div>

            {/* 3. Beds */}
            <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid var(--color-warning)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Bed Occupancy</span>
                <BedDouble size={17} style={{ color: 'var(--color-warning)' }} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)', margin: '8px 0' }}>
                75.39%
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-warning)', fontWeight: 700 }}>
                248 / 329 Beds Occupied
              </div>
            </div>

            {/* 4. Staff */}
            <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid var(--color-critical)', backgroundColor: 'var(--color-critical-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-critical)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <span>Staffing Level</span>
                <Stethoscope size={17} style={{ color: 'var(--color-critical)' }} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-critical)', margin: '8px 0' }}>
                CRITICAL
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-critical)', fontWeight: 800 }}>
                🔴 Shortage: 5 Doctors, 22 Nurses
              </div>
            </div>
          </div>

          {/* AI Predictions Panel (Phase 27 User Specification) */}
          {/* Patient Load: 144, Emergency Demand: 38, Bed Occupancy: 75.39%, Pharmacy Demand: 275, Lab Workload: 466 */}
          <div
            className="hospital-monitor-panel"
            style={{ padding: '24px 28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 229, 255, 0.15)',
                    color: '#00e5ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <BrainCircuit size={18} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                    AI Predictive Operations Telemetry (Tomorrow's Forecast)
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Real-time inference generated by 8 trained machine learning models
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="vitals-val-green" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00ff88' }} />
                  Live ML Pipeline Active
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {/* Prediction 1 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: 14, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Patient Load
                </span>
                <div className="vitals-val-cyan" style={{ fontSize: '1.9rem', margin: '4px 0' }}>
                  144
                </div>
                <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>Admissions Expected</span>
              </div>

              {/* Prediction 2 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: 14, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Emergency Demand
                </span>
                <div className="vitals-val-red" style={{ fontSize: '1.9rem', margin: '4px 0' }}>
                  38
                </div>
                <span style={{ fontSize: '0.68rem', color: '#fb7185' }}>STAT Trauma Intakes</span>
              </div>

              {/* Prediction 3 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: 14, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Bed Occupancy
                </span>
                <div className="vitals-val-amber" style={{ fontSize: '1.9rem', margin: '4px 0' }}>
                  75.39%
                </div>
                <span style={{ fontSize: '0.68rem', color: '#fde047' }}>Hospital Capacity</span>
              </div>

              {/* Prediction 4 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: 14, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pharmacy Demand
                </span>
                <div className="vitals-val-green" style={{ fontSize: '1.9rem', margin: '4px 0' }}>
                  275
                </div>
                <span style={{ fontSize: '0.68rem', color: '#86efac' }}>Prescription Orders</span>
              </div>

              {/* Prediction 5 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: 14, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Lab Workload
                </span>
                <div className="vitals-val-cyan" style={{ fontSize: '1.9rem', margin: '4px 0' }}>
                  466
                </div>
                <span style={{ fontSize: '0.68rem', color: '#7dd3fc' }}>Diagnostic Tests</span>
              </div>
            </div>
          </div>

          {/* Hospital Live Multi-Ward Overview & Active Emergency Trauma */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
            {/* Active Emergency Cases */}
            <Card
              title="Active Emergency Trauma Queue (STAT)"
              subtitle="Prioritizing Level 1 resuscitation and red alert arrivals"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {emergencyCases.slice(0, 3).map((c) => (
                  <EmergencyCard key={c.id} emergencyCase={c} />
                ))}
              </div>
            </Card>

            {/* Critical Care ICU Beds */}
            <Card
              title="Critical Care ICU & Multi-Ward Bed Matrix"
              subtitle="Click bed cubicle to toggle clinical availability"
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                {wards[0]?.beds.slice(0, 6).map((b) => (
                  <BedCard key={b.id} bed={b} onToggleStatus={() => toggleBedStatus(0, b.id)} />
                ))}
              </div>
            </Card>
          </div>

          {/* Active GPS Ambulances & Inbound Trauma Portico */}
          <Card
            title="Active GPS Ambulance Fleet & Inbound Trauma Radar"
            subtitle="Real-time cardiac life-support vehicle telemetry & patient vitals feed"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {MOCK_AMBULANCES.map((amb) => (
                <AmbulanceCard key={amb.id} ambulance={amb} />
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
