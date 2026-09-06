import React, { useState } from 'react';
import { FlaskConical, CheckCircle2, AlertOctagon, TestTube2, ShieldCheck, Microscope, Award, FileCheck } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LabReportCard } from '../../components/hospital/LabReportCard';

export const LabDashboard = () => {
  const { labOrders } = useHospital();
  const [orders, setOrders] = useState([
    {
      orderId: 'LAB-551',
      testName: 'High-Sensitivity Troponin-I (Cardiac Biomarker)',
      patientName: 'Rahul Sharma',
      uhid: 'SHOS-2026-8942',
      doctor: 'Dr. Vikram Malhotra',
      category: 'Biochemistry / Cardiac',
      status: 'Awaiting Pathologist Signoff',
      findings: 'Observed: 14.2 pg/mL (Normal < 19.8 pg/mL). Specimen verified on automated Abbott Architect Analyzer.',
      urgency: 'STAT Trauma',
    },
    {
      orderId: 'LAB-552',
      testName: 'Complete Blood Count (CBC) with Platelet Histogram',
      patientName: 'Meena Kumari',
      uhid: 'SHOS-2026-7781',
      doctor: 'Dr. Vikram Malhotra',
      category: 'Hematology',
      status: 'Analyzing Specimen',
      findings: 'Hb 13.8 g/dL, Total Leukocyte Count 7,400 /mcL, Platelets 2.45 L/mcL.',
      urgency: 'Routine OPD',
    },
    {
      orderId: 'LAB-553',
      testName: 'Arterial Blood Gas (ABG) & Serum Lactate',
      patientName: 'Vikramaditya Rao',
      uhid: 'SHOS-2026-1192',
      doctor: 'Dr. Sunita Rao (ICU)',
      category: 'Critical Care ICU',
      status: 'Awaiting Pathologist Signoff',
      findings: 'pH 7.36, pCO2 39 mmHg, pO2 92 mmHg, Lactate 1.8 mmol/L (Stable post-PTCA).',
      urgency: 'Emergency ICU',
    },
  ]);

  const handleAuthorizeReport = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === id ? { ...o, status: 'NABL Certified & Released' } : o
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Pathology & Diagnostic Laboratory Console
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            NABL Accredited Central Laboratory • Automated Sample Accessioning, Critical Value Triage & Pathologist Signoff
          </p>
        </div>

        <Badge variant="teal" size="lg">
          <Award size={14} style={{ marginRight: 6 }} /> NABL Quality ISO-15189 Certified
        </Badge>
      </div>

      {/* Lab Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="shos-card" style={{ padding: 18, borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
            STAT Urgent Samples
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            3 Active
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>Mean Turnaround: 24 mins</div>
        </div>

        <div className="shos-card" style={{ padding: 18, borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
            Automated Analyzers
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            5 / 5 Calibrated
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Biochemistry, Hematology, ABG</div>
        </div>

        <div className="shos-card" style={{ padding: 18, borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
            Certified Pathologist
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            Dr. R. K. Sen
          </div>
          <div style={{ fontSize: '0.72rem', color: '#8b5cf6', fontWeight: 700 }}>Digital Signature Active</div>
        </div>
      </div>

      <Card title="Specimen Investigation & Release Queue" subtitle="Prioritizing STAT trauma, ICU panels, and inpatient reports">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((r) => {
            const isReleased = r.status.includes('Released');
            return (
              <div
                key={r.orderId}
                className="shos-card"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14,
                  backgroundColor: 'var(--color-surface)',
                  borderLeft: isReleased ? '4px solid #10b981' : '4px solid #f59e0b',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>{r.testName}</strong>
                    <Badge variant={r.urgency.includes('STAT') || r.urgency.includes('Emergency') ? 'critical' : 'primary'} size="sm">
                      {r.urgency}
                    </Badge>
                    <Badge variant={isReleased ? 'success' : 'warning'} size="sm">
                      {r.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                    Patient: <strong>{r.patientName}</strong> ({r.uhid}) • Ordered by <strong>{r.doctor}</strong> • Sample ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{r.orderId}</span>
                  </div>
                  <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: '0.78rem', color: 'var(--color-text)' }}>
                    🔬 <strong>Investigation Findings:</strong> {r.findings}
                  </div>
                </div>

                <div>
                  {!isReleased ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ShieldCheck}
                      onClick={() => handleAuthorizeReport(r.orderId)}
                    >
                      Authorize & Sign NABL Report
                    </Button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.82rem', fontWeight: 800 }}>
                      <CheckCircle2 size={16} /> Certified & Live on EHR
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
