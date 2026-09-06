import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  AlertTriangle,
  Clock,
  Activity,
  Briefcase,
  Search,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ShiftManagementView } from './ShiftManagementView';

export const HRStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'shifts'
  const [searchQuery, setSearchQuery] = useState('');

  // Exact 7 HR metrics specified by user:
  // - Total Staff
  // - Present
  // - Absent
  // - On Leave
  // - Shift Coverage
  // - Staff Shortage
  // - Workload
  const metrics = [
    { title: 'Total Staff', val: 142, sub: 'All registered payroll cadres', color: 'var(--color-primary)', bg: 'var(--color-primary-subtle)', icon: Users },
    { title: 'Present', val: 118, sub: 'Biometric shift clocked in', color: 'var(--color-success)', bg: '#dcfce7', icon: UserCheck },
    { title: 'Absent', val: 6, sub: 'Unscheduled absence flagged', color: 'var(--color-critical)', bg: '#fee2e2', icon: UserX },
    { title: 'On Leave', val: 18, sub: 'Approved annual/casual leave', color: 'var(--color-warning)', bg: '#fef3c7', icon: Calendar },
    { title: 'Shift Coverage', val: '88.2%', sub: 'Active clinical requirement', color: 'var(--color-secondary)', bg: 'var(--color-secondary-subtle)', icon: Clock },
    { title: 'Staff Shortage', val: '27 🔴', sub: '5 Doctors • 22 Nurses', color: 'var(--color-critical)', bg: '#fee2e2', icon: AlertTriangle },
    { title: 'Workload', val: '82%', sub: 'High inpatient load index', color: 'var(--color-warning)', bg: '#fef3c7', icon: Activity }
  ];

  // Staff Breakdown Table (Exact User Specification):
  // - Doctor
  // - Nurse
  // - Ward Boy
  // - Lab
  // - Pharmacy
  // - Support
  const [staffBreakdown, setStaffBreakdown] = useState([
    {
      category: 'Doctor',
      total: 35,
      present: 28,
      onLeave: 5,
      absent: 2,
      shortage: '5 🔴',
      lead: 'Dr. Vivek Mehra (Chief of Clinical Staff)',
      workloadIndex: '88%'
    },
    {
      category: 'Nurse',
      total: 58,
      present: 44,
      onLeave: 11,
      absent: 3,
      shortage: '22 🔴',
      lead: 'Sister Mary Joseph (Nursing Superintendent)',
      workloadIndex: '94% (Severe)'
    },
    {
      category: 'Ward Boy',
      total: 16,
      present: 15,
      onLeave: 1,
      absent: 0,
      shortage: '0 🟢',
      lead: 'Manoj Kumar (Support Supervisor)',
      workloadIndex: '70%'
    },
    {
      category: 'Lab',
      total: 12,
      present: 11,
      onLeave: 1,
      absent: 0,
      shortage: '1 🟡',
      lead: 'Dr. Arvind Swaminathan (Pathology Lead)',
      workloadIndex: '78%'
    },
    {
      category: 'Pharmacy',
      total: 9,
      present: 9,
      onLeave: 0,
      absent: 0,
      shortage: '0 🟢',
      lead: 'Suresh Raina (Chief Pharmacist)',
      workloadIndex: '75%'
    },
    {
      category: 'Support',
      total: 12,
      present: 11,
      onLeave: 0,
      absent: 1,
      shortage: '0 🟢',
      lead: 'Sunil Sharma (Facility Care Lead)',
      workloadIndex: '65%'
    }
  ]);

  const filteredStaff = staffBreakdown.filter((s) =>
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.lead.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div
        className="shos-card"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #312e81 100%)',
          color: '#ffffff',
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Briefcase size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Hospital Human Resources & Staff Management
              </h2>
              <Badge variant="teal">Biometric Shift Active</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '4px 0 0' }}>
              Phase 24 & 25 Operations • Workforce Attendance, Shift Rosters & Clinical Shortage Triage
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setActiveTab(activeTab === 'shifts' ? 'overview' : 'shifts')}
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-primary)',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Clock size={16} style={{ marginRight: 6 }} />
            {activeTab === 'shifts' ? 'View Staff Overview' : 'Shift Management & Calendar'}
          </Button>
        </div>
      </div>

      {/* Exactly 7 HR Metrics specified by user:
          - Total Staff
          - Present
          - Absent
          - On Leave
          - Shift Coverage
          - Staff Shortage
          - Workload
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14
        }}
      >
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="shos-card hover-lift"
              style={{
                padding: '18px 16px',
                backgroundColor: 'var(--color-surface)',
                borderLeft: `4px solid ${m.color}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.title}
                </span>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--color-text)', margin: '4px 0 2px', fontFamily: 'var(--font-mono)' }}>
                  {m.val}
                </div>
                <span style={{ fontSize: '0.72rem', color: m.color, fontWeight: 600 }}>
                  {m.sub}
                </span>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: m.bg,
                  color: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW 1: Shift Management Calendar (Phase 25) */}
      {activeTab === 'shifts' && (
        <div className="animate-fade-in">
          <ShiftManagementView />
        </div>
      )}

      {/* VIEW 2: Staff Cadres Table (Phase 24)
          Staff:
          - Doctor
          - Nurse
          - Ward Boy
          - Lab
          - Pharmacy
          - Support
      */}
      {activeTab === 'overview' && (
        <div className="shos-card" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Hospital Staff Cadre Attendance & Deployment (Phase 24 Specification)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                Real-time workforce deployment across all clinical and auxiliary departments
              </p>
            </div>

            <div style={{ position: 'relative', width: 240 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                className="shos-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cadre, supervisor..."
                style={{ paddingLeft: 30, width: '100%', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-text)' }}>Cadre Role</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Lead / Supervisor</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>Total Staff</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>Present</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>On Leave</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>Absent</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>Shortage</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>Workload</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((row) => (
                  <tr key={row.category} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-text)' }}>
                      {row.category}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--color-text-muted)' }}>
                      {row.lead}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {row.total}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-success)' }}>
                      {row.present}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>
                      {row.onLeave}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-critical)' }}>
                      {row.absent}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800 }}>
                      {row.shortage}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <Badge variant={row.workloadIndex.includes('Severe') ? 'critical' : 'teal'}>
                        {row.workloadIndex}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
