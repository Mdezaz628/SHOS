import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  color = 'cyan',
  actionLabel,
  onAction
}) => {
  const colorMap = {
    cyan: 'var(--cyan-primary)',
    emerald: 'var(--emerald-success)',
    amber: 'var(--amber-warning)',
    rose: 'var(--rose-danger)',
    indigo: 'var(--indigo-ai)'
  };

  const activeColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="stat-card glass-panel">
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <div
          className="stat-icon-wrap"
          style={{
            background: `rgba(255,255,255,0.04)`,
            color: activeColor,
            borderColor: `rgba(255,255,255,0.08)`
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-value-box">
        <span className="stat-value">{value}</span>
      </div>

      <div className="stat-footer">
        {trend && (
          <div className={`stat-trend trend-${trendType}`}>
            {trendType === 'up' && <TrendingUp size={14} />}
            {trendType === 'down' && <TrendingDown size={14} />}
            {trendType === 'neutral' && <Minus size={14} />}
            <span>{trend}</span>
          </div>
        )}
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        {actionLabel && (
          <button className="stat-action-link" onClick={onAction}>
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
};
