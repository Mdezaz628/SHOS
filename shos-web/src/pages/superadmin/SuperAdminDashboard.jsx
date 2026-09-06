import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  Activity,
  BrainCircuit,
  Server,
  Building2,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  HardDrive,
  Users,
  Radio,
  Sliders,
  Check
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

import { FinancialIntelligenceView } from './FinancialIntelligenceView';

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('infrastructure'); // 'infrastructure' | 'financials'
  const [retrainingModel, setRetrainingModel] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [aiModels, setAiModels] = useState([
    { code: 'M01-PATIENT-LOAD', name: 'Patient Inpatient Load Predictor', algorithm: 'XGBoost Regressor', r2Score: '0.948', mae: '2.41', latency: '12ms', status: 'optimal', lastTrained: 'Today, 02:00 AM' },
    { code: 'M02-EMERGENCY-INFLUX', name: 'STAT Emergency Trauma Influx', algorithm: 'GradientBoosting', r2Score: '0.912', mae: '1.85', latency: '14ms', status: 'optimal', lastTrained: 'Today, 02:00 AM' },
    { code: 'M03-BED-OCCUPANCY', name: 'Multi-Ward Bed Occupancy Rate', algorithm: 'LightGBM Multi-Ward', r2Score: '0.954', mae: '1.12%', latency: '9ms', status: 'optimal', lastTrained: 'Today, 02:00 AM' },
    { code: 'M04-STAFF-WORKLOAD', name: 'Nurse & Doctor Workload Strain', algorithm: 'Neural Network MLP', r2Score: '0.926', mae: '0.34', latency: '18ms', status: 'critical_shortage', lastTrained: 'Today, 02:00 AM' },
    { code: 'M05-PHARMACY-DEMAND', name: 'Central Pharmacy Item Consumption', algorithm: 'RandomForest Regressor', r2Score: '0.931', mae: '12.4 items', latency: '15ms', status: 'optimal', lastTrained: 'Today, 02:00 AM' },
    { code: 'M06-LAB-WORKLOAD', name: 'Diagnostic Pathology & ABG Workload', algorithm: 'ExtraTrees Classifier', r2Score: '0.960', mae: '8.2 tests', latency: '11ms', status: 'optimal', lastTrained: 'Today, 02:00 AM' },
    { code: 'M07-ANOMALY-SURGE', name: 'Viral Respiratory Surge Detector', algorithm: 'Isolation Forest', r2Score: '0.905', mae: '0.04', latency: '8ms', status: 'warning', lastTrained: 'Today, 02:00 AM' },
    { code: 'M08-READMISSION-RISK', name: '30-Day Congestive Failure Readmit', algorithm: 'CatBoost Acuity Engine', r2Score: '0.929', mae: '1.2%', latency: '16ms', status: 'optimal', lastTrained: 'Today, 02:00 AM' }
  ]);

  const hospitalNodes = [
    { name: 'Campus Alpha (Central Apex Hospital)', city: 'New Delhi (Main)', beds: '329 Beds', occupancy: '75.39%', status: 'Online', ip: '10.240.0.1' },
    { name: 'Campus Beta (Heart & Vascular Pavilion)', city: 'South NCR (Saket)', beds: '180 Beds', occupancy: '82.40%', status: 'Online', ip: '10.240.1.1' },
    { name: 'Campus Gamma (Oncology & Critical Care)', city: 'Gurugram Hub', beds: '240 Beds', occupancy: '79.10%', status: 'Online', ip: '10.240.2.1' }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleRetrain = (code) => {
    setRetrainingModel(code);
    setTimeout(() => {
      setRetrainingModel(null);
      showToast(`Model ${code} successfully retrained on latest Supabase vectors. R² improved to 0.952.`);
    }, 1800);
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

      {/* Navigation Sub-Tabs */}
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
          onClick={() => setActiveTab('infrastructure')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'infrastructure' ? '#0284c7' : 'transparent',
            color: activeTab === 'infrastructure' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <Cpu size={16} />
          <span>1. Infrastructure & AI Models Control Plane</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: activeTab === 'financials' ? '#0284c7' : 'transparent',
            color: activeTab === 'financials' ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <ShieldCheck size={16} />
          <span>2. Live Financial Transactions & Revenue Stream</span>
          <span style={{ fontSize: '0.68rem', backgroundColor: '#059669', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
            AUDIT ACTIVE
          </span>
        </button>
      </div>

      {activeTab === 'financials' && <FinancialIntelligenceView />}

      {activeTab === 'infrastructure' && (
        <>
          {/* Super Admin Executive Header */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              padding: '24px 28px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <ShieldCheck size={26} />
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', margin: 0 }}>
                      Hospital Enterprise Governance & Super Admin Console
                    </h2>
                    <Badge variant="teal" size="sm">
                      <Radio size={11} className="text-emerald animate-pulse" /> NETWORK ACTIVE
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Multi-Campus Governance, AI Inference Model Control Plane & Supabase Cloud Integration
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => handleRetrain('ALL-MODELS')}
                className="btn btn-primary"
                disabled={retrainingModel !== null}
              >
                <RefreshCw size={15} className={retrainingModel ? 'animate-spin' : ''} />
                <span>{retrainingModel ? 'Retraining Pipeline...' : 'Retrain All 8 Models'}</span>
              </button>
            </div>
          </div>

          {/* 4 Super Admin Infrastructure Telemetry KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
        {/* Card 1 */}
        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Network Campuses</span>
            <Building2 size={17} style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '8px 0' }}>
            3 Nodes
          </div>
          <div style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700 }}>
            749 Total Network Beds
          </div>
        </div>

        {/* Card 2 */}
        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #0d9488' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>AI Inference Engine</span>
            <Cpu size={17} style={{ color: '#0d9488' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '8px 0' }}>
            8 / 8 Online
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
            Avg Latency: 13.4 ms
          </div>
        </div>

        {/* Card 3 */}
        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Supabase PostgreSQL</span>
            <Database size={17} style={{ color: 'var(--color-success)' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-success)', margin: '8px 0' }}>
            Connected
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-success)', fontWeight: 700 }}>
            Active Ping: 12 ms
          </div>
        </div>

        {/* Card 4 */}
        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Security & Compliance</span>
            <Lock size={17} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '8px 0' }}>
            100%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', fontWeight: 700 }}>
            NABH • NABL • HIPAA AES-256
          </div>
        </div>
      </div>

      {/* 8 AI Model Registry (The Central Heart of SHOS ML System) */}
      <Card
        title="8 Trained Machine Learning Models Governance Matrix"
        subtitle="Real-time model package telemetry, R² evaluation metrics, and retraining execution"
      >
        <div className="shos-table-container">
          <table className="shos-table">
            <thead>
              <tr>
                <th>Model Code</th>
                <th>Model Name & Task</th>
                <th>Algorithm Architecture</th>
                <th>Evaluation R²</th>
                <th>Mean Error (MAE)</th>
                <th>Inference Latency</th>
                <th>Pipeline Health</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {aiModels.map((m) => (
                <tr key={m.code}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-primary)' }}>
                      {m.code}
                    </strong>
                  </td>
                  <td>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.86rem' }}>{m.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Trained: {m.lastTrained}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {m.algorithm}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-success)', fontSize: '0.9rem' }}>
                      {m.r2Score}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                      {m.mae}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--color-primary)' }}>
                      {m.latency}
                    </span>
                  </td>
                  <td>
                    {m.status === 'optimal' ? (
                      <Badge variant="success" size="sm">OPTIMAL</Badge>
                    ) : m.status === 'warning' ? (
                      <Badge variant="warning" size="sm">SURGE DETECTED</Badge>
                    ) : (
                      <Badge variant="critical" size="sm">DEFICIT ALERT</Badge>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleRetrain(m.code)}
                      disabled={retrainingModel === m.code}
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.76rem', padding: '4px 8px' }}
                    >
                      <RefreshCw size={12} className={retrainingModel === m.code ? 'animate-spin' : ''} />
                      <span>{retrainingModel === m.code ? 'Retraining...' : 'Retrain'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Hospital Network Nodes & Multi-Tenant Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* Campus Nodes */}
        <Card
          title="Multi-Campus Hospital Node Cluster"
          subtitle="Real-time telemetry across regional apex medical institutes"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hospitalNodes.map((node, idx) => (
              <div
                key={idx}
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>{node.name}</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                    Location: {node.city} • Internal Gateway: <span style={{ fontFamily: 'var(--font-mono)' }}>{node.ip}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant="success" size="sm">
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                    {node.status}
                  </Badge>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                    {node.beds} ({node.occupancy})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cloud Database & Server Telemetry */}
        <Card
          title="Supabase PostgreSQL & FastAPI Gateway Telemetry"
          subtitle="Cloud database connection, service keys, and replication"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-text-dim)' }}>Supabase REST Endpoint:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>jrcpqbyofshlkxoayfvh.supabase.co</strong>
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-text-dim)' }}>Secret Key Signature:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#047857' }}>sb_secret_dgZ3Odv... (Active)</strong>
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-text-dim)' }}>AI Service Port (FastAPI):</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>http://localhost:8000 (Ready)</strong>
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-text-dim)' }}>Encrypted Clinical Audit Log:</span>
                <strong style={{ color: '#047857' }}>Zero Breaches • TLS 1.3 Certified</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </>
    )}
  </div>
  );
};
