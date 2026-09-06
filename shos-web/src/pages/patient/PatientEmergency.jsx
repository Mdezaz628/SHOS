import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Truck,
  Building2,
  ShieldAlert,
  MapPin,
  HeartPulse,
  Send,
  CheckCircle2,
  Activity,
  ArrowRight,
  Phone
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AmbulanceTracker } from './AmbulanceTracker';

export const PatientEmergency = ({ currentUser, onNavigate }) => {
  const [activeView, setActiveView] = useState('sos'); // 'sos', 'request_form', 'tracking'
  const [severity, setSeverity] = useState('Critical');

  // Emergency request form fields
  const [formData, setFormData] = useState({
    location: 'Flat 402, Lotus Greens, Sector 12, New Delhi (Auto-detected GPS)',
    problem: 'Severe Chest Pain radiating to left arm & acute breathlessness',
    patientName: currentUser?.name?.split(' (')[0] || 'Rahul Sharma',
    patientAge: '45',
    patientGender: 'Male',
    bloodGroup: 'B+',
    contactPhone: '+91 98765 43210',
    allergies: 'Penicillin'
  });

  const [emergencyDispatched, setEmergencyDispatched] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState(null);

  const emergencyContacts = [
    { title: 'SHOS Hospital Trauma Portico', number: '102 / 011-26598700', type: 'Hospital Hotline' },
    { title: 'National Emergency Service', number: '112 / 108', type: 'Govt Medical Dispatch' },
    { title: 'Sunita Sharma (Spouse / Kin)', number: '+91 98765 11223', type: 'Primary Next of Kin' },
    { title: 'Dr. Vivek Mehra (Primary Cardiologist)', number: '+91 98112 33445', type: 'Assigned Consultant' }
  ];

  const handleDispatch = (e) => {
    e?.preventDefault();
    setEmergencyDispatched(true);
    setActiveView('tracking');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960, margin: '0 auto' }}>
      {/* 🚨 Emergency Top Alert Beacon */}
      <div
        style={{
          background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
          color: '#ffffff',
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            <AlertTriangle size={30} className="animate-pulse" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: -0.5, margin: 0 }}>
                🚨 EMERGENCY TRAUMA & SOS PORTAL
              </h1>
              <span
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-critical)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 12,
                  textTransform: 'uppercase'
                }}
              >
                24x7 Priority
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', opacity: 0.92, margin: '4px 0 0' }}>
              Immediate life-saving dispatch, hospital trauma alert, and emergency responder contact.
            </p>
          </div>
        </div>

        {emergencyDispatched && (
          <Button
            variant="outline"
            onClick={() => setActiveView(activeView === 'tracking' ? 'sos' : 'tracking')}
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-critical)',
              fontWeight: 800,
              border: 'none',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Truck size={16} style={{ marginRight: 6 }} />
            {activeView === 'tracking' ? 'View SOS Controls' : 'Track Active Ambulance (08m)'}
          </Button>
        )}
      </div>

      {/* Main 3 High-Priority Actions from User Spec:
          [Request Ambulance]
          [Hospital Emergency]
          [Call Emergency Contact]
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16
        }}
      >
        {/* Button 1: Request Ambulance */}
        <div
          onClick={() => setActiveView('request_form')}
          className="shos-card hover-lift"
          style={{
            padding: '24px 20px',
            backgroundColor: activeView === 'request_form' ? 'var(--color-critical-subtle)' : 'var(--color-surface)',
            border: activeView === 'request_form' ? '2px solid var(--color-critical)' : '1px solid var(--color-border)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'relative'
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-critical)'
            }}
          >
            <Truck size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Request Ambulance
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Dispatch Advanced Cardiac Life Support (ACLS) ICU ambulance with oxygen & paramedics.
            </p>
          </div>
          <Button variant="danger" size="sm" style={{ marginTop: 'auto', width: '100%', fontWeight: 700 }}>
            <Truck size={15} style={{ marginRight: 6 }} />
            [Request Ambulance]
          </Button>
        </div>

        {/* Button 2: Hospital Emergency */}
        <div
          onClick={() => setActiveCallModal(emergencyContacts[0])}
          className="shos-card hover-lift"
          style={{
            padding: '24px 20px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}
          >
            <Building2 size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Hospital Emergency
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Direct live line to Central Hospital ER desk & Chief Trauma Officer on call.
            </p>
          </div>
          <Button variant="primary" size="sm" style={{ marginTop: 'auto', width: '100%', fontWeight: 700 }}>
            <PhoneCall size={15} style={{ marginRight: 6 }} />
            [Hospital Emergency]
          </Button>
        </div>

        {/* Button 3: Call Emergency Contact */}
        <div
          onClick={() => setActiveCallModal(emergencyContacts[2])}
          className="shos-card hover-lift"
          style={{
            padding: '24px 20px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-secondary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-secondary)'
            }}
          >
            <PhoneCall size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Call Emergency Contact
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Directly phone Sunita Sharma (+91 98765 11223) or designated family kin.
            </p>
          </div>
          <Button variant="secondary" size="sm" style={{ marginTop: 'auto', width: '100%', fontWeight: 700 }}>
            <Phone size={15} style={{ marginRight: 6 }} />
            [Call Emergency Contact]
          </Button>
        </div>
      </div>

      {/* ACTIVE VIEW 1: Ambulance Tracking UI (Phase 13) */}
      {activeView === 'tracking' && (
        <div className="animate-fade-in">
          <AmbulanceTracker
            emergencyData={{ ...formData, severity }}
            onCancel={() => {
              if (confirm('Are you sure you want to cancel the ambulance request?')) {
                setEmergencyDispatched(false);
                setActiveView('sos');
              }
            }}
            onCallDriver={(num) => setActiveCallModal({ title: 'Ambulance Pilot Manoj Kumar', number: num, type: 'Ambulance Crew' })}
          />
        </div>
      )}

      {/* ACTIVE VIEW 2: Emergency Request Form (Phase 12)
          Form:
          - Location
          - Problem
          - Patient Details
          - Severity
      */}
      {activeView === 'request_form' && (
        <form
          onSubmit={handleDispatch}
          className="shos-card animate-fade-in"
          style={{
            padding: '28px 32px',
            backgroundColor: 'var(--color-surface)',
            border: '2px solid var(--color-critical)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-critical)', margin: 0 }}>
                🚑 Dispatch Ambulance Request Intake
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                Fill details rapidly or confirm with 1 click. Nearest ambulance is on standby.
              </p>
            </div>
            <Badge variant="critical">Urgent Priority</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* 1. Location */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                <MapPin size={16} style={{ color: 'var(--color-critical)' }} />
                Patient Pickup Location / Address <span style={{ color: 'var(--color-critical)' }}>*</span>
              </label>
              <input
                type="text"
                className="shos-input"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter exact address, landmark, floor or room number..."
                style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600 }}>
                ✓ GPS Coordinates locked: 28.5355° N, 77.3910° E
              </span>
            </div>

            {/* 2. Problem / Emergency Nature */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                <Activity size={16} style={{ color: 'var(--color-critical)' }} />
                Nature of Medical Emergency / Chief Problem <span style={{ color: 'var(--color-critical)' }}>*</span>
              </label>
              <textarea
                className="shos-input"
                rows={2}
                required
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="e.g., Severe Chest Pain, Unconscious, High Fall, Trauma, Difficulty Breathing..."
                style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', resize: 'vertical' }}
              />
              {/* Rapid preset chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {['Chest Pain / Heart', 'Breathing Distress', 'Head Trauma', 'Stroke Symptoms', 'Accident'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormData({ ...formData, problem: preset })}
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      cursor: 'pointer'
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Patient Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                backgroundColor: 'var(--color-surface)',
                padding: 16,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  Patient Full Name
                </label>
                <input
                  type="text"
                  className="shos-input"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  style={{ width: '100%', marginTop: 4, backgroundColor: 'var(--color-surface)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  Age / Gender / Blood Group
                </label>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <input
                    type="number"
                    className="shos-input"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    style={{ width: '60px', backgroundColor: 'var(--color-surface)' }}
                  />
                  <input
                    type="text"
                    className="shos-input"
                    value={formData.patientGender}
                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                    style={{ width: '80px', backgroundColor: 'var(--color-surface)' }}
                  />
                  <input
                    type="text"
                    className="shos-input"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    style={{ width: '60px', backgroundColor: 'var(--color-surface)', fontWeight: 700, color: 'var(--color-critical)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  Emergency Callback Phone
                </label>
                <input
                  type="tel"
                  className="shos-input"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  style={{ width: '100%', marginTop: 4, backgroundColor: 'var(--color-surface)' }}
                />
              </div>
            </div>

            {/* 4. Severity Selector */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                <ShieldAlert size={16} style={{ color: 'var(--color-critical)' }} />
                Case Severity Triage <span style={{ color: 'var(--color-critical)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                {[
                  { level: 'Critical', color: 'var(--color-critical)', desc: 'Life-threatening, immediate dispatch', icon: '🔴' },
                  { level: 'High Urgency', color: 'var(--color-warning)', desc: 'Severe pain or rapid deterioration', icon: '🟠' },
                  { level: 'Moderate', color: 'var(--color-secondary)', desc: 'Requires clinical transport', icon: '🟡' }
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSeverity(item.level)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: severity === item.level ? `2px solid ${item.color}` : '1px solid var(--color-border)',
                      backgroundColor: severity === item.level ? 'var(--color-critical-subtle)' : 'var(--color-surface)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', color: item.color }}>
                      <span>{item.icon}</span>
                      <span>{item.level}</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit & Cancel Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <Button
                type="submit"
                variant="danger"
                size="lg"
                style={{ flex: 2, fontWeight: 800, fontSize: '1rem', padding: '14px 24px' }}
              >
                <Truck size={20} style={{ marginRight: 8 }} />
                Dispatch Ambulance Now (Free 24x7)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setActiveView('sos')}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Directory of Emergency Numbers */}
      <div
        className="shos-card"
        style={{
          padding: 24,
          backgroundColor: 'var(--color-surface)'
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 14 }}>
          Direct Emergency Hotlines & Contacts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  {contact.type}
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {contact.title}
                </div>
                <strong style={{ fontSize: '0.84rem', color: 'var(--color-primary)' }}>
                  {contact.number}
                </strong>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setActiveCallModal(contact)}
              >
                <Phone size={13} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Call Dialog Simulation Modal */}
      {activeCallModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            className="shos-card animate-scale-up"
            style={{
              backgroundColor: 'var(--color-surface)',
              padding: 28,
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 0 8px rgba(22, 163, 74, 0.2)'
              }}
            >
              <PhoneCall size={30} className="animate-pulse" />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Initiating Telephony Protocol
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', margin: '4px 0 2px' }}>
                {activeCallModal.title}
              </h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {activeCallModal.number}
              </p>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              In a browser demo environment, clicking proceed launches tel: link or connects directly to the hospital VoIP PBX switchboard.
            </p>

            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <Button
                variant="primary"
                style={{ flex: 1 }}
                onClick={() => {
                  window.location.href = `tel:${activeCallModal.number.split('/')[0].trim()}`;
                  setActiveCallModal(null);
                }}
              >
                Dial Now
              </Button>
              <Button
                variant="outline"
                style={{ flex: 1 }}
                onClick={() => setActiveCallModal(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
