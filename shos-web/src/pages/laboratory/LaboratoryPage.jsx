import React, { useState } from 'react';
import {
  FlaskConical,
  TestTube2,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Search,
  Activity,
  Sparkles,
  FileText,
  X,
  Eye,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const LaboratoryPage = () => {
  const { labOrders } = useHospital();
  const [orders, setOrders] = useState(labOrders);
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabReport, setSelectedLabReport] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  const handleStatusToggle = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, status: order.status === 'Report Ready' ? 'Delivered' : 'Report Ready' }
          : order
      )
    );
  };

  const handleSignAndDispatch = (orderId, patientName) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, status: 'Delivered (Doctor Notified)' }
          : order
      )
    );
    setSelectedLabReport(null);
    showToast(`✓ Diagnostic report for ${patientName} signed and dispatched to EHR doctor console!`);
  };

  const filtered = orders.filter((order) => {
    const matchesPriority = filterPriority === 'All' || order.priority.includes(filterPriority);
    const matchesSearch =
      order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const statEmergencyCount = orders.filter((o) => o.priority.includes('STAT')).length;
  const readyCount = orders.filter((o) => o.status === 'Report Ready' || o.status.includes('Delivered')).length;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            backgroundColor: '#065f46',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(6,95,70,0.3)',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FlaskConical className="text-cyan" />
            Central Pathology & Diagnostic Laboratories
          </h1>
          <p className="page-subtitle">
            Automated barcoded sample intake, STAT emergency blood panels, and AI turnaround optimization.
          </p>
        </div>
        <div className="header-actions">
          <span className="badge badge-success">NABL Certified • 24/7 Lab</span>
        </div>
      </div>

      {/* Lab Stats */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Samples Processed Today</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <TestTube2 size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value">412</div>
          </div>
          <div className="stat-footer">
            <span>Peak turnaround: 32 mins</span>
            <span>Biochemistry & Hematology</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">STAT Emergency Panels</span>
            <div className="stat-icon-wrap bg-rose-glow">
              <AlertOctagon size={18} className="text-rose" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-rose">{statEmergencyCount} STAT</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              Trauma / ICU Priority
            </span>
            <span>Target &lt;20m TAT</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Reports Ready</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle2 size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-emerald">{readyCount}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-down">
              Synched with EHR portal
            </span>
            <span>Doctor notified</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">AI Workload Predictor</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <Activity size={18} className="text-purple" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-purple">Heavy Load</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              Model R²: 0.906 (RF Regressor)
            </span>
            <span>+412 tests next 48h</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="section-panel glass-panel">
        <div className="section-panel-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="section-panel-title">
            <TestTube2 className="text-cyan" size={20} />
            <span>Active Pathology Investigation Queue</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }}
              />
              <input
                type="text"
                placeholder="Search patient, test name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.82rem'
              }}
            >
              <option value="All">All Priorities</option>
              <option value="STAT">STAT Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patient</th>
                <th>Diagnostic Investigation</th>
                <th>Priority</th>
                <th>Received Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const isStat = order.priority.includes('STAT');
                const isUrgent = order.priority === 'Urgent';
                return (
                  <tr key={order.orderId}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-light)' }}>
                      {order.orderId}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedLabReport(order)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontWeight: 700,
                          color: 'var(--cyan-light)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title="Click to view full diagnostic report"
                      >
                        <span>{order.patient}</span>
                        <Eye size={13} style={{ opacity: 0.7 }} />
                      </button>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{order.test}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          isStat ? 'badge-danger pulse' : isUrgent ? 'badge-warning' : 'badge-cyan'
                        }`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {order.time}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.status.includes('Delivered')
                            ? 'badge-success'
                            : order.status === 'Report Ready'
                            ? 'badge-success'
                            : order.status === 'Processing'
                            ? 'badge-warning'
                            : 'badge-secondary'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedLabReport(order)}
                      >
                        <FileText size={13} /> View Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIAGNOSTIC REPORT INSPECTION & SIGN-OUT MODAL */}
      {selectedLabReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            className="section-panel glass-panel animate-scale-up"
            style={{
              backgroundColor: '#0f172a',
              maxWidth: 620,
              width: '100%',
              padding: 24,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 12,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 16
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FlaskConical size={20} className="text-cyan" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    Pathology Laboratory Report #{selectedLabReport.orderId}
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                  Patient: <strong style={{ color: '#ffffff' }}>{selectedLabReport.patient}</strong> • Investigation: {selectedLabReport.test}
                </div>
              </div>
              <button
                onClick={() => setSelectedLabReport(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Test Results Table */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                <span>Analyte / Parameter</span>
                <span>Observed Result</span>
                <span>Biological Reference</span>
                <span>Flag</span>
              </div>

              {selectedLabReport.test.includes('Cardiac') ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.84rem' }}>
                    <span>High Sensitivity Troponin-I</span>
                    <strong style={{ color: '#f43f5e' }}>1.42 ng/mL</strong>
                    <span style={{ color: '#94a3b8' }}>&lt; 0.04 ng/mL</span>
                    <span className="badge badge-danger">CRITICAL HIGH</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.84rem' }}>
                    <span>Creatine Kinase-MB (CK-MB)</span>
                    <strong style={{ color: '#f59e0b' }}>48 U/L</strong>
                    <span style={{ color: '#94a3b8' }}>5 – 25 U/L</span>
                    <span className="badge badge-warning">HIGH</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.84rem' }}>
                    <span>Serum Myoglobin</span>
                    <strong>96 ng/mL</strong>
                    <span style={{ color: '#94a3b8' }}>25 – 72 ng/mL</span>
                    <span className="badge badge-warning">HIGH</span>
                  </div>
                </>
              ) : selectedLabReport.test.includes('ABG') ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.84rem' }}>
                    <span>Arterial pH</span>
                    <strong style={{ color: '#f59e0b' }}>7.31</strong>
                    <span style={{ color: '#94a3b8' }}>7.35 – 7.45</span>
                    <span className="badge badge-warning">ACIDOSIS</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.84rem' }}>
                    <span>pCO2</span>
                    <strong>48 mmHg</strong>
                    <span style={{ color: '#94a3b8' }}>35 – 45 mmHg</span>
                    <span className="badge badge-warning">ELEVATED</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.84rem' }}>
                    <span>pO2</span>
                    <strong style={{ color: '#10b981' }}>92 mmHg</strong>
                    <span style={{ color: '#94a3b8' }}>80 – 100 mmHg</span>
                    <span className="badge badge-success">NORMAL</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.84rem' }}>
                    <span>Hemoglobin (Hb)</span>
                    <strong style={{ color: '#10b981' }}>12.8 g/dL</strong>
                    <span style={{ color: '#94a3b8' }}>12.0 – 15.5 g/dL</span>
                    <span className="badge badge-success">NORMAL</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.84rem' }}>
                    <span>Total Leucocyte Count (TLC)</span>
                    <strong>9,400 /cumm</strong>
                    <span style={{ color: '#94a3b8' }}>4,000 – 11,000</span>
                    <span className="badge badge-success">NORMAL</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.84rem' }}>
                    <span>Platelet Count</span>
                    <strong style={{ color: '#10b981' }}>2.1 Lakhs/cumm</strong>
                    <span style={{ color: '#94a3b8' }}>1.5 – 4.5 Lakhs</span>
                    <span className="badge badge-success">NORMAL</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#10b981' }}>
                <ShieldCheck size={16} />
                <span>NABL Approved • Quality Control Verified</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => alert(`Printing verified diagnostic report for ${selectedLabReport.patient}...`)}
                >
                  <Printer size={14} /> Print
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSignAndDispatch(selectedLabReport.orderId, selectedLabReport.patient)}
                >
                  <CheckCircle2 size={14} /> Sign & Dispatch to Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
