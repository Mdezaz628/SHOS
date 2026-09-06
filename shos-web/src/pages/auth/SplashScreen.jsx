import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        padding: 24,
        textAlign: 'center'
      }}
      className="animate-fade-in"
    >
      <div
        className="pulse-critical shos-splash-logo"
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: '#ffffff',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Activity size={46} />
      </div>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
        SHOS
      </h1>
      <p style={{ fontSize: '1rem', color: '#93c5fd', fontWeight: 500, maxWidth: 320, marginBottom: 28 }}>
        Smart Hospital Operations System
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: '#bfdbfe' }}>
        <div style={{ width: 14, height: 14, border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span>Initializing Clinical Telemetry & Services...</span>
      </div>

      <button
        onClick={() => navigate('/welcome')}
        style={{
          marginTop: 24,
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          cursor: 'pointer'
        }}
      >
        Skip to Welcome
      </button>
    </div>
  );
};
