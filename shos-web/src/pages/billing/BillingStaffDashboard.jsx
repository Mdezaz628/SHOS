import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  AlertCircle,
  FileCheck,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  Search,
  DollarSign,
  ShieldCheck,
  User,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const BillingStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'create_bill'

  // Exact 4 metrics requested by user:
  // - Pending Bills
  // - Today's Collection
  // - Unpaid Invoices
  // - Insurance Claims
  const [metrics, setMetrics] = useState({
    pendingBills: 18,
    pendingAmount: '₹ 1,42,800',
    todaysCollection: '₹ 3,84,500',
    unpaidInvoices: 6,
    insuranceClaims: 12
  });

  // Billing Itemized Form State (Exact User Specification)
  // - Patient
  // - Services
  // - Charges
  // - Discount
  // - Insurance
  // - Total
  // - Payment Status
  const [billForm, setBillForm] = useState({
    patientName: 'Rahul Sharma',
    uhid: 'UHID-10492',
    phone: '+91 98765 43210',
    ward: 'Ward A — Bed 02',
    discount: 500,
    insuranceCoverage: 3000,
    paymentStatus: 'Pending',
    paymentMethod: 'UPI / Net Banking'
  });

  const [serviceItems, setServiceItems] = useState([
    { id: 1, service: 'Cardiology Specialist Consultation (Dr. Vivek Mehra)', charge: 1000 },
    { id: 2, service: 'Ward A Bed Charges (2 Days Semi-Private)', charge: 4400 },
    { id: 3, service: 'Comprehensive Lipid Profile & hs-cTnI Cardiac Markers', charge: 2200 },
    { id: 4, service: 'Hospital Pharmacy Dispensation (Cardio Rx)', charge: 1450 },
    { id: 5, service: 'Nursing Care & 24h ECG Monitoring Telemetry', charge: 900 }
  ]);

  const [newItem, setNewItem] = useState({ service: '', charge: '' });

  // Invoices Ledger List
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-0921',
      uhid: 'UHID-10492',
      patient: 'Rahul Sharma',
      services: 'Cardio Consult + Bed + Labs',
      charges: 9950,
      discount: 500,
      insurance: 3000,
      total: 6450,
      status: 'Pending',
      date: 'Today, 09:30 AM'
    },
    {
      id: 'INV-2026-0920',
      uhid: 'UHID-10844',
      patient: 'Pooja Verma',
      services: 'Echo Doppler + Blood Count',
      charges: 3200,
      discount: 200,
      insurance: 3000,
      total: 0,
      status: 'Insurance Claimed',
      date: 'Today, 08:45 AM'
    },
    {
      id: 'INV-2026-0919',
      uhid: 'UHID-10210',
      patient: 'Sunita Mehra',
      services: 'Orthopedic Knee Injections & Rehab',
      charges: 5400,
      discount: 0,
      insurance: 0,
      total: 5400,
      status: 'Paid',
      date: '04 Sep 2026'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);

  // Calculations
  const subtotalCharges = serviceItems.reduce((acc, item) => acc + (parseFloat(item.charge) || 0), 0);
  const netTotal = Math.max(0, subtotalCharges - parseFloat(billForm.discount || 0) - parseFloat(billForm.insuranceCoverage || 0));

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newItem.service || !newItem.charge) return;
    setServiceItems([...serviceItems, { id: Date.now(), service: newItem.service, charge: parseFloat(newItem.charge) }]);
    setNewItem({ service: '', charge: '' });
  };

  const handleRemoveService = (id) => {
    setServiceItems(serviceItems.filter((item) => item.id !== id));
  };

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    const newInvoice = {
      id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      uhid: billForm.uhid,
      patient: billForm.patientName,
      services: serviceItems.map((s) => s.service.split(' ')[0]).join(', '),
      charges: subtotalCharges,
      discount: parseFloat(billForm.discount || 0),
      insurance: parseFloat(billForm.insuranceCoverage || 0),
      total: netTotal,
      status: billForm.paymentStatus,
      date: 'Just Now'
    };

    setInvoices([newInvoice, ...invoices]);
    setSelectedInvoiceForPrint(newInvoice);
    alert(`Invoice ${newInvoice.id} created successfully for ${newInvoice.patient}! Net Total: ₹ ${newInvoice.total}`);
    setActiveTab('overview');
  };

  const filteredInvoices = invoices.filter((inv) =>
    inv.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.uhid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Banner */}
      <div
        className="shos-card"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
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
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Receipt size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Hospital Revenue & Patient Billing Desk
              </h2>
              <Badge variant="teal">Cashless TPA Gateway Online</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '4px 0 0' }}>
              Phase 23 Operations • Itemized Invoicing, Concessions, Insurance Claims & Payment Processing
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => setActiveTab(activeTab === 'create_bill' ? 'overview' : 'create_bill')}
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            fontWeight: 800,
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {activeTab === 'create_bill' ? 'View Invoices Ledger' : '+ Create Patient Invoice'}
        </Button>
      </div>

      {/* Exact 4 Billing Dashboard Metrics specified by user:
          - Pending Bills
          - Today's Collection
          - Unpaid Invoices
          - Insurance Claims
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16
        }}
      >
        {[
          { title: 'Pending Bills', val: metrics.pendingBills, sub: metrics.pendingAmount, color: 'var(--color-warning)', bg: 'var(--color-warning-subtle)', icon: Clock },
          { title: "Today's Collection", val: metrics.todaysCollection, sub: 'Cash, Cards, UPI & POS', color: 'var(--color-success)', bg: 'var(--color-success-subtle)', icon: DollarSign },
          { title: 'Unpaid Invoices', val: metrics.unpaidInvoices, sub: 'Due > 48 hours post-discharge', color: 'var(--color-critical)', bg: 'var(--color-critical-subtle)', icon: AlertCircle },
          { title: 'Insurance Claims', val: metrics.insuranceClaims, sub: 'Awaiting Star Health & TPA', color: 'var(--color-primary)', bg: 'var(--color-primary-subtle)', icon: ShieldCheck }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="shos-card hover-lift"
              style={{
                padding: '20px 18px',
                backgroundColor: 'var(--color-surface)',
                borderLeft: `4px solid ${m.color}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.title}
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', margin: '4px 0 2px', fontFamily: 'var(--font-mono)' }}>
                  {m.val}
                </div>
                <span style={{ fontSize: '0.74rem', color: m.color, fontWeight: 600 }}>
                  {m.sub}
                </span>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: m.bg,
                  color: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Screen 1: Itemized Billing Generator Form matching User Spec:
          - Patient
          - Services
          - Charges
          - Discount
          - Insurance
          - Total
          - Payment Status
      */}
      {activeTab === 'create_bill' && (
        <form onSubmit={handleGenerateInvoice} className="shos-card animate-fade-in" style={{ padding: 26, backgroundColor: 'var(--color-surface)', border: '1.5px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 18 }}>
            Patient Billing & Invoice Calculator (Phase 23 Specification)
          </h3>

          {/* 1. Patient Details Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              backgroundColor: 'var(--color-surface)',
              padding: 16,
              borderRadius: 'var(--radius-md)',
              marginBottom: 20
            }}
          >
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>
                Patient Name
              </label>
              <input
                type="text"
                className="shos-input"
                value={billForm.patientName}
                onChange={(e) => setBillForm({ ...billForm, patientName: e.target.value })}
                style={{ width: '100%', fontWeight: 700, backgroundColor: 'var(--color-surface)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>
                UHID / Inpatient ID
              </label>
              <input
                type="text"
                className="shos-input"
                value={billForm.uhid}
                onChange={(e) => setBillForm({ ...billForm, uhid: e.target.value })}
                style={{ width: '100%', fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-surface)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>
                Ward / Bed Allocation
              </label>
              <input
                type="text"
                className="shos-input"
                value={billForm.ward}
                onChange={(e) => setBillForm({ ...billForm, ward: e.target.value })}
                style={{ width: '100%', backgroundColor: 'var(--color-surface)' }}
              />
            </div>
          </div>

          {/* 2. Services & Charges Itemized Table */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 10 }}>
              Itemized Clinical Services & Tariffs ({serviceItems.length} items)
            </h4>

            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>#</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Service / Procedure Description</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Charges (₹)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceItems.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                      <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-text)' }}>{item.service}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        ₹ {item.charge.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-critical)' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add service item row */}
            <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
              <input
                type="text"
                className="shos-input"
                placeholder="Add custom procedure or test name..."
                value={newItem.service}
                onChange={(e) => setNewItem({ ...newItem, service: e.target.value })}
                style={{ flex: 3 }}
              />
              <input
                type="number"
                className="shos-input"
                placeholder="Rate (₹)"
                value={newItem.charge}
                onChange={(e) => setNewItem({ ...newItem, charge: e.target.value })}
                style={{ flex: 1 }}
              />
              <Button type="button" variant="secondary" icon={Plus} onClick={handleAddService}>
                Add Item
              </Button>
            </div>
          </div>

          {/* 3. Calculations Grid: Charges, Discount, Insurance, Total, Payment Status */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
              backgroundColor: 'var(--color-surface)',
              padding: 20,
              borderRadius: 'var(--radius-md)',
              marginBottom: 20
            }}
          >
            {/* Charges */}
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Charges (Subtotal)
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', marginTop: 4 }}>
                ₹ {subtotalCharges.toFixed(2)}
              </div>
            </div>

            {/* Discount */}
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Discount (₹)
              </label>
              <input
                type="number"
                className="shos-input"
                value={billForm.discount}
                onChange={(e) => setBillForm({ ...billForm, discount: e.target.value })}
                style={{ width: '100%', marginTop: 4, fontWeight: 700, color: 'var(--color-success)', backgroundColor: 'var(--color-surface)' }}
              />
            </div>

            {/* Insurance */}
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Insurance / TPA (₹)
              </label>
              <input
                type="number"
                className="shos-input"
                value={billForm.insuranceCoverage}
                onChange={(e) => setBillForm({ ...billForm, insuranceCoverage: e.target.value })}
                style={{ width: '100%', marginTop: 4, fontWeight: 700, color: 'var(--color-primary)', backgroundColor: 'var(--color-surface)' }}
              />
            </div>

            {/* Total (Net Payable) */}
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Net Total Due (₹)
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-critical)', marginTop: 4 }}>
                ₹ {netTotal.toFixed(2)}
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Payment Status
              </label>
              <select
                className="shos-input"
                value={billForm.paymentStatus}
                onChange={(e) => setBillForm({ ...billForm, paymentStatus: e.target.value })}
                style={{ width: '100%', marginTop: 4, fontWeight: 700 }}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid (Full Settlement)</option>
                <option value="Partial">Partially Paid</option>
                <option value="Insurance Claimed">Insurance Claimed (Cashless)</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button type="button" variant="outline" onClick={() => setActiveTab('overview')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Receipt} size="lg" style={{ fontWeight: 800 }}>
              Generate GST Invoice & Save
            </Button>
          </div>
        </form>
      )}

      {/* Screen 2: Invoices Ledger Table */}
      <div className="shos-card" style={{ padding: 24, backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Recent Patient Billing Ledger
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Real-time audit trail of generated invoices and settlements
            </p>
          </div>

          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="shos-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice, patient, UHID..."
              style={{ paddingLeft: 30, width: '100%', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Invoice ID</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Patient</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Services</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Charges</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Discount</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Insurance</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Total Due</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Payment Status</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {inv.id}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <strong style={{ display: 'block', color: 'var(--color-text)' }}>{inv.patient}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{inv.uhid}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>
                    {inv.services}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    ₹ {inv.charges}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>
                    - ₹ {inv.discount}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                    - ₹ {inv.insurance}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-text)' }}>
                    ₹ {inv.total}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'teal'}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Printer}
                      onClick={() => alert(`Printing official tax invoice for ${inv.id} (${inv.patient}).`)}
                    >
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
