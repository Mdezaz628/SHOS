import React, { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  Building2,
  Stethoscope,
  Volume2,
  CheckCircle2,
  ArrowRight,
  BellRing
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const PatientQueueScreen = () => {
  const [yourToken] = useState('#24');
  const [currentToken, setCurrentToken] = useState(19);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const peopleAhead = Math.max(0, 24 - currentToken);
  const estimatedWait = peopleAhead * 7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 840, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Live OPD Patient Queue Telemetry
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Real-time consultation queue tracking and room display.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`btn ${soundEnabled ? 'btn-outline' : 'btn-ghost'}`}
          style={{ fontSize: '0.8rem' }}
        >
          <Volume2 size={16} />
          <span>{soundEnabled ? 'Chime Alert Active' : 'Chime Muted'}</span>
        </button>
      </div>

      {/* Primary Token Board */}
      <div
        className="shos-card animate-fade-in"
        style={{
          padding: '32px 28px',
          borderTop: '6px solid var(--color-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 20
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Cardiology Outpatient Clinic
        </span>

        {/* Big Token Number */}
        <div>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>
            YOUR ASSIGNED TOKEN
          </span>
          <div
            style={{
              fontSize: '4.5rem',
              fontWeight: 900,
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
              margin: '8px 0'
            }}
          >
            {yourToken}
          </div>
          <Badge variant="primary" size="md">
            Patient: Rahul Sharma (UHID-90214)
          </Badge>
        </div>

        {/* Live Counters */}
        <div
          style={{
            width: '100%',
            maxWidth: 620,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginTop: 10
          }}
        >
          {/* Current Serving */}
          <div style={{ padding: '16px', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(30, 64, 175, 0.15)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              NOW CONSULTING
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
              #{currentToken}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Inside Doctor's Cabin</span>
          </div>

          {/* People Ahead */}
          <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              PATIENTS AHEAD
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
              {peopleAhead}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>In Waiting Lounge</span>
          </div>

          {/* Estimated Wait */}
          <div style={{ padding: '16px', backgroundColor: 'var(--color-warning-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(234, 88, 12, 0.2)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-warning)', fontWeight: 700, textTransform: 'uppercase' }}>
              ESTIMATED WAIT
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
              ~{estimatedWait}m
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Average 7 mins / visit</span>
          </div>
        </div>

        {/* Assigned Doctor & Room Information */}
        <div
          style={{
            width: '100%',
            maxWidth: 620,
            padding: '16px 20px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
            <Stethoscope size={22} style={{ color: 'var(--color-primary)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Consulting Physician</span>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Dr. Vivek Mehra</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
            <Building2 size={22} style={{ color: 'var(--color-secondary)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Room Location</span>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary)' }}>OPD-204 (2nd Floor)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Tip Banner */}
      <div
        style={{
          padding: '14px 18px',
          backgroundColor: 'var(--color-primary-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(30, 64, 175, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)'
        }}
      >
        <BellRing size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
        <span>
          Please take your seat in Lounge Area B outside <strong>OPD-204</strong>. When token <strong>#24</strong> appears on the LED display, proceed directly into the consulting cabin.
        </span>
      </div>
    </div>
  );
};
