import React, { useState } from 'react';
import {
  Users,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  FileText,
  Filter,
  Eye,
  Stethoscope
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const DoctorPatientList = ({ onSelectPatient, onCallPatient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Doctor's OPD appointment patient queue & roster
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      uhid: 'UHID-10492',
      age: 45,
      gender: 'M',
      appointment: '09:20 AM',
      token: '#24',
      status: 'Consulting',
      bloodGroup: 'B+',
      diagnosis: 'Angina Pectoris / HTN',
      phone: '+91 98765 43210',
      admittedBed: 'Ward A — Bed 02',
      isEmergency: false
    },
    {
      id: 2,
      name: 'Pooja Verma',
      uhid: 'UHID-10844',
      age: 38,
      gender: 'F',
      appointment: '09:40 AM',
      token: '#25',
      status: 'Waiting',
      bloodGroup: 'A+',
      diagnosis: 'Palpitations & Mitral Valve Prolapse Check',
      phone: '+91 98112 23344',
      admittedBed: 'OPD Waiting Lounge',
      isEmergency: false
    },
    {
      id: 3,
      name: 'Vikramaditya Rao',
      uhid: 'UHID-10902',
      age: 64,
      gender: 'M',
      appointment: '10:00 AM',
      token: '#26',
      status: 'Emergency',
      bloodGroup: 'O+',
      diagnosis: 'Acute Coronary Syndrome (STEMI)',
      phone: '+91 97118 89900',
      admittedBed: 'ER Resuscitation Bay 01',
      isEmergency: true
    },
    {
      id: 4,
      name: 'Sunita Mehra',
      uhid: 'UHID-10210',
      age: 52,
      gender: 'F',
      appointment: '09:00 AM',
      token: '#23',
      status: 'Completed',
      bloodGroup: 'AB+',
      diagnosis: 'Post-Stent Follow-up (Stable)',
      phone: '+91 98990 12345',
      admittedBed: 'Discharged / Home',
      isEmergency: false
    },
    {
      id: 5,
      name: 'Harish Chandra',
      uhid: 'UHID-10955',
      age: 59,
      gender: 'M',
      appointment: '10:15 AM',
      token: '#27',
      status: 'Waiting',
      bloodGroup: 'B-',
      diagnosis: 'Dyspnea on Exertion (NYHA III)',
      phone: '+91 98223 34455',
      admittedBed: 'OPD Waiting Lounge',
      isEmergency: false
    }
  ]);

  const filteredPatients = patients.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.token.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Emergency':
        return <Badge variant="critical">🚨 Emergency</Badge>;
      case 'Consulting':
        return <Badge variant="primary">In Consultation</Badge>;
      case 'Waiting':
        return <Badge variant="warning">Waiting (#hall)</Badge>;
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header with Search and Filter */}
      <div
        className="shos-card"
        style={{
          padding: '18px 22px',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Cardiology OPD Patient Roster
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
            Cabin 104 • Today's scheduled tokens & walk-in consultations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="shos-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, token, UHID..."
              style={{ paddingLeft: 32, width: '100%', fontSize: '0.82rem' }}
            />
          </div>

          {/* Status Filter Chips */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['All', 'Waiting', 'Consulting', 'Emergency', 'Completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  fontSize: '0.74rem',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: statusFilter === st ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: statusFilter === st ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                  color: statusFilter === st ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: statusFilter === st ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Patient List Table matching User Specification:
          - Patient
          - Age
          - Appointment
          - Token
          - Status
      */}
      <div className="shos-card" style={{ padding: 0, backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Token</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Patient</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Age / Sex</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Appointment Time</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Clinical Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((pt) => {
                const isCurrent = pt.status === 'Consulting';
                return (
                  <tr
                    key={pt.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isCurrent ? 'rgba(30, 64, 175, 0.04)' : pt.isEmergency ? '#fff1f2' : '#ffffff',
                      transition: 'var(--transition)'
                    }}
                  >
                    {/* Token */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: pt.isEmergency ? 'var(--color-critical)' : 'var(--color-primary)'
                        }}
                      >
                        {pt.token}
                      </span>
                    </td>

                    {/* Patient */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            backgroundColor: pt.isEmergency ? 'var(--color-critical-subtle)' : 'var(--color-surface)',
                            color: pt.isEmergency ? 'var(--color-critical)' : 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                          }}
                        >
                          {pt.name.charAt(0)}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block' }}>
                            {pt.name}
                          </strong>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            {pt.uhid} • Blood: <strong style={{ color: 'var(--color-critical)' }}>{pt.bloodGroup}</strong>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Age / Sex */}
                    <td style={{ padding: '12px 16px', color: 'var(--color-text)' }}>
                      <strong>{pt.age} Yrs</strong> / {pt.gender}
                    </td>

                    {/* Appointment */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{pt.appointment}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px' }}>
                      {getStatusBadge(pt.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        {pt.status === 'Waiting' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              if (onCallPatient) onCallPatient(pt);
                              const updated = patients.map((p) =>
                                p.id === pt.id
                                  ? { ...p, status: 'Consulting' }
                                  : p.status === 'Consulting'
                                  ? { ...p, status: 'Completed' }
                                  : p
                              );
                              setPatients(updated);
                            }}
                          >
                            <PlayCircle size={14} style={{ marginRight: 4 }} />
                            Call In
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant={isCurrent ? 'primary' : 'outline'}
                          onClick={() => {
                            if (onSelectPatient) onSelectPatient(pt);
                          }}
                        >
                          <Eye size={14} style={{ marginRight: 4 }} />
                          Clinical EHR
                        </Button>
                      </div>
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
