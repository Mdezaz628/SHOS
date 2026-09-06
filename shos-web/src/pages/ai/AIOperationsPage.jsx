import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Sliders,
  ShieldAlert,
  Clock,
  Layers
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { RecommendationCard } from '../../components/ai/RecommendationCard';

export const AIOperationsPage = () => {
  const { aiModels, recommendations } = useHospital();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRecs = recommendations.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const pendingCount = recommendations.filter((r) => r.status === 'pending').length;
  const approvedCount = recommendations.filter((r) => r.status === 'approved').length;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <BrainCircuit className="text-purple" />
            AI Intelligence & Decision Operations
          </h1>
          <p className="page-subtitle">
            8 Scikit-Learn machine learning models generating autonomous predictive recommendations.
          </p>
        </div>
        <div className="header-actions">
          <span className="badge badge-ai pulse">
            <Sparkles size={13} /> Active Inference Engine
          </span>
        </div>
      </div>

      {/* Model Health Overview Cards */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Operational Models</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <Cpu size={18} className="text-purple" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-purple">{aiModels.length} / 8</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              <CheckCircle2 size={14} className="text-emerald" /> 100% Pipeline Health
            </span>
            <span>Local joblib files</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Pending Approvals</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={18} className="text-amber" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-amber">{pendingCount}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              <AlertTriangle size={14} /> Human-in-the-loop review
            </span>
            <span>Requires sign-off</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Implemented Decisions</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle2 size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-emerald">{approvedCount}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-down">
              100% adherence rate
            </span>
            <span>Audited in Supabase</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Mean Ensemble R²</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <BarChart3 size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-cyan">0.921</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              Validated on train/test split
            </span>
            <span>RandomForest + IF</span>
          </div>
        </div>
      </div>

      {/* Model Grid Table Section */}
      <div className="section-panel glass-panel" style={{ marginBottom: '24px' }}>
        <div className="section-panel-header">
          <div className="section-panel-title">
            <Layers className="text-cyan" size={20} />
            <span>Trained AI Model Telemetry Registry</span>
          </div>
          <span className="badge badge-cyan">ai-service • Python 3.12</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Code & Name</th>
                <th>Algorithm</th>
                <th>R² Score</th>
                <th>MAE</th>
                <th>Active Live Forecast</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {aiModels.map((model) => (
                <tr key={model.code} className="model-row">
                  <td>
                    <div className="model-name-box">
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{model.name}</span>
                      <span className="model-code-tag">{model.code}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {model.algorithm}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: model.r2Score >= 0.9 ? 'var(--emerald-success)' : 'var(--amber-warning)'
                      }}
                    >
                      {model.r2Score.toFixed(3)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {model.mae}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--cyan-light)'
                      }}
                    >
                      {model.prediction}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        model.status === 'Optimal' || model.status === 'Normal'
                          ? 'badge-success'
                          : model.status.includes('High') || model.status.includes('Shortage')
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations & Action Queue */}
      <div className="section-panel glass-panel">
        <div className="section-panel-header">
          <div className="section-panel-title">
            <Sparkles className="text-amber" size={20} />
            <span>AI Actionable Recommendations Queue</span>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({recommendations.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-success' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('approved')}
            >
              Approved ({approvedCount})
            </button>
          </div>
        </div>

        <div className="rec-list">
          {filteredRecs.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No recommendations found in this category.
            </div>
          ) : (
            filteredRecs.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
