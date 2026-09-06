import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  UserPlus,
  LogIn,
  HeartPulse,
  Clock,
  Shield,
  Stethoscope,
  Activity,
  BedDouble,
  Building2,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_ROUTES } from '../../constants/roles';

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleFastPersonaLogin = (role) => {
    switchRole(role);
    navigate(ROLE_ROUTES[role] || '/admin');
  };

  return (
    <AuthLayout
      title="Welcome to Central Hospital Portal"
      subtitle="Select a clinical role to access hospital operations or sign in with your UHID."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Emergency SOS Call Box */}
        <div
          style={{
            backgroundColor: 'var(--color-critical-subtle)',
            border: '1.5px solid var(--color-critical)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              className="animate-strobe"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--color-critical)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <HeartPulse size={18} />
            </span>
            <div>
              <strong style={{ fontSize: '0.82rem', color: 'var(--color-critical)', display: 'block' }}>
                MEDICAL EMERGENCY STAT (24x7)
              </strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Dial 108 or Central Trauma Bay: (011) 2940-1000
              </span>
            </div>
          </div>
          <button
            onClick={() => handleFastPersonaLogin(ROLES.AMBULANCE)}
            className="btn btn-sm btn-critical"
          >
            Dispatch SOS
          </button>
        </div>

        {/* 1-Click Clinical Persona Fast Jump (Demo & Testing) */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '14px', backgroundColor: 'var(--color-surface)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>
            ⚡ 1-Click Clinical Station Entry (Live Demo):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            <button
              onClick={() => handleFastPersonaLogin(ROLES.ADMIN)}
              className="btn btn-sm btn-primary"
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}
            >
              <Activity size={14} /> Command Center
            </button>

            <button
              onClick={() => handleFastPersonaLogin(ROLES.DEPARTMENT)}
              className="btn btn-sm btn-secondary"
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}
            >
              <Building2 size={14} /> Department HOD
            </button>

            <button
              onClick={() => handleFastPersonaLogin(ROLES.DOCTOR)}
              className="btn btn-sm btn-outline"
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}
            >
              <Stethoscope size={14} style={{ color: '#0284c7' }} /> Doctor OPD
            </button>

            <button
              onClick={() => handleFastPersonaLogin(ROLES.NURSE)}
              className="btn btn-sm btn-outline"
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}
            >
              <BedDouble size={14} style={{ color: '#059669' }} /> Nurse Station
            </button>

            <button
              onClick={() => handleFastPersonaLogin(ROLES.PATIENT)}
              className="btn btn-sm btn-outline"
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}
            >
              <UserCheck size={14} style={{ color: '#8b5cf6' }} /> Patient Portal
            </button>

            <button
              onClick={() => handleFastPersonaLogin(ROLES.RECEPTION)}
              className="btn btn-sm btn-outline"
              style={{ justifyContent: 'flex-start', fontSize: '0.78rem' }}
            >
              <Clock size={14} style={{ color: '#f59e0b' }} /> Reception Desk
            </button>
          </div>
        </div>

        {/* Standard Authentication */}
        <Button
          variant="primary"
          size="lg"
          icon={LogIn}
          onClick={() => navigate('/login')}
          style={{ width: '100%' }}
        >
          Sign In with Hospital Credentials / UHID
        </Button>

        <Button
          variant="outline"
          size="lg"
          icon={UserPlus}
          onClick={() => navigate('/register')}
          style={{ width: '100%' }}
        >
          New Patient OPD Registration
        </Button>
      </div>
    </AuthLayout>
  );
};
