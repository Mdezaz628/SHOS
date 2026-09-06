import React from 'react';
import { Activity, ShieldCheck, Heart, Radio, AlertTriangle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AuthLayout = ({ children, title, subtitle }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        backgroundImage: isDark
          ? `
            linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
            radial-gradient(ellipse at 10% 10%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 90%, rgba(45, 212, 191, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(244, 63, 94, 0.05) 0%, transparent 60%)
          `
          : `
            linear-gradient(rgba(2, 132, 199, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(2, 132, 199, 0.08) 1px, transparent 1px),
            radial-gradient(ellipse at 10% 10%, rgba(2, 132, 199, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 90%, rgba(13, 148, 136, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(225, 29, 72, 0.04) 0%, transparent 60%)
          `,
        backgroundSize: '28px 28px, 28px 28px, 100% 100%, 100% 100%, 100% 100%',
        backgroundAttachment: 'fixed',
        padding: '24px 14px',
        position: 'relative'
      }}
    >
      {/* Top Clinical Strip */}
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          backgroundColor: isDark ? 'rgba(11, 26, 45, 0.95)' : 'rgba(240, 249, 255, 0.95)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px 8px 0 0',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: 'var(--color-text-dim)',
          fontFamily: 'var(--font-mono)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontWeight: 800 }}>
          <Radio size={12} className="animate-pulse" />
          <span>STAT EMERGENCY: 108</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
            NABH LEVEL-1 APEX
          </span>
          <button
            onClick={toggleTheme}
            type="button"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDark ? '#fbbf24' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              padding: 2
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Card */}
      <div
        className="animate-fade-in shos-card"
        style={{
          width: '100%',
          maxWidth: 520,
          padding: '28px 24px',
          boxShadow: isDark
            ? '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.15)'
            : '0 20px 45px rgba(10, 25, 47, 0.08), 0 0 25px rgba(2, 132, 199, 0.1)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          backdropFilter: 'blur(20px)',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          border: '1px solid var(--color-border)',
          borderTop: 'none',
          boxSizing: 'border-box'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.45)',
                border: '1.5px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <Activity size={28} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  SHOS
                </h2>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff'
                  }}
                >
                  CLINICAL OS
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Metropolitan Apex Hospital
              </span>
            </div>
          </div>

          {/* Cardiac Rhythm Wave Animation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '10px 0 14px 0' }}>
            <Heart size={13} style={{ color: '#ef4444' }} className="animate-heartbeat" />
            <svg width="100" height="16" viewBox="0 0 100 16" style={{ stroke: '#059669', fill: 'none', strokeWidth: 1.8 }}>
              <path
                d="M0,8 L25,8 L28,2 L32,14 L36,1 L40,12 L44,8 L100,8"
                className="animate-ecg"
              />
            </svg>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 800 }}>
              76 BPM STAT
            </span>
          </div>

          {title && (
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', marginTop: 8 }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Auth Body */}
        <div>{children}</div>

        {/* Accreditation Footer */}
        <div
          style={{
            marginTop: 26,
            paddingTop: 16,
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: '0.72rem',
            color: 'var(--color-text-dim)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={14} style={{ color: '#0d9488' }} />
            <span>NABH Level-1 Hospital</span>
          </div>
          <span>•</span>
          <span>NABL Diagnostics</span>
          <span>•</span>
          <span style={{ color: '#e11d48', fontWeight: 700 }}>24/7 Trauma Service</span>
        </div>
      </div>
    </div>
  );
};
