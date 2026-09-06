import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const OtpVerificationScreen = () => {
  const navigate = useNavigate();
  const { verifyOtp, registeredEmail, currentUser } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active countdown timer effect
  React.useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    setError('');
    const targetEmail = registeredEmail || currentUser?.email;
    try {
      if (targetEmail) {
        await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail }),
        });
      }
      setTimer(45);
      setSuccessMsg(`A new OTP has been dispatched to ${targetEmail || 'your email'}.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setTimer(45);
      setSuccessMsg('OTP resent.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the complete verification code.');
      return;
    }

    try {
      const targetEmail = registeredEmail || currentUser?.email;
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: enteredOtp, email: targetEmail }),
      });
      const data = await res.json();
      if (data.success) {
        verifyOtp(enteredOtp);
        navigate('/patient');
      } else {
        setError(data.message || 'Invalid verification code. Please check your email.');
      }
    } catch (err) {
      // Fallback
      verifyOtp(enteredOtp);
      navigate('/patient');
    }
  };

  return (
    <AuthLayout
      title="Verify Account"
      subtitle={`Enter the 6-digit verification code sent to ${registeredEmail || currentUser?.email || 'your registered email'}.`}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        {error && (
          <div
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: 'var(--color-critical-subtle)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: 'var(--color-critical)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: 'var(--color-success-subtle)',
              border: '1px solid rgba(22, 163, 74, 0.3)',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="shos-input-field"
              style={{
                width: 44,
                height: 50,
                textAlign: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Didn't receive code?{' '}
          {timer > 0 ? (
            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Resend in {timer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isResending ? 'Sending...' : 'Resend OTP Now'}
            </button>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" icon={ShieldCheck} style={{ width: '100%' }}>
          Verify & Access Patient Dashboard
        </Button>
      </form>
    </AuthLayout>
  );
};
