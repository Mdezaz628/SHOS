import React from 'react';
import { FlaskConical, FileText, Download, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

export const LabReportCard = ({
  report,
  onDownload,
  className = ''
}) => {
  return (
    <div
      className={`shos-card ${className}`}
      style={{
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FlaskConical size={20} />
        </div>
        <div>
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block' }}>
            {report.test || report.name}
          </strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
            Order ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{report.orderId || report.id}</span> • {report.patient}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <StatusBadge status={report.status} />
        {report.status === 'Report Ready' && (
          <Button variant="outline" size="sm" onClick={() => onDownload?.(report)} icon={Download}>
            PDF
          </Button>
        )}
      </div>
    </div>
  );
};
