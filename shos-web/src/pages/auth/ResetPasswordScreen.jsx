import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 1800);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new, strong password for your SHOS account."
    >
      {success ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-success-subtle)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-success)',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            Password reset successfully! Redirecting to sign in...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ color: 'var(--color-critical)', fontSize: '0.8rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            required
            placeholder="Min 6 characters"
            icon={Lock}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('');
            }}
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            placeholder="Re-enter new password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
          />

          <Button type="submit" variant="primary" size="lg" icon={CheckCircle2} style={{ width: '100%', marginTop: 4 }}>
            Update Password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};
