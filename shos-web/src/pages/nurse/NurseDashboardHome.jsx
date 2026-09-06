import React, { useState } from 'react';
import {
  Users,
  CheckSquare,
  Pill,
  Activity,
  AlertTriangle,
  Clock,
  HeartPulse,
  BedDouble,
  PlayCircle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Eye,
  ClipboardList,
  X,
  Syringe,
  FileText,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const NurseDashboardHome = ({ onNavigate, onOpenVitalsModal }) => {
  // Exact 5 metrics specified by user:
  // - Assigned Patients
  // - Pending Tasks
  // - Medication Tasks
  // - Vitals Due
  // - Emergency Alerts
  const [metrics, setMetrics] = useState([
    {
      title: 'Assigned Patients',
      value: '05',
      subtitle: 'Ward A & ICU Bay 01',
      icon: Users,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-subtle)'
    },
    {
      title: 'Pending Tasks',
      value: '07',
      subtitle: '3 High priority nursing tasks',
      icon: CheckSquare,
      color: 'var(--color-secondary)',
      bg: 'var(--color-secondary-subtle)'
    },
    {
      title: 'Medication Tasks',
      value: '03',
      subtitle: '2 Due now in Shift B',
      icon: Pill,
      color: 'var(--color-warning)',
      bg: '#fef3c7'
    },
    {
      title: 'Vitals Due',
      value: '02',
      subtitle: 'Bed 02 & Bed 04 routine round',
      icon: Activity,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-subtle)'
    },
    {
      title: 'Emergency Alerts',
      value: '01',
      subtitle: 'Code Yellow • ICU Bay 01',
      icon: AlertTriangle,
      color: 'var(--color-critical)',
      bg: '#fee2e2'
    }
  ]);

  // Interactive Today's Clinical Nursing Workload Queue
  const [workloadFilter, setWorkloadFilter] = useState('All');
  const [selectedPatientChart, setSelectedPatientChart] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const [nursingWorkload, setNursingWorkload] = useState([
    {
      id: 'NW-101',
      patientName: 'Rahul Sharma',
      bed: 'Ward A - Bed 02',
      uhid: 'UHID-10492',
      ageGender: '46M',
      careOrder: 'Metoprolol Succinate 50mg PO (Post-meal)',
      category: 'Medication',
      dueTime: '02:00 PM',
      status: 'Due Now',
      priority: 'High',
      doctor: 'Dr. Vivek Mehra',
      allergy: 'NKDA (No Known Drug Allergies)',
      ivCannula: '20G Left Forearm (Patent, Day 2)',
      diet: 'Diabetic, Salt Restricted',
      lastVitals: 'BP 130/85, HR 78, SpO2 98%'
    },
    {
      id: 'NW-102',
      patientName: 'Anita Deshmukh',
      bed: 'Ward A - Bed 04',
      uhid: 'UHID-10512',
      ageGender: '52F',
      careOrder: 'Cefuroxime 500mg IV Infusion (100ml NS over 30m)',
      category: 'Medication',
      dueTime: '01:00 PM',
      status: 'Pending',
      priority: 'Normal',
      doctor: 'Dr. Sunita Rao',
      allergy: 'Penicillin (Severe Rash)',
      ivCannula: '18G Right Antecubital (Patent, Day 1)',
      diet: 'Soft Cardiac Diet',
      lastVitals: 'BP 124/78, HR 72, SpO2 97%'
    },
    {
      id: 'NW-103',
      patientName: 'Kamala Devi',
      bed: 'Ward A - Bed 01',
      uhid: 'UHID-10488',
      ageGender: '68F',
      careOrder: 'Hourly SpO2 & BP Monitoring + Budecort 0.5mg Respules Neb',
      category: 'Vitals',
      dueTime: '02:30 PM',
      status: 'Due Now',
      priority: 'Urgent',
      doctor: 'Dr. Radhika Roy',
      allergy: 'Sulfa Drugs',
      ivCannula: '22G Right Dorsal (Needs re-flush)',
      diet: 'Normal Diabetic Diet',
      lastVitals: 'BP 118/75, HR 88, SpO2 95% on 2L O2'
    },
    {
      id: 'NW-104',
      patientName: 'Anand Rathi',
      bed: 'ICU Bay 01',
      uhid: 'UHID-10118',
      ageGender: '62M',
      careOrder: 'Central Line Dressing Change + Arterial Line Flush & Calibration',
      category: 'Procedure',
      dueTime: '03:00 PM',
      status: 'Scheduled',
      priority: 'Critical',
      doctor: 'Dr. Vikram Malhotra',
      allergy: 'Latex Sensitivity',
      ivCannula: 'Triple Lumen CVC (Right Internal Jugular)',
      diet: 'NPO (Nil Per Os) • TPN Infusion Active',
      lastVitals: 'BP 105/65, HR 92, SpO2 96%'
    },
    {
      id: 'NW-105',
      patientName: 'Vikramaditya Rao',
      bed: 'Ward A - Bed 03',
      uhid: 'UHID-10902',
      ageGender: '34M',
      careOrder: 'IV Tramadol 50mg + Ondansetron 4mg for Trauma Pain',
      category: 'Medication',
      dueTime: '02:15 PM',
      status: 'Due Now',
      priority: 'High',
      doctor: 'Dr. Sunita Rao',
      allergy: 'NKDA',
      ivCannula: '18G Left Forearm (Patent, Day 1)',
      diet: 'Clear Fluids Only',
      lastVitals: 'BP 128/82, HR 84, SpO2 99%'
    }
  ]);

  const showToast = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4500);
  };

  // 1-Click Dose Administration
  const handleAdministerDose = (taskId, patientName, orderName) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNursingWorkload((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? { ...item, status: `Given at ${timeNow}`, administeredTime: timeNow }
          : item
      )
    );
    showToast(`✓ Administered "${orderName}" to ${patientName} at ${timeNow}! Logged to EHR.`);
  };

  // 1-Click Task Complete
  const handleCompleteTask = (taskId, patientName, orderName) => {
    setNursingWorkload((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? { ...item, status: 'Completed', administeredTime: 'Just now' }
          : item
      )
    );
    showToast(`✓ Marked task "${orderName}" for ${patientName} as Completed.`);
  };

  const filteredWorkload = nursingWorkload.filter((item) => {
    if (workloadFilter === 'All') return true;
    if (workloadFilter === 'Due Now') return item.status === 'Due Now';
    if (workloadFilter === 'Medication') return item.category === 'Medication';
    if (workloadFilter === 'Vitals') return item.category === 'Vitals';
    if (workloadFilter === 'Critical') return item.priority === 'Critical' || item.priority === 'Urgent';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div
          className="animate-scale-up"
          style={{
            backgroundColor: '#065f46',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 24px rgba(6,95,70,0.3)',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Shift Header Banner */}
      <div
        className="shos-card"
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
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
            <HeartPulse size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Sister Mary Joseph, RN, BSN
              </h2>
              <Badge variant="teal">Shift B Lead In-Charge</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '4px 0 0' }}>
              Ward A & Cardiac Step-Down Unit • Shift Time: 07:00 AM – 03:00 PM
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenVitalsModal}
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-secondary)',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Activity size={18} style={{ marginRight: 6 }} />
            Record Patient Vitals
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('ward_view')}
            style={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: '#ffffff',
              fontWeight: 700
            }}
          >
            View Ward Patients
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </Button>
        </div>
      </div>

      {/* Exactly 5 Nurse Dashboard Metric Cards (Phase 15 Specification) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16
        }}
      >
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="shos-card hover-lift"
              style={{
                padding: '20px 18px',
                backgroundColor: 'var(--color-surface)',
                borderLeft: `4px solid ${m.color}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.title}
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '6px 0 2px' }}>
                  {m.value}
                </div>
                <span style={{ fontSize: '0.76rem', color: m.color, fontWeight: 600 }}>
                  {m.subtitle}
                </span>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: m.bg,
                  color: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* TODAY'S CLINICAL NURSING WORKLOAD QUEUE WITH REAL PATIENT NAMES & CLICK ACTIONS */}
      <div
        className="shos-card"
        style={{
          padding: 24,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ClipboardList size={22} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Today's Clinical Nursing Workload (Patient Care & Med Orders)
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Touch / click patient name or 1-click action buttons to administer medication, record vitals, or inspect nursing charts.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Filter:</span>
            {['All', 'Due Now', 'Medication', 'Vitals', 'Critical'].map((tab) => (
              <button
                key={tab}
                onClick={() => setWorkloadFilter(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: workloadFilter === tab ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: workloadFilter === tab ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                  color: workloadFilter === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Bed & Patient</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Order / Clinical Task</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Type</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Due Window</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Nursing Care Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkload.map((row) => {
                const isGiven = row.status.startsWith('Given') || row.status === 'Completed';
                const isDue = row.status === 'Due Now';
                return (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isDue ? 'rgba(245, 158, 11, 0.04)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setSelectedPatientChart(row)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'block'
                        }}
                      >
                        <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{row.patientName}</span>
                          <Eye size={14} style={{ opacity: 0.6 }} />
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {row.bed} • {row.uhid} ({row.ageGender})
                        </div>
                      </button>
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{row.careOrder}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                        Ordered by: {row.doctor}
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <Badge variant={row.category === 'Medication' ? 'secondary' : row.category === 'Vitals' ? 'primary' : 'teal'}>
                        {row.category}
                      </Badge>
                    </td>

                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {row.dueTime}
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <Badge variant={isGiven ? 'success' : isDue ? 'warning' : 'outline'}>
                        {row.status}
                      </Badge>
                    </td>

                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                        {row.category === 'Medication' ? (
                          <Button
                            size="xs"
                            variant={isGiven ? 'outline' : 'primary'}
                            disabled={isGiven}
                            icon={Syringe}
                            onClick={() => handleAdministerDose(row.id, row.patientName, row.careOrder)}
                          >
                            {isGiven ? 'Dose Given ✓' : 'Administer Dose'}
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="primary"
                            icon={Activity}
                            onClick={() => onOpenVitalsModal(row)}
                          >
                            Log Vitals
                          </Button>
                        )}

                        <Button
                          size="xs"
                          variant="outline"
                          icon={CheckCircle2}
                          onClick={() => handleCompleteTask(row.id, row.patientName, row.careOrder)}
                        >
                          Complete
                        </Button>

                        <button
                          onClick={() => setSelectedPatientChart(row)}
                          title="View Patient Care Chart"
                          style={{
                            padding: '6px 10px',
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.74rem'
                          }}
                        >
                          <FileText size={13} />
                          Chart
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immediate Attention & Ward Census Spotlight */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Urgent Vitals Due Spotlight */}
        <div className="shos-card" style={{ padding: 22, backgroundColor: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} style={{ color: 'var(--color-warning)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Hourly Vitals Round Due
              </h3>
            </div>
            <Badge variant="warning">Round 2 Due</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <strong
                  onClick={() => setSelectedPatientChart(nursingWorkload[0])}
                  style={{ fontSize: '0.88rem', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Rahul Sharma • Ward A Bed 02
                </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  Post-Angina • Last: BP 130/85, SpO2 98%
                </div>
              </div>
              <Button size="sm" variant="primary" onClick={() => onOpenVitalsModal(nursingWorkload[0])}>
                Log Vitals
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <strong
                  onClick={() => setSelectedPatientChart(nursingWorkload[1])}
                  style={{ fontSize: '0.88rem', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Anita Deshmukh • Ward A Bed 04
                </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  Post-CABG Day 3 • Last: BP 124/78, SpO2 97%
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => onOpenVitalsModal(nursingWorkload[1])}>
                Log Vitals
              </Button>
            </div>
          </div>
        </div>

        {/* Medication Administration Quick Checklist */}
        <div className="shos-card" style={{ padding: 22, backgroundColor: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pill size={18} style={{ color: 'var(--color-secondary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                Shift B Medication Alerts
              </h3>
            </div>
            <Badge variant="teal">02:00 PM Window</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-warning-subtle)',
                border: '1px solid var(--color-warning)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.86rem', color: 'var(--color-text)' }}>
                  Metoprolol Succinate 50mg
                </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  Patient: <span style={{ fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => setSelectedPatientChart(nursingWorkload[0])}>Rahul Sharma</span> (Ward A - Bed 02)
                </div>
              </div>
              <Button
                size="xs"
                variant="primary"
                onClick={() => handleAdministerDose('NW-101', 'Rahul Sharma', 'Metoprolol Succinate 50mg')}
              >
                Administer
              </Button>
            </div>

            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.86rem', color: 'var(--color-text)' }}>
                  Cefuroxime 500mg IV Infusion
                </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  Patient: <span style={{ fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => setSelectedPatientChart(nursingWorkload[1])}>Anita Deshmukh</span> (Ward A - Bed 04)
                </div>
              </div>
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleAdministerDose('NW-102', 'Anita Deshmukh', 'Cefuroxime 500mg IV')}
              >
                Administer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PATIENT NURSING CARE CHART MODAL */}
      {selectedPatientChart && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            className="shos-card animate-scale-up"
            style={{
              backgroundColor: 'var(--color-surface)',
              maxWidth: 580,
              width: '100%',
              padding: 24,
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 12,
                borderBottom: '1px solid var(--color-border)',
                marginBottom: 16
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                    {selectedPatientChart.patientName}
                  </h3>
                  <Badge variant="teal">{selectedPatientChart.bed}</Badge>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {selectedPatientChart.uhid} • Age/Gender: {selectedPatientChart.ageGender} • Attending: {selectedPatientChart.doctor}
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientChart(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Allergy Warning */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedPatientChart.allergy.includes('NKDA') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${selectedPatientChart.allergy.includes('NKDA') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <AlertCircle size={18} style={{ color: selectedPatientChart.allergy.includes('NKDA') ? '#059669' : '#dc2626' }} />
                <div>
                  <strong style={{ fontSize: '0.82rem', color: selectedPatientChart.allergy.includes('NKDA') ? '#065f46' : '#991b1b' }}>
                    Allergy Record:
                  </strong>
                  <span style={{ fontSize: '0.82rem', marginLeft: 6, color: 'var(--color-text)' }}>
                    {selectedPatientChart.allergy}
                  </span>
                </div>
              </div>

              {/* Clinical Overview Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    IV Cannula / Access
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 4 }}>
                    {selectedPatientChart.ivCannula}
                  </div>
                </div>

                <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Diet Order
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 4 }}>
                    {selectedPatientChart.diet}
                  </div>
                </div>
              </div>

              {/* Last Logged Vitals */}
              <div style={{ padding: 14, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                  Latest Vital Signs Telemetry
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedPatientChart.lastVitals}
                </div>
              </div>

              {/* Active Care Order */}
              <div style={{ padding: 14, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-subtle)', border: '1px solid var(--color-primary)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Shift Nursing Care Order
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)', marginTop: 4 }}>
                  {selectedPatientChart.careOrder}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Scheduled Due Window: <strong>{selectedPatientChart.dueTime}</strong> • Current Status: <strong>{selectedPatientChart.status}</strong>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPatientChart(null)}
                >
                  Close Chart
                </Button>

                {selectedPatientChart.category === 'Medication' && (
                  <Button
                    variant="primary"
                    icon={Syringe}
                    onClick={() => {
                      handleAdministerDose(selectedPatientChart.id, selectedPatientChart.patientName, selectedPatientChart.careOrder);
                      setSelectedPatientChart(null);
                    }}
                  >
                    Administer Medication Now
                  </Button>
                )}

                <Button
                  variant="secondary"
                  icon={Activity}
                  onClick={() => {
                    const pt = selectedPatientChart;
                    setSelectedPatientChart(null);
                    onOpenVitalsModal(pt);
                  }}
                >
                  Record New Vitals
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

