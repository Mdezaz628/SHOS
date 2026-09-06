import React, { useState } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  Activity,
  Users,
  BedDouble,
  Pill,
  FlaskConical,
  Clock,
  Gauge,
  Wind,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AIAnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('tomorrow'); // 'today' | 'tomorrow' | '7days' | '30days'

  // Dynamic values scaled by selected timeframe
  const getMultiplier = () => {
    switch (timeframe) {
      case 'today': return 0.92;
      case 'tomorrow': return 1.0;
      case '7days': return 6.8;
      case '30days': return 28.5;
      default: return 1.0;
    }
  };

  const mult = getMultiplier();

  const forecastCards = [
    {
      id: 1,
      title: 'Patient Load Predictor',
      algorithm: 'XGBoost Regressor',
      value: Math.round(144 * mult),
      unit: 'Admissions',
      trend: '+12.4%',
      confidence: '94.8%',
      details: 'Evaluates seasonal patterns, OPD footfall, and elective surgical schedules.',
      color: '#0284c7'
    },
    {
      id: 2,
      title: 'Emergency Influx Demand',
      algorithm: 'GradientBoosting',
      value: Math.round(38 * mult),
      unit: 'Trauma Cases',
      trend: '+8.1%',
      confidence: '91.2%',
      details: 'High probability of Level-1 STEMI and polytrauma during evening rush hours.',
      color: '#e11d48'
    },
    {
      id: 3,
      title: 'Bed Occupancy Forecaster',
      algorithm: 'LightGBM Multi-Ward',
      value: timeframe === 'tomorrow' ? '75.39%' : timeframe === 'today' ? '72.8%' : timeframe === '7days' ? '78.4%' : '76.1%',
      unit: 'Saturation',
      trend: '+3.2%',
      confidence: '95.4%',
      details: 'Ward A ICU running near capacity (91.4%); Ward B step-down capacity available.',
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Staff Workload Strain',
      algorithm: 'Neural Network MLP',
      value: timeframe === 'tomorrow' ? '8.7 / 10' : '7.9 / 10',
      unit: 'Strain Index',
      trend: '+15.0%',
      confidence: '92.6%',
      details: 'Severe staffing strain identified in ICU & Emergency due to nurse deficit.',
      color: '#dc2626'
    },
    {
      id: 5,
      title: 'Pharmacy Dispense Demand',
      algorithm: 'RandomForest Regressor',
      value: Math.round(275 * mult),
      unit: 'Prescriptions',
      trend: '+18.6%',
      confidence: '93.1%',
      details: 'Heavy concentration of IV cephalosporins, salbutamol nebules, and analgesics.',
      color: '#0d9488'
    },
    {
      id: 6,
      title: 'Diagnostic Lab Workload',
      algorithm: 'ExtraTrees Classifier',
      value: Math.round(466 * mult),
      unit: 'Assays',
      trend: '+9.4%',
      confidence: '96.0%',
      details: 'High volume of cardiac biomarkers (Troponin-I) and arterial blood gas samples.',
      color: '#8b5cf6'
    },
    {
      id: 7,
      title: 'No-Show Probability Model',
      algorithm: 'Logistic Regression (Calibrated)',
      value: '14.2%',
      unit: 'Estimated No-Show',
      trend: '-2.1%',
      confidence: '89.7%',
      details: 'Predicts outpatient appointment cancellations based on weather and transit data.',
      color: '#64748b'
    },
    {
      id: 8,
      title: 'Resource Demand (O2 & PPE)',
      algorithm: 'Prophet Time-Series',
      value: `${Math.round(3400 * mult).toLocaleString()} L`,
      unit: 'Medical Liquid O2',
      trend: '+4.5%',
      confidence: '97.2%',
      details: 'Adequate oxygen buffer available with central cryogenic tanks at 92% capacity.',
      color: '#059669'
    },
    {
      id: 9,
      title: 'Staff Workload Shift Heatmap',
      algorithm: 'Clustering K-Means',
      value: 'Evening (17-21h)',
      unit: 'Peak Shift',
      trend: 'High Rush',
      confidence: '94.0%',
      details: 'Highest concentration of doctor rounds, ER triage arrivals, and post-op handovers.',
      color: '#c2410c'
    },
    {
      id: 10,
      title: 'Anomaly & Surge Detection',
      algorithm: 'Isolation Forest',
      value: 'Level 2 Warning',
      unit: 'Viral Surge',
      trend: '+22.0%',
      confidence: '90.5%',
      details: 'Statistical anomaly detected matching early onset of seasonal viral respiratory infections.',
      color: '#ea580c'
    },
    {
      id: 11,
      title: '30-Day Readmission Risk',
      algorithm: 'CatBoost Acuity Engine',
      value: '4.8%',
      unit: 'Readmit Rate',
      trend: '-1.4%',
      confidence: '92.9%',
      details: 'Evaluates Congestive Heart Failure and COPD discharge cohort stability.',
      color: '#4f46e5'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Header Bar with Timeframe Switcher */}
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
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <BrainCircuit size={22} />
            </span>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', margin: 0 }}>
                AI Predictive Analytics Suite
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                11 Machine Learning Forecast Models continuously monitoring clinical capacity & demand
              </p>
            </div>
          </div>
        </div>

        {/* 4 Interactive Timeframes (Phase 30 User Specification) */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-subtle)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setTimeframe('today')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: timeframe === 'today' ? 'var(--color-surface)' : 'transparent',
              color: timeframe === 'today' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: timeframe === 'today' ? 'var(--shadow-xs)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('tomorrow')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: timeframe === 'tomorrow' ? 'var(--color-surface)' : 'transparent',
              color: timeframe === 'tomorrow' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: timeframe === 'tomorrow' ? 'var(--shadow-xs)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setTimeframe('7days')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: timeframe === '7days' ? 'var(--color-surface)' : 'transparent',
              color: timeframe === '7days' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: timeframe === '7days' ? 'var(--shadow-xs)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('30days')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: timeframe === '30days' ? 'var(--color-surface)' : 'transparent',
              color: timeframe === '30days' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: timeframe === '30days' ? 'var(--shadow-xs)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* 11 Forecast Cards Grid (Phase 30 Specification) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
        {forecastCards.map((card) => (
          <div
            key={card.id}
            className="shos-card"
            style={{
              padding: '20px 18px',
              borderTop: `4px solid ${card.color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
                  Model #{card.id}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-primary)',
                    fontWeight: 700
                  }}
                >
                  {card.algorithm}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)', margin: '10px 0 6px 0' }}>
                {card.title}
              </h3>

              <div style={{ margin: '12px 0 8px 0' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', lineHeight: 1.1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: card.color, fontWeight: 700, marginTop: 4 }}>
                  {card.unit}
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.45, margin: '8px 0' }}>
                {card.details}
              </p>
            </div>

            <div
              style={{
                marginTop: 14,
                paddingTop: 10,
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.74rem'
              }}
            >
              <span style={{ color: 'var(--color-text-dim)' }}>
                Confidence: <strong style={{ color: '#047857' }}>{card.confidence}</strong>
              </span>
              <span style={{ color: card.trend.startsWith('+') ? '#dc2626' : '#059669', fontWeight: 700 }}>
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
