import React, { useState } from 'react';
import {
  Car,
  QrCode,
  CheckCircle2,
  Printer,
  X,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const VehicleEntryForm = ({ onVehicleAdded, onClose }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: 'DL-01-AB-1234',
    type: 'Car / SUV',
    visitorType: 'Patient Inbound',
    slot: 'Zone A — A01',
    driverName: 'Ramesh Kumar',
    driverPhone: '+91 98711 22334'
  });

  const [generatedPass, setGeneratedPass] = useState(null);

  const vehicleTypes = ['Car / SUV', 'Two-Wheeler (Motorbike/Scooter)', 'Emergency Ambulance', 'Staff / Doctor Vehicle', 'Delivery / Van'];
  const visitorCategories = ['Patient Inbound', 'OPD Visitor / Relative', 'Attending Doctor', 'Hospital Staff', 'Emergency Priority'];
  const availableSlots = ['Zone A — A01', 'Zone A — A03', 'Zone B — B12', 'Zone B — B14', 'Basement 1 — D08'];

  const handleGenerateQR = (e) => {
    e.preventDefault();

    const pass = {
      passId: `PRK-${Math.floor(100000 + Math.random() * 900000)}`,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      type: formData.type,
      visitorType: formData.visitorType,
      slot: formData.slot,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      entryDate: new Date().toLocaleDateString('en-GB'),
      rate: formData.visitorType.includes('Emergency') || formData.visitorType.includes('Doctor') ? 'Complimentary (₹0)' : 'Standard Hospital Tariff (₹40/hr)'
    };

    setGeneratedPass(pass);
    if (onVehicleAdded) {
      onVehicleAdded(pass);
    }
  };

  return (
    <div className="shos-card animate-fade-in" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Car size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Hospital Security Gate — Vehicle Entry & QR Pass
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Phase 21 Vehicle Intake Protocol • Fast Barrier Tagging
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {generatedPass ? (
        /* Digital QR Gate Pass Card */
        <div className="animate-scale-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              border: '2px dashed var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              maxWidth: 420,
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Badge variant="teal">ENTRY PASS ISSUED</Badge>
              <strong style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                {generatedPass.passId}
              </strong>
            </div>

            {/* Simulated High-Resolution QR Graphic */}
            <div
              className="shos-qr-code-box"
              style={{
                width: 140,
                height: 140,
                backgroundColor: '#ffffff',
                margin: '0 auto 14px',
                padding: 10,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <QrCode size={120} color="#0f172a" />
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', letterSpacing: 1, color: 'var(--color-text)' }}>
              {generatedPass.vehicleNumber}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '6px 0 14px' }}>
              <Badge variant="primary">{generatedPass.slot}</Badge>
              <Badge variant="secondary">{generatedPass.type}</Badge>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Driver: <strong>{generatedPass.driverName}</strong></span>
                <span>Phone: {generatedPass.driverPhone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Entry Time: <strong>{generatedPass.entryTime}</strong></span>
                <span>Date: {generatedPass.entryDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)', fontWeight: 600 }}>
                <span>Tariff:</span>
                <span>{generatedPass.rate}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="primary"
              icon={Printer}
              onClick={() => alert(`Printing thermal gate token for ${generatedPass.vehicleNumber} at Boom Barrier 01.`)}
            >
              Print Boom Barrier Ticket
            </Button>
            <Button
              variant="outline"
              onClick={() => setGeneratedPass(null)}
            >
              Issue Another Pass
            </Button>
          </div>
        </div>
      ) : (
        /* Vehicle Entry Form matching User Spec:
           - Vehicle Number
           - Type
           - Patient/Visitor
           - Slot
           [Generate QR]
        */
        <form onSubmit={handleGenerateQR} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14
            }}
          >
            {/* 1. Vehicle Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                Vehicle Number <span style={{ color: 'var(--color-critical)' }}>*</span>
              </label>
              <input
                type="text"
                className="shos-input"
                required
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                placeholder="e.g. DL-01-AB-1234"
                style={{ width: '100%', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', padding: '10px 12px' }}
              />
            </div>

            {/* 2. Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                Vehicle Type <span style={{ color: 'var(--color-critical)' }}>*</span>
              </label>
              <select
                className="shos-input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '10px 12px' }}
              >
                {vehicleTypes.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 3. Patient/Visitor */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                Visitor / Inbound Category <span style={{ color: 'var(--color-critical)' }}>*</span>
              </label>
              <select
                className="shos-input"
                value={formData.visitorType}
                onChange={(e) => setFormData({ ...formData, visitorType: e.target.value })}
                style={{ width: '100%', padding: '10px 12px' }}
              >
                {visitorCategories.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 4. Slot */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                Allocated Slot <span style={{ color: 'var(--color-critical)' }}>*</span>
              </label>
              <select
                className="shos-input"
                value={formData.slot}
                onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', fontWeight: 700, color: 'var(--color-primary)' }}
              >
                {availableSlots.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional driver contact info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
              backgroundColor: 'var(--color-surface)',
              padding: 14,
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                Driver / Attendant Name
              </label>
              <input
                type="text"
                className="shos-input"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                Mobile Contact
              </label>
              <input
                type="tel"
                className="shos-input"
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
              />
            </div>
          </div>

          {/* Action: [Generate QR] */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" icon={QrCode} size="lg" style={{ fontWeight: 800 }}>
              [Generate QR]
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
