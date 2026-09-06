import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BedDouble,
  Pill,
  FlaskConical,
  Ambulance,
  HeartHandshake,
  Receipt,
  Car,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Building2,
  Trash2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_ROUTES } from '../constants/roles';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentRole } = useAuth();

  // Role specific navigation items
  const getNavItems = () => {
    switch (currentRole) {
      case ROLES.PATIENT:
        return [
          { to: '/patient#home', label: 'My Health Home', icon: LayoutDashboard },
          { to: '/patient#doctors', label: 'Find Doctors', icon: Users },
          { to: '/patient#appointments', label: 'My Appointments', icon: CalendarDays },
          { to: '/patient#queue', label: 'Live Queue (#24)', icon: Clock },
          { to: '/patient#reports', label: 'Medical Reports', icon: FlaskConical },
          { to: '/patient#prescriptions', label: 'Prescriptions', icon: Pill },
          { to: '/patient#bills', label: 'Bills & Payments', icon: Receipt },
          { to: '/patient#profile', label: 'Patient Profile', icon: HeartHandshake }
        ];
      case ROLES.DOCTOR:
        return [
          { to: '/doctor', label: 'Doctor OPD Cabin', icon: LayoutDashboard },
          { to: '/doctor#queue', label: 'Patient Queue', icon: CalendarDays },
          { to: '/doctor#inpatients', label: 'Ward Rounds', icon: BedDouble },
          { to: '/doctor#labs', label: 'Pathology Reports', icon: FlaskConical }
        ];
      case ROLES.NURSE:
        return [
          { to: '/nurse', label: 'Nursing Station', icon: LayoutDashboard },
          { to: '/nurse#beds', label: 'Ward Bed Census', icon: BedDouble },
          { to: '/nurse#meds', label: 'IV & Medication Chart', icon: Pill },
          { to: '/nurse#vitals', label: 'Vitals Monitoring', icon: HeartHandshake }
        ];
      case ROLES.SUPPORT:
        return [
          { to: '/support', label: 'Support & Wheelchair', icon: LayoutDashboard },
          { to: '/support#tasks', label: 'Patient Transfers', icon: HeartHandshake }
        ];
      case ROLES.LAB:
        return [
          { to: '/lab', label: 'Diagnostic Laboratory', icon: LayoutDashboard },
          { to: '/lab#stat', label: 'STAT Blood Panels', icon: FlaskConical }
        ];
      case ROLES.PHARMACY:
        return [
          { to: '/pharmacy', label: 'Dispensary & Stock', icon: LayoutDashboard },
          { to: '/pharmacy#orders', label: 'Drug Reorders', icon: Pill }
        ];
      case ROLES.AMBULANCE:
        return [
          { to: '/ambulance', label: 'Ambulance Fleet GPS', icon: LayoutDashboard },
          { to: '/ambulance#sos', label: 'Trauma SOS Calls', icon: Ambulance }
        ];
      case ROLES.HOUSEKEEPING:
        return [
          { to: '/housekeeping', label: 'Sanitation & Beds', icon: LayoutDashboard },
          { to: '/housekeeping#waste', label: 'Bio-Hazard Waste', icon: Trash2 }
        ];
      case ROLES.PARKING:
        return [
          { to: '/parking', label: 'Parking & Ambulance Bay', icon: LayoutDashboard },
          { to: '/parking#slots', label: 'Emergency Portico', icon: Car }
        ];
      case ROLES.RECEPTION:
        return [
          { to: '/reception', label: 'Front Desk OPD Token', icon: LayoutDashboard },
          { to: '/reception#intake', label: 'Patient Intake', icon: Users }
        ];
      case ROLES.BILLING:
        return [
          { to: '/billing', label: 'Billing & Insurance TPA', icon: LayoutDashboard },
          { to: '/billing#claims', label: 'Discharge Invoices', icon: Receipt }
        ];
      case ROLES.HR:
        return [
          { to: '/hr', label: 'HR & Doctor Shifts', icon: LayoutDashboard },
          { to: '/hr#roster', label: 'Clinical Staffing', icon: Users }
        ];
      case ROLES.DEPARTMENT:
        return [
          { to: '/department', label: 'Department Analytics', icon: LayoutDashboard },
          { to: '/department#ops', label: 'Bed Footfall', icon: Building2 }
        ];
      case ROLES.SUPERADMIN:
        return [
          { to: '/superadmin', label: 'Super Admin HQ', icon: LayoutDashboard },
          { to: '/superadmin#ai', label: '8 ML Models Telemetry', icon: BrainCircuit },
          { to: '/superadmin#campuses', label: 'Hospital Campus Nodes', icon: Building2 },
          { to: '/superadmin#cloud', label: 'Supabase DB & Cloud', icon: ShieldCheck }
        ];
      case ROLES.ADMIN:
      default:
        return [
          { to: '/admin', label: 'Command Center', icon: LayoutDashboard },
          { to: '/admin#ai', label: 'AI Operations & Recs', icon: BrainCircuit },
          { to: '/admin#emergency', label: 'Emergency Trauma (ER)', icon: Ambulance },
          { to: '/admin#beds', label: 'Multi-Ward Bed Matrix', icon: BedDouble },
          { to: '/admin#staff', label: 'Duty Rosters', icon: Users }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className={`shos-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div>
        <div style={{ padding: '0 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!collapsed && (
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigation Menu
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-dim)',
              padding: 4,
              borderRadius: 'var(--radius-sm)',
              marginLeft: collapsed ? 'auto' : 0,
              marginRight: collapsed ? 'auto' : 0
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `shos-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-secondary)', fontWeight: 600, marginBottom: 2 }}>
            <ShieldCheck size={14} />
            <span>NABH Accredited</span>
          </div>
          <div>SHOS v2.4.0 • Clinical Core</div>
        </div>
      )}
    </aside>
  );
};
