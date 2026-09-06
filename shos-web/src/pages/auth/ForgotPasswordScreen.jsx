import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      console.warn('Offline/Fallback notice:', err);
    } finally {
      setIsSubmitting(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your registered email address or mobile to receive a secure recovery code."
    >
      {sent ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-success-subtle)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-success)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Password reset instructions have been dispatched to <strong>{email}</strong>.
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/reset-password')}
            style={{ width: '100%' }}
          >
            Enter Reset Code
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Email or Mobile"
            type="text"
            required
            placeholder="e.g. name@shos.hospital"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg" icon={Send} style={{ width: '100%' }}>
            Send Reset Instructions
          </Button>

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
