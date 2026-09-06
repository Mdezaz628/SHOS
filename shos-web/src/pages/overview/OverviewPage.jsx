import React from 'react';
import {
  Users,
  BedDouble,
  Ambulance,
  BrainCircuit,
  AlertCircle,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { RecommendationCard } from '../../components/ai/RecommendationCard';
import { MOCK_AMBULANCES } from '../../services/mockData';

export const OverviewPage = () => {
  const { metrics, recommendations, emergencyCases, wards, aiModels } = useHospital();

  const pendingRecs = recommendations.filter((r) => r.status === 'pending');

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Activity className="text-cyan" />
            Hospital Command Center
          </h1>
          <p className="page-subtitle">
            Live AI-assisted telemetry, multi-ward occupancy, and emergency response.
          </p>
        </div>
        <div className="header-actions">
          <span className="badge badge-success pulse">
            <span className="status-dot"></span> System Live & Operational
          </span>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Active Inpatients</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <Users size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value">{metrics.activePatients}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              <ArrowUpRight size={14} /> +12 admitted today
            </span>
            <span>Total capacity: 250</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Bed Occupancy Rate</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <BedDouble size={18} className="text-amber" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-amber">{metrics.bedOccupancyRate}%</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              <AlertCircle size={14} /> High occupancy alert
            </span>
            <span>{metrics.availableBeds} beds free</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Emergency Cases (ER)</span>
            <div className="stat-icon-wrap bg-rose-glow">
              <Ambulance size={18} className="text-rose" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-rose">{emergencyCases.length} Active</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              <HeartPulse size={14} /> 2 critical trauma
            </span>
            <span>Avg wait: 8 mins</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">AI Forecast Tomorrow</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <BrainCircuit size={18} className="text-purple" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-purple">{metrics.aiForecastedLoadTomorrow}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              <TrendingUp size={14} /> 94.2% model confidence
            </span>
            <span>Patient admissions</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="content-two-columns">
        {/* Left Column: AI Recommendations & Active ER Patients */}
        <div className="left-panel">
          {/* AI Recommendations Section */}
          <div className="section-panel glass-panel">
            <div className="section-panel-header">
              <div className="section-panel-title">
                <BrainCircuit className="text-cyan" size={20} />
                <span>AI Operational Recommendations</span>
                {pendingRecs.length > 0 && (
                  <span className="badge badge-warning">{pendingRecs.length} Action Required</span>
                )}
              </div>
            </div>

            <div className="rec-list">
              {recommendations.slice(0, 2).map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>

          {/* Active ER Trauma Section */}
          <div className="section-panel glass-panel">
            <div className="section-panel-header">
              <div className="section-panel-title">
                <Ambulance className="text-rose" size={20} />
                <span>Active ER Trauma Triage Queue</span>
              </div>
              <span className="badge badge-danger">Level 1 & 2 Prioritized</span>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Patient</th>
                    <th>Triage Level</th>
                    <th>Presenting Complaint</th>
                    <th>Bay / Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencyCases.slice(0, 3).map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-light)' }}>
                        {c.id}
                      </td>
                      <td>
                        <strong>{c.patientName}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {c.age}y / {c.gender} • Arr: {c.arrivalTime}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${c.triageColor}`}>
                          {c.triageLevel.split(' - ')[0]}
                        </span>
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        <span style={{ fontSize: '0.8rem' }}>{c.complaint}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{c.bay}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {c.assignedDoctor.split(' (')[0]}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Ward Occupancy, AI Telemetry, Ambulances */}
        <div className="right-panel">
          {/* Ward Occupancy Progress */}
          <div className="section-panel glass-panel">
            <div className="section-panel-header">
              <div className="section-panel-title">
                <BedDouble className="text-amber" size={18} />
                <span>Ward Capacity</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wards.map((ward) => {
                const percent = Math.round((ward.occupied / ward.total) * 100);
                const isHigh = percent >= 90;
                return (
                  <div key={ward.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 600 }}>{ward.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: isHigh ? 'var(--rose-danger)' : 'var(--text-muted)' }}>
                        {ward.occupied}/{ward.total} ({percent}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '7px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: isHigh
                            ? 'var(--rose-danger)'
                            : percent > 80
                            ? 'var(--amber-warning)'
                            : 'var(--cyan-primary)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ambulances Live */}
          <div className="section-panel glass-panel">
            <div className="section-panel-header">
              <div className="section-panel-title">
                <Ambulance className="text-cyan" size={18} />
                <span>Fleet & Ambulances</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MOCK_AMBULANCES.map((amb) => (
                <div
                  key={amb.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--cyan-light)' }}>
                        {amb.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {amb.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Loc: {amb.location}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      amb.status.includes('Route')
                        ? 'badge-danger'
                        : amb.status.includes('Returning')
                        ? 'badge-warning'
                        : 'badge-success'
                    }`}
                  >
                    {amb.status.split(' (')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Models Overview Banner */}
          <div className="section-panel glass-panel-glow">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <BrainCircuit className="text-purple" size={20} />
              <strong style={{ fontSize: '0.95rem' }}>SHOS Predictive Intelligence</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
              All 8 machine learning models are continuously evaluating real-time Supabase telemetry to generate high-accuracy operational forecasts.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-ai">8 Models Active</span>
              <span className="badge badge-success">Avg R²: 0.92</span>
              <span className="badge badge-cyan">Latency: 42ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
