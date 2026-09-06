import React, { useState } from 'react';
import {
  Users2,
  Stethoscope,
  HeartHandshake,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const StaffPage = () => {
  const { staffList, recommendations } = useHospital();
  const [staff, setStaff] = useState(staffList);
  const [filterDept, setFilterDept] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const staffRec = recommendations.find((r) => r.code.includes('STAFF'));

  const filtered = staff.filter((emp) => {
    const matchesDept = filterDept === 'All' || emp.department.includes(filterDept);
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Users2 className="text-cyan" />
            Clinical Staff Rosters & Duty Allocations
          </h1>
          <p className="page-subtitle">
            Shift scheduling, patient-to-nurse ratios, surgical theater assignments, and AI shortage optimization.
          </p>
        </div>
        <div className="header-actions">
          <span className="badge badge-cyan">
            Active: Shift B (Night 20:00 - 08:00)
          </span>
        </div>
      </div>

      {/* Staff Stats */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">On-Duty Medical Personnel</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <Users2 size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value">64</div>
          </div>
          <div className="stat-footer">
            <span>Shift B attendance: 98%</span>
            <span>Total roster: 210</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Attending Doctors</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <Stethoscope size={18} className="text-purple" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-purple">18 On-Duty</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              4 On-Call Consultants
            </span>
            <span>Cardio, Trauma, Neuro</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Nursing & Care Staff</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <HeartHandshake size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-emerald">36 Active</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-down">
              ICU Ratio 1:1 maintained
            </span>
            <span>Ward ratio 1:5</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">AI Staffing Optimizer</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={18} className="text-amber" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-amber">Surge Alert</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              +2 EMOs recommended
            </span>
            <span>Multi-Role RF Model</span>
          </div>
        </div>
      </div>

      {/* AI Staffing Recommendation Callout */}
      {staffRec && (
        <div
          className="section-panel glass-panel-glow"
          style={{
            marginBottom: '24px',
            borderLeft: '4px solid var(--rose-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="stat-icon-wrap bg-rose-glow" style={{ width: '42px', height: '42px' }}>
              <Sparkles className="text-rose" size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-danger">Critical Staffing Recommendation</span>
                <strong style={{ fontSize: '0.95rem' }}>{staffRec.title}</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                {staffRec.reasoning}
              </p>
            </div>
          </div>
          <div>
            <span className="badge badge-cyan">{staffRec.impact}</span>
          </div>
        </div>
      )}

      {/* Staff Roster Table */}
      <div className="section-panel glass-panel">
        <div className="section-panel-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="section-panel-title">
            <Briefcase className="text-cyan" size={20} />
            <span>Active Shift Staff Deployment</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }}
              />
              <input
                type="text"
                placeholder="Search staff, role, dept..."
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
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.82rem'
              }}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Trauma">Trauma & Ortho</option>
              <option value="Critical Care">Critical Care</option>
              <option value="Emergency">Emergency Room</option>
              <option value="Pathology">Pathology</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Designation / Role</th>
                <th>Department</th>
                <th>Assigned Shift</th>
                <th>Patient Load</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => {
                const isInSurgery = emp.status === 'In Surgery';
                const isER = emp.status.includes('ER');
                return (
                  <tr key={emp.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-light)' }}>
                      {emp.id}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{emp.name}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>{emp.role}</span>
                    </td>
                    <td>
                      <span className="badge badge-cyan">{emp.department}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.shift}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {emp.patientsAssigned} pts
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          isInSurgery ? 'badge-danger pulse' : isER ? 'badge-warning' : 'badge-success'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
