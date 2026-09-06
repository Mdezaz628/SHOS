import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Heart,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, ROLE_ROUTES, ROLE_LABELS } from '../../constants/roles';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();

  const [email, setEmail] = useState('doctor@shos.hospital');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState(ROLES.DOCTOR);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const rolePresets = [
    { role: ROLES.DOCTOR, label: 'Doctor OPD', email: 'doctor@shos.hospital', icon: Stethoscope },
    { role: ROLES.NURSE, label: 'Nurse Station', email: 'nurse@shos.hospital', icon: Activity },
    { role: ROLES.ADMIN, label: 'Command Center', email: 'admin@shos.hospital', icon: Building2 },
    { role: ROLES.DEPARTMENT, label: 'Dept HOD', email: 'cardio.hod@shos.hospital', icon: Heart },
    { role: ROLES.SUPERADMIN, label: 'Super Admin', email: 'superadmin@shos.hospital', icon: ShieldCheck },
    { role: ROLES.PATIENT, label: 'Patient Portal', email: 'patient@shos.hospital', icon: UserCheck }
  ];

  const handleSelectPreset = (preset) => {
    setSelectedRole(preset.role);
    setEmail(preset.email);
    setPassword('password123');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
    const targetRoute = ROLE_ROUTES[selectedRole] || '/admin';
    navigate(targetRoute);
  };

  return (
    <AuthLayout
      title="Hospital Staff & Patient Authentication"
      subtitle="Sign in to access your clinical dashboard, bed telemetry, or health records."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Rapid Station Quick-Select Badges */}
        <div>
          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
            Select Clinical Station (Demo Preset):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: 8 }}>
            {rolePresets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedRole === preset.role;
              return (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <Icon size={16} style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-dim)' }} />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email / UHID Input */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
            Hospital Staff Email / Patient UHID
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={17} style={{ position: 'absolute', top: 12, left: 14, color: 'var(--color-text-dim)' }} />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. doctor@shos.hospital or UHID-89421"
              className="shos-input"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Password Input with Show/Hide Toggle */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
            Security Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={17} style={{ position: 'absolute', top: 12, left: 14, color: 'var(--color-text-dim)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="shos-input"
              style={{ paddingLeft: 40, paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: 10,
                right: 12,
                background: 'none',
                border: 'none',
                color: 'var(--color-text-dim)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember this workstation
            </label>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={LogIn}
          style={{ width: '100%', marginTop: 8 }}
        >
          Sign In to {ROLE_LABELS[selectedRole]}
        </Button>

        {/* New Patient Registration Link */}
        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
          First-time outpatient?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'none' }}>
            Register New UHID here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
