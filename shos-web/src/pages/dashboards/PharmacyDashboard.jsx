import React, { useState } from 'react';
import { Pill, AlertTriangle, ShoppingCart, CheckCircle2, FileText, Check, PackageCheck, AlertOctagon } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MedicineCard } from '../../components/hospital/MedicineCard';

export const PharmacyDashboard = () => {
  const { pharmacyStock } = useHospital();
  const [stock, setStock] = useState(pharmacyStock);

  // Live Doctor Prescription Intake Queue
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'eRx-9921',
      patientName: 'Rahul Sharma',
      uhid: 'SHOS-2026-8942',
      doctor: 'Dr. Vikram Malhotra (Cardiology)',
      date: 'Today, 10:45 AM',
      medicines: [
        { name: 'Tab. Telmisartan 40mg', qty: '30 Tabs', dosage: '1 Tab Daily' },
        { name: 'Tab. Atorvastatin 20mg', qty: '30 Tabs', dosage: '1 Tab Night' },
      ],
      status: 'Pending Dispensation',
    },
    {
      id: 'eRx-9922',
      patientName: 'Meena Kumari',
      uhid: 'SHOS-2026-7781',
      doctor: 'Dr. Vikram Malhotra (Cardiology)',
      date: 'Today, 11:15 AM',
      medicines: [
        { name: 'Tab. Clopidogrel 75mg', qty: '15 Tabs', dosage: '1 Tab Daily' },
      ],
      status: 'Verified & Packaged',
    },
    {
      id: 'eRx-9923',
      patientName: 'Vikramaditya Rao',
      uhid: 'SHOS-2026-1192',
      doctor: 'Dr. Sunita Rao (ICU)',
      date: 'Today, 09:30 AM',
      medicines: [
        { name: 'Inj. Low Molecular Heparin 0.6ml', qty: '2 Vials', dosage: 'STAT IV' },
      ],
      status: 'Dispensed',
    },
  ]);

  const handleRestock = (item) => {
    setStock((prev) =>
      prev.map((m) =>
        m.code === item.code ? { ...m, stock: m.stock + 100, status: 'Adequate' } : m
      )
    );
  };

  const handleDispenseRx = (rxId) => {
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === rxId ? { ...rx, status: 'Dispensed & Deducted' } : rx
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Hospital Dispensary & Inpatient Pharmacy
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Central Medical Depot • eRx Prescription Dispensation Console & Formulary Stock Ledger
          </p>
        </div>
      </div>

      {/* Doctor e-Prescription Fulfillment Queue */}
      <Card
        title="Doctor eRx Dispensation Queue (Inpatient & OPD)"
        subtitle="Verify clinical dosage, batch allocation, and barcode dispensation"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {prescriptions.map((rx) => {
            const isDispensed = rx.status.includes('Dispensed');
            return (
              <div
                key={rx.id}
                className="shos-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14,
                  backgroundColor: isDispensed ? 'var(--color-surface)' : 'var(--color-surface)',
                  borderLeft: isDispensed ? '4px solid #10b981' : '4px solid #0284c7',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: '0.96rem', color: 'var(--color-text)' }}>{rx.patientName}</strong>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{rx.uhid}</span>
                    <Badge variant={isDispensed ? 'success' : 'primary'} size="sm">{rx.status}</Badge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                    Ordered by <strong>{rx.doctor}</strong> • {rx.date} • Rx Ref: <span style={{ fontFamily: 'var(--font-mono)' }}>{rx.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {rx.medicines.map((m, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: 'var(--color-bg-subtle)',
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        💊 <strong>{m.name}</strong> ({m.qty}) — {m.dosage}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {!isDispensed ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={PackageCheck}
                      onClick={() => handleDispenseRx(rx.id)}
                    >
                      Dispense & Auto-Deduct
                    </Button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                      <CheckCircle2 size={16} /> Dispensed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Formulary Inventory Ledger */}
      <Card title="Medicine Inventory & Formulary Ledger" subtitle="Real-time stock depletion, batch codes, and reorder thresholds">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {stock.map((m) => (
            <MedicineCard key={m.code} medicine={m} onReorder={handleRestock} />
          ))}
        </div>
      </Card>
    </div>
  );
};
