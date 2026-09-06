import React, { useState } from 'react';
import {
  CalendarDays,
  UserCheck,
  Clock,
  AlertTriangle,
  PlayCircle,
  Search,
  CheckCircle2,
  Stethoscope,
  Filter
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const AppointmentsPage = () => {
  const { appointments } = useHospital();
  const [tokenList, setTokenList] = useState(appointments);
  const [filterDept, setFilterDept] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCallNext = () => {
    // Find first 'Waiting' token and make it 'Consulting'
    const waitingIdx = tokenList.findIndex((t) => t.status === 'Waiting');
    if (waitingIdx !== -1) {
      const updated = [...tokenList];
      // mark previous consulting as completed if needed
      updated.forEach((t) => {
        if (t.status === 'Consulting') t.status = 'Completed';
      });
      updated[waitingIdx].status = 'Consulting';
      setTokenList(updated);
    }
  };

  const filtered = tokenList.filter((item) => {
    const matchesDept = filterDept === 'All' || item.dept === filterDept;
    const matchesSearch =
      item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const consultingCount = tokenList.filter((t) => t.status === 'Consulting').length;
  const waitingCount = tokenList.filter((t) => t.status === 'Waiting').length;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <CalendarDays className="text-cyan" />
            Outpatient (OPD) & Token Queue
          </h1>
          <p className="page-subtitle">
            Smart automated token dispensary, live consulting room allocation, and AI no-show risk prediction.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCallNext}>
            <PlayCircle size={16} /> Call Next In Line
          </button>
        </div>
      </div>

      {/* OPD Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Issued Tokens Today</span>
            <div className="stat-icon-wrap bg-cyan-glow">
              <CalendarDays size={18} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value">{tokenList.length * 22}</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              Peak hours: 09:30 - 12:30
            </span>
            <span>OPD Registry</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Currently Consulting</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <Stethoscope size={18} className="text-emerald" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-emerald">{consultingCount} In Cabin</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-down">
              Avg session: 14 mins
            </span>
            <span>6 Active Cabins</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">Waiting in Lounge</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={18} className="text-amber" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-amber">{waitingCount} Patients</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-up">
              Estimated wait: 22 mins
            </span>
            <span>Central OPD Lounge</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-title">AI No-Show Classifier</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <AlertTriangle size={18} className="text-purple" />
            </div>
          </div>
          <div className="stat-value-box">
            <div className="stat-value text-purple">14.2%</div>
          </div>
          <div className="stat-footer">
            <span className="stat-trend trend-neutral">
              SMS Reminders auto-sent
            </span>
            <span>Model R²: 0.884</span>
          </div>
        </div>
      </div>

      {/* Main Token Queue Section */}
      <div className="section-panel glass-panel">
        <div className="section-panel-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="section-panel-title">
            <Clock className="text-cyan" size={20} />
            <span>Real-time OPD Token Queue</span>
          </div>

          {/* Filters & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }}
              />
              <input
                type="text"
                placeholder="Search patient, token, doctor..."
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
              <option value="Orthopaedics">Orthopaedics</option>
              <option value="Neurology">Neurology</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Patient Name</th>
                <th>Department</th>
                <th>Attending Doctor</th>
                <th>Slot Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.token}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-light)' }}>
                    {appt.token}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{appt.patient}</span>
                  </td>
                  <td>
                    <span className="badge badge-cyan">{appt.dept}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{appt.doctor}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {appt.slot}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        appt.status === 'Consulting'
                          ? 'badge-success pulse'
                          : appt.status === 'Waiting'
                          ? 'badge-warning'
                          : appt.status === 'Completed'
                          ? 'badge-cyan'
                          : 'badge-secondary'
                      }`}
                    >
                      {appt.status}
                    </span>
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
