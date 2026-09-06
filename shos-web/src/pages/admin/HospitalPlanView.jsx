import React, { useState } from 'react';
import {
  Calendar,
  AlertOctagon,
  CheckCircle2,
  Users,
  BedDouble,
  Activity,
  Pill,
  FlaskConical,
  Wind,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  Printer,
  Sparkles,
  Lock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const HospitalPlanView = ({ onNavigateToRecs }) => {
  const [planStatus, setPlanStatus] = useState('pending'); // 'pending' | 'approved'
  const [approvalStamp, setApprovalStamp] = useState(null);

  const tomorrowDateStr = new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleApprovePlan = () => {
    const stamp = {
      approvedBy: 'Dr. A. K. Sharma (Medical Director & Hospital Administrator)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      authCode: 'SHOS-AUTH-' + Math.floor(100000 + Math.random() * 900000)
    };
    setApprovalStamp(stamp);
    setPlanStatus('approved');
  };

  const staffingRows = [
    { cadre: 'Specialist Doctors & Residents', required: 38, available: 33, deficit: -5, status: 'critical', note: 'Cath Lab & ER Traumatology Deficit' },
    { cadre: 'Critical Care & Staff Nurses', required: 86, available: 64, deficit: -22, status: 'critical', note: 'ICU 1:1 Care Ratio Compromised' },
    { cadre: 'Ward Support & Orderlies', required: 45, available: 42, deficit: -3, status: 'warning', note: 'Patient Transfer & Wheelchair Escorts' },
    { cadre: 'Diagnostic Lab Technicians', required: 28, available: 28, deficit: 0, status: 'optimal', note: 'Full Shift Coverage Confirmed' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Plan Header Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '24px 28px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <FileCheck size={24} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', margin: 0 }}>
                  Tomorrow's Master Hospital Operating Plan
                </h2>
                {planStatus === 'approved' ? (
                  <Badge variant="success" size="md">
                    <CheckCircle2 size={12} /> APPROVED & LOCKED
                  </Badge>
                ) : (
                  <Badge variant="critical" size="md">
                    <AlertOctagon size={12} /> PENDING ADMIN SIGN-OFF
                  </Badge>
                )}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Target Operational Date: <strong>{tomorrowDateStr}</strong> • Model Ensemble: XGBoost + Prophet (94.8% Confidence)
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {planStatus === 'pending' ? (
            <Button
              variant="primary"
              size="lg"
              icon={CheckCircle2}
              onClick={handleApprovePlan}
              style={{ background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)' }}
            >
              Approve Tomorrow's Plan
            </Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Lock size={14} /> Plan Digitally Signed
              </span>
              <Button variant="outline" size="sm" icon={Printer} onClick={() => window.print()}>
                Print Executive Slip
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Approval Confirmation Banner (if approved) */}
      {approvalStamp && (
        <div
          style={{
            backgroundColor: 'var(--color-success-subtle)',
            border: '1.5px solid var(--color-success)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-teal)'
          }}
          className="animate-scale-up"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={24} style={{ color: 'var(--color-success)' }} />
            <div>
              <strong style={{ color: 'var(--color-success)', fontSize: '0.95rem', display: 'block' }}>
                Executive Sign-off Verified
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Authorized By: {approvalStamp.approvedBy} at {approvalStamp.timestamp} • Digital Verification Code: <strong>{approvalStamp.authCode}</strong>
              </span>
            </div>
          </div>
          <Badge variant="success" size="sm">NABH COMPLIANT</Badge>
        </div>
      )}

      {/* Tomorrow's 4 Key Influx Forecast Cards (Exact User Requirements) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {/* 1. Expected Patients */}
        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '5px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Expected Influx</span>
            <Users size={17} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '8px 0' }}>
            144
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--color-primary)', fontWeight: 700 }}>
            +18 vs 30-Day Average
          </div>
        </div>

        {/* 2. Emergency Demand */}
        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '5px solid var(--color-critical)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Emergency Demand</span>
            <Activity size={17} style={{ color: 'var(--color-critical)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-critical)', margin: '8px 0' }}>
            38
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--color-critical)', fontWeight: 700 }}>
            Level 1 & Level 2 Traumas
          </div>
        </div>

        {/* 3. Bed Occupancy */}
        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '5px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Bed Occupancy</span>
            <BedDouble size={17} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)', margin: '8px 0' }}>
            75.39%
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--color-warning)', fontWeight: 700 }}>
            248 of 329 Total Beds Filled
          </div>
        </div>

        {/* 4. Overall Risk Score */}
        <div className="shos-card" style={{ padding: '20px 18px', borderLeft: '5px solid var(--color-critical)', backgroundColor: 'var(--color-critical-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-critical)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Overall System Risk</span>
            <AlertOctagon size={17} style={{ color: 'var(--color-critical)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-critical)', margin: '8px 0' }}>
            CRITICAL
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--color-critical)', fontWeight: 800 }}>
            🔴 Level 4 Alert: Staffing Deficit
          </div>
        </div>
      </div>

      {/* Staffing Requirements & Shortage Ledger (User Requirement) */}
      <Card
        title="Clinical Staffing Requirements & Deficit Analysis"
        subtitle="Calculated shift rosters vs predicted multi-ward acuity requirements"
        action={
          <Button variant="secondary" size="sm" icon={Sparkles} onClick={onNavigateToRecs}>
            View AI Recommendations
          </Button>
        }
      >
        <div className="shos-table-container">
          <table className="shos-table">
            <thead>
              <tr>
                <th>Medical Cadre</th>
                <th>Required Staff</th>
                <th>Current Roster</th>
                <th>Staffing Balance</th>
                <th>Urgency Status</th>
                <th>Clinical Risk Impact</th>
              </tr>
            </thead>
            <tbody>
              {staffingRows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <strong style={{ fontSize: '0.88rem' }}>{row.cadre}</strong>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.92rem' }}>
                      {row.required}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.92rem' }}>
                      {row.available}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        color: row.deficit < 0 ? '#dc2626' : '#059669'
                      }}
                    >
                      {row.deficit > 0 ? `+${row.deficit}` : row.deficit}
                    </span>
                  </td>
                  <td>
                    <Badge variant={row.status === 'critical' ? 'critical' : row.status === 'warning' ? 'warning' : 'success'}>
                      {row.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ancillary Demands Forecast (Pharmacy, Lab, Resources) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {/* Pharmacy Demands */}
        <div className="shos-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ padding: 8, borderRadius: '8px', backgroundColor: '#eff6ff', color: '#0284c7' }}>
              <Pill size={20} />
            </span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Pharmacy Influx Demand</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Prescription items forecasted tomorrow</span>
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
            275 <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>Orders</span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <div>• High Demand: IV Antibiotics (Ceftriaxone, Piperacillin)</div>
            <div>• Emergency Pre-packs: 45 STAT trauma kits ready</div>
          </div>
        </div>

        {/* Lab Workload */}
        <div className="shos-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ padding: 8, borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              <FlaskConical size={20} />
            </span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Diagnostic Lab Workload</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Pathology, biochemistry & blood gas assays</span>
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
            466 <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>Tests</span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <div>• 92 STAT Cardiac Panels (Troponin-I & CK-MB)</div>
            <div>• 140 Arterial Blood Gas (ABG) samples queued</div>
          </div>
        </div>

        {/* Resource Demands */}
        <div className="shos-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ padding: 8, borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Wind size={20} />
            </span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Equipment & Consumables</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Life support & clinical apparatus</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 8 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Ventilators</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>18 / 22 in Use</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 8 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Infusion Pumps</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>42 Active</div>
            </div>
          </div>
          <div style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 700, marginTop: 10 }}>
            Central Oxygen Reserve: 3,400L Available (Safe)
          </div>
        </div>
      </div>
    </div>
  );
};
