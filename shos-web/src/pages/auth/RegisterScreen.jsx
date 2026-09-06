import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  HeartPulse,
  UserPlus,
  Droplet,
  Calendar,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodGroup: 'B+',
    age: '32',
    gender: 'Male',
    password: '',
    confirmPassword: '',
    emergencyContact: ''
  });
  const [error, setError] = useState('');

  const previewUhid = 'SHOS-2026-' + (formData.phone ? formData.phone.slice(-4) : '8942');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Security password must contain at least 6 characters.');
      return;
    }

    register(formData);
    // Send OTP email to registered address via backend
    if (formData.email) {
      fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      }).catch((e) => console.log('Backend OTP dispatch notice:', e));
    }
    navigate('/otp');
  };

  return (
    <AuthLayout
      title="Central Patient UHID Registration"
      subtitle="Register to book outpatient appointments, view pathology reports, and manage hospital admissions."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-critical-subtle)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: 'var(--color-critical)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Digital UHID Card Preview */}
        <div
          style={{
            backgroundColor: 'var(--color-primary-subtle)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Allocated Patient Identification (UHID):
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', marginTop: 2 }}>
              {previewUhid}
            </div>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isDark ? 'rgba(244, 63, 94, 0.18)' : '#fee2e2',
              color: isDark ? '#fb7185' : '#dc2626',
              border: isDark ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid #fca5a5'
            }}
          >
            🩸 {formData.bloodGroup}
          </span>
        </div>

        {/* Full Name */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
            Patient Full Name *
          </label>
          <div style={{ position: 'relative' }}>
            <User size={17} style={{ position: 'absolute', top: 12, left: 14, color: 'var(--color-text-dim)' }} />
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="shos-input"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Contact Grid: Email & Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--color-text-dim)' }} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                className="shos-input"
                style={{ paddingLeft: 36, fontSize: '0.84rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
              Mobile Phone *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--color-text-dim)' }} />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="shos-input"
                style={{ paddingLeft: 36, fontSize: '0.84rem' }}
              />
            </div>
          </div>
        </div>

        {/* Clinical Demographics: Blood Group, Age, Gender */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10 }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="shos-input"
              style={{ fontSize: '0.84rem', padding: '10px 8px' }}
            >
              <option value="A+">A +ve</option>
              <option value="A-">A -ve</option>
              <option value="B+">B +ve</option>
              <option value="B-">B -ve</option>
              <option value="O+">O +ve</option>
              <option value="O-">O -ve</option>
              <option value="AB+">AB +ve</option>
              <option value="AB-">AB -ve</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
              Age (Years)
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="shos-input"
              style={{ fontSize: '0.84rem', padding: '10px 8px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="shos-input"
              style={{ fontSize: '0.84rem', padding: '10px 8px' }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Emergency SOS Contact */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
            Kin Emergency Contact Number *
          </label>
          <div style={{ position: 'relative' }}>
            <HeartPulse size={17} style={{ position: 'absolute', top: 12, left: 14, color: '#e11d48' }} />
            <input
              type="tel"
              name="emergencyContact"
              required
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Next of Kin / Relative Mobile"
              className="shos-input"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Password Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--color-text-dim)' }} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="shos-input"
                style={{ paddingLeft: 36, fontSize: '0.84rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', display: 'block', marginBottom: 6 }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--color-text-dim)' }} />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="shos-input"
                style={{ paddingLeft: 36, fontSize: '0.84rem' }}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={UserPlus}
          style={{ width: '100%', marginTop: 8 }}
        >
          Generate UHID & Verify via Mobile OTP
        </Button>

        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          Already have a patient UHID?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
