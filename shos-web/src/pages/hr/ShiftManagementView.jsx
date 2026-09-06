import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Users,
  Check,
  Minus,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ShiftManagementView = () => {
  // Exact 3 Shifts requested by user:
  // Morning: 08:00 - 16:00
  // Evening: 16:00 - 00:00
  // Night: 00:00 - 08:00
  const shifts = [
    {
      id: 'morning',
      name: 'Morning Shift',
      time: '08:00 - 16:00',
      tag: 'Peak OPD & OTs',
      staffCount: 68,
      status: 'In Progress (Active)',
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-subtle)'
    },
    {
      id: 'evening',
      name: 'Evening Shift',
      time: '16:00 - 00:00',
      tag: 'Ward Handover & ER',
      staffCount: 38,
      status: 'Upcoming (16:00)',
      color: 'var(--color-secondary)',
      bg: 'var(--color-secondary-subtle)'
    },
    {
      id: 'night',
      name: 'Night Shift',
      time: '00:00 - 08:00',
      tag: 'Critical Care & Resuscitation',
      staffCount: 22,
      status: 'Standby',
      color: '#475569',
      bg: '#f1f5f9'
    }
  ];

  // Calendar Weekly Matrix matching user's exact specification:
  //         Mon Tue Wed Thu Fri
  // Doctor   ✓   ✓   -   ✓   ✓
  // Nurse    ✓   ✓   ✓   ✓   -
  // Support  ✓   -   ✓   ✓   ✓
  const [rosterMatrix, setRosterMatrix] = useState([
    { role: 'Doctor', mon: true, tue: true, wed: false, thu: true, fri: true, required: 15, current: 10, shortage: 5 },
    { role: 'Nurse', mon: true, tue: true, wed: true, thu: true, fri: false, required: 47, current: 25, shortage: 22 },
    { role: 'Ward Boy', mon: true, tue: false, wed: true, thu: true, fri: true, required: 12, current: 12, shortage: 0 },
    { role: 'Lab', mon: true, tue: true, wed: true, thu: false, fri: true, required: 10, current: 9, shortage: 1 },
    { role: 'Pharmacy', mon: true, tue: true, wed: true, thu: true, fri: true, required: 8, current: 8, shortage: 0 },
    { role: 'Support', mon: true, tue: false, wed: true, thu: true, fri: true, required: 18, current: 18, shortage: 0 }
  ]);

  const toggleRosterCell = (roleIdx, dayKey) => {
    const updated = [...rosterMatrix];
    updated[roleIdx][dayKey] = !updated[roleIdx][dayKey];
    setRosterMatrix(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 3 Shifts Header Cards (Phase 25 Specification) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {shifts.map((s) => (
          <div
            key={s.id}
            className="shos-card hover-lift"
            style={{
              padding: '20px 22px',
              backgroundColor: 'var(--color-surface)',
              borderTop: `4px solid ${s.color}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                {s.name}
              </span>
              <Badge variant={s.id === 'morning' ? 'primary' : s.id === 'evening' ? 'teal' : 'secondary'}>
                {s.status}
              </Badge>
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, fontFamily: 'var(--font-mono)' }}>
              {s.time}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              <span>{s.tag}</span>
              <strong>{s.staffCount} Staff Allocated</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Shift Calendar Roster (Phase 25 Specification) */}
      <div className="shos-card" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Weekly Shift Coverage Calendar (Phase 25 Specification)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Click any cell to toggle scheduled coverage (✓ on duty, - day off)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
              Legend:
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} /> Scheduled On-Duty
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
              <Minus size={14} /> Off / Uncovered
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: 'var(--color-text)' }}>Staff Cadre</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Mon</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Tue</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Wed</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Thu</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Fri</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Required</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Available</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Shortage</th>
              </tr>
            </thead>
            <tbody>
              {rosterMatrix.map((row, idx) => (
                <tr key={row.role} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                  {/* Cadre Name */}
                  <td style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: 'var(--color-text)' }}>
                    {row.role}
                  </td>

                  {/* Mon */}
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      type="button"
                      onClick={() => toggleRosterCell(idx, 'mon')}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: row.mon ? '#dcfce7' : '#f1f5f9',
                        color: row.mon ? '#15803d' : '#94a3b8',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {row.mon ? '✓' : '-'}
                    </button>
                  </td>

                  {/* Tue */}
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      type="button"
                      onClick={() => toggleRosterCell(idx, 'tue')}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: row.tue ? '#dcfce7' : '#f1f5f9',
                        color: row.tue ? '#15803d' : '#94a3b8',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {row.tue ? '✓' : '-'}
                    </button>
                  </td>

                  {/* Wed */}
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      type="button"
                      onClick={() => toggleRosterCell(idx, 'wed')}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: row.wed ? '#dcfce7' : '#f1f5f9',
                        color: row.wed ? '#15803d' : '#94a3b8',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {row.wed ? '✓' : '-'}
                    </button>
                  </td>

                  {/* Thu */}
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      type="button"
                      onClick={() => toggleRosterCell(idx, 'thu')}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: row.thu ? '#dcfce7' : '#f1f5f9',
                        color: row.thu ? '#15803d' : '#94a3b8',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {row.thu ? '✓' : '-'}
                    </button>
                  </td>

                  {/* Fri */}
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      type="button"
                      onClick={() => toggleRosterCell(idx, 'fri')}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: row.fri ? '#dcfce7' : '#f1f5f9',
                        color: row.fri ? '#15803d' : '#94a3b8',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {row.fri ? '✓' : '-'}
                    </button>
                  </td>

                  {/* Required */}
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {row.required}
                  </td>

                  {/* Available */}
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {row.current}
                  </td>

                  {/* Shortage */}
                  <td style={{ padding: '10px 14px' }}>
                    {row.shortage > 0 ? (
                      <span style={{ color: 'var(--color-critical)', fontWeight: 800 }}>
                        {row.shortage} 🔴
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-success)', fontWeight: 800 }}>
                        0 🟢
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
