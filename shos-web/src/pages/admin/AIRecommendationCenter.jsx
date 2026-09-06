import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  BrainCircuit,
  Sliders,
  Users,
  BedDouble,
  Pill,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const AIRecommendationCenter = () => {
  const [recommendations, setRecommendations] = useState([
    {
      id: 'REC-01',
      title: 'Emergency Staffing Deficit Mitigation: Float Pool Mobilization',
      sourceModel: 'train_staff_workload.py (GradientBoosting Regressor)',
      priority: 'critical',
      status: 'pending',
      summary: 'Projected deficit of 22 Staff Nurses and 5 On-Call Specialist Doctors in Emergency Trauma & Critical Care ICU.',
      prescribedAction: 'Activate 22 Float Pool and On-Call Registry Nurses; authorize emergency overtime for 5 Senior Trauma Specialists for the 08:00–16:00 shift.',
      expectedImpact: 'Normalizes nurse-to-patient ratio from 1:8 to clinical standard 1:4; reduces Emergency triage boarding dwell time by ~34 minutes.',
      confidence: '96.2%',
      riskReduction: 'High (Prevents critical care burnout & adverse events)'
    },
    {
      id: 'REC-02',
      title: 'Acute Bed Saturation Relief: Fast-Track Morning Discharges',
      sourceModel: 'approve_bed_occupancy_recommendation.py (XGBoost Classifier)',
      priority: 'high',
      status: 'pending',
      summary: 'Bed occupancy forecasted at 75.39% with ICU saturation reaching 91.4% by 14:00.',
      prescribedAction: 'Instruct Ward B & Ward C attendings to prioritize 12 medically stable step-down patient discharge summaries before 11:00 AM.',
      expectedImpact: 'Frees 12 acute telemetry beds ahead of afternoon elective surgeries and ER inpatient admissions, avoiding holding holds.',
      confidence: '93.8%',
      riskReduction: 'Medium (Maintains 15% emergency bed buffer)'
    },
    {
      id: 'REC-03',
      title: 'Central Pharmacy Influx Pre-Batching & Rapid Dispense Kits',
      sourceModel: 'approve_hospital_plan.py (RandomForest Influx Model)',
      priority: 'medium',
      status: 'approved',
      summary: '275 prescription items forecasted with heavy concentration on STAT respiratory and cardiac drugs.',
      prescribedAction: 'Direct Central Pharmacy night shift to pre-pack 45 Level-1 Emergency cardiac and bronchodilator intravenous kits.',
      expectedImpact: 'Reduces medication dispensing turnaround time by 62% during peak 10:00–12:00 admission window.',
      confidence: '91.5%',
      riskReduction: 'Medium (Eliminates pharmacy bottleneck)'
    }
  ]);

  const [simulationModal, setSimulationModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleApprove = (id) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'approved' } : rec))
    );
    showToast(`Recommendation ${id} APPROVED and transmitted to Department HODs & Operations Desk`);
  };

  const handleRejectConfirm = () => {
    if (!rejectModal) return;
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === rejectModal.id ? { ...rec, status: 'rejected', rejectReason } : rec))
    );
    showToast(`Recommendation ${rejectModal.id} REJECTED. Reason logged in clinical audit trail.`);
    setRejectModal(null);
    setRejectReason('');
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

      {/* Header Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '22px 28px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
              }}
            >
              <BrainCircuit size={22} />
            </span>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', margin: 0 }}>
                AI Prescriptive Decision & Recommendation Engine
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Human-in-the-Loop Clinical Optimization Queue derived from 8 Predictive Models
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="teal" size="md">
            <Sparkles size={12} /> 3 Actionable Proposals
          </Badge>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="shos-card"
            style={{
              padding: '24px 26px',
              borderLeft: rec.priority === 'critical' ? '5px solid #e11d48' : rec.priority === 'high' ? '5px solid #f59e0b' : '5px solid #0284c7',
              backgroundColor: rec.status === 'approved' ? '#fafffc' : '#ffffff'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Badge variant={rec.priority === 'critical' ? 'critical' : rec.priority === 'high' ? 'warning' : 'primary'}>
                    {rec.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
                    {rec.id}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 600 }}>
                    Model: {rec.sourceModel}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', margin: '8px 0 4px 0' }}>
                  {rec.title}
                </h3>
              </div>

              <div>
                {rec.status === 'approved' ? (
                  <Badge variant="success" size="md">
                    <Check size={13} /> APPROVED & EXECUTING
                  </Badge>
                ) : rec.status === 'rejected' ? (
                  <Badge variant="critical" size="md">
                    <XCircle size={13} /> REJECTED
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="md">
                    <Clock size={13} /> PENDING ACTION
                  </Badge>
                )}
              </div>
            </div>

            {/* Prescribed Action */}
            <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', margin: '14px 0' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Prescribed Clinical Action:
              </div>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 4 }}>
                {rec.prescribedAction}
              </p>
            </div>

            {/* Expected Impact Box (Phase 29 User Specification) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', backgroundColor: 'var(--color-success-subtle)', borderRadius: '8px', border: '1px solid var(--color-success)' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-success)', textTransform: 'uppercase' }}>
                  Expected Operational Impact:
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text)', margin: '2px 0 0 0' }}>
                  {rec.expectedImpact}
                </p>
              </div>
            </div>

            {/* Review Workflow Actions: [Approve], [Reject], [Simulate Impact] */}
            {rec.status === 'pending' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18, borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSimulationModal(rec)}
                >
                  Simulate Impact
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={XCircle}
                  onClick={() => setRejectModal(rec)}
                  style={{ color: 'var(--color-critical)', borderColor: 'var(--color-critical)' }}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={() => handleApprove(rec.id)}
                  style={{ background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)' }}
                >
                  Approve & Implement
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Impact Simulation */}
      {simulationModal && (
        <Modal
          isOpen={true}
          onClose={() => setSimulationModal(null)}
          title={`Operational Simulation: ${simulationModal.id}`}
          subtitle="Pre-flight delta comparison generated by digital twin simulator"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, borderRadius: 8, backgroundColor: '#fff5f5', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '0.74rem', color: '#991b1b', fontWeight: 800 }}>WITHOUT ACTION (BASELINE)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#b91c1c', marginTop: 4 }}>1:8 Nurse Ratio</div>
                <div style={{ fontSize: '0.76rem', color: '#7f1d1d', marginTop: 4 }}>Dwell time: 48m • Overload Risk: High</div>
              </div>
              <div style={{ padding: 14, borderRadius: 8, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 800 }}>WITH ACTION (SIMULATED)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#065f46', marginTop: 4 }}>1:4 Nurse Ratio</div>
                <div style={{ fontSize: '0.76rem', color: '#064e3b', marginTop: 4 }}>Dwell time: 14m • Overload Risk: Low</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Confidence Band: <strong>{simulationModal.confidence}</strong> • Primary Driver: Inpatient Acuity Index
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <Button variant="outline" onClick={() => setSimulationModal(null)}>Close Simulation</Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleApprove(simulationModal.id);
                  setSimulationModal(null);
                }}
              >
                Approve from Simulation
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Rejection Reason */}
      {rejectModal && (
        <Modal
          isOpen={true}
          onClose={() => setRejectModal(null)}
          title={`Reject Recommendation: ${rejectModal.id}`}
          subtitle="Please log a mandatory clinical or logistical justification"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                Reason for Rejection
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Relief staffing already arranged via external vendor; ICU admissions deferred..."
                className="shos-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button>
              <Button
                variant="critical"
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
