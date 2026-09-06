import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  Smartphone,
  Wallet
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';

export const BillsAndPayments = () => {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [isPaid, setIsPaid] = useState(false);

  // Line items breakdown matching user specification:
  // Consultation, Lab, Medicine, Room, Procedure, Emergency
  const billItems = [
    { category: 'Consultation', description: 'OPD Senior Specialist Consultation (Dr. Vivek Mehra)', amount: 800.00 },
    { category: 'Lab & Pathology', description: 'Comprehensive Lipid Profile & Liver Function Panel', amount: 1200.00 },
    { category: 'Medicine', description: 'Outpatient Pharmacy Dispensation (Atorvastatin, Amlodipine, Paracetamol)', amount: 650.00 },
    { category: 'Room', description: 'Day Care Observation Bed (3 Hours)', amount: 900.00 },
    { category: 'Procedure', description: '12-Lead Electrocardiogram (ECG) & Blood Pressure Profiling', amount: 450.00 },
    { category: 'Emergency', description: 'Trauma Triage & Nursing Care Assessment', amount: 350.00 }
  ];

  const subtotal = billItems.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.05; // 5% Healthcare Service Tax
  const discount = 200.00; // Hospital Senior / Member concession
  const insuranceCover = 2500.00; // Star Health TPA cashless pre-authorization
  const netTotal = isPaid ? 0.00 : Math.max(0, subtotal + tax - discount - insuranceCover);

  const handleSimulatePayment = () => {
    setIsPaid(true);
    setPayModalOpen(false);
  };

  const printAndDownloadInvoice = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for SHOS Hospital Portal to view and print your Tax Invoice.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SHOS GST Tax Invoice - SHOS-INV-2026-9901</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #1e293b; background: #fff; }
          .header { border-bottom: 3px solid #1e40af; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .hospital-title { font-size: 20px; font-weight: 900; color: #1e40af; text-transform: uppercase; }
          .hospital-sub { font-size: 11px; color: #0f766e; font-weight: bold; margin-top: 2px; }
          .hospital-addr { font-size: 10px; color: #64748b; }
          .invoice-tag { font-size: 14px; font-weight: 900; color: #1e40af; }
          .meta-box { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 11px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; }
          .meta-val { font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 2px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          .table th { background: #f1f5f9; text-align: left; padding: 8px 10px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
          .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .total-box { margin-left: auto; width: 340px; margin-top: 14px; }
          .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
          .grand-total { border-top: 2px solid #1e40af; margin-top: 6px; padding-top: 8px; font-size: 16px; font-weight: 900; color: #1e40af; }
          .footer-section { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; }
          .auth-box { text-align: right; }
          .sign-script { font-size: 16px; font-weight: bold; font-family: cursive; color: #0f172a; }
          .sign-line { width: 180px; height: 1px; background: #64748b; margin: 4px 0 4px auto; }
          .sign-title { font-size: 11px; font-weight: bold; color: #1e40af; }
          .sign-meta { font-size: 10px; color: #64748b; }
          .disclaimer { font-size: 9px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
          @media print {
            .no-print { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-title">🏥 SHOS MULTISPECIALTY HOSPITAL</div>
            <div class="hospital-sub">Official Healthcare GST Tax Invoice & Billing Receipt</div>
            <div class="hospital-addr">Plot 42, Health City, New Delhi - 110001 | GSTIN: 07AAAAA0000A1Z5 | Phone: 011-23456789</div>
          </div>
          <div style="text-align: right;">
            <div class="invoice-tag">ORIGINAL TAX INVOICE</div>
            <div style="font-size: 10px; color: #64748b;">Invoice #: SHOS-INV-2026-9901</div>
          </div>
        </div>

        <div class="meta-box">
          <div class="meta-item">
            <span class="meta-label">Patient Name</span>
            <span class="meta-val">Rahul Sharma</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">UHID / MRN</span>
            <span class="meta-val">SHOS-2026-90214</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Billing Date</span>
            <span class="meta-val">05 Sep 2026</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Payment Status</span>
            <span class="meta-val" style="color: ${isPaid ? '#16a34a' : '#d97706'}">${isPaid ? 'PAID & SETTLED' : 'PENDING'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Treating Dept</span>
            <span class="meta-val">Cardiology OPD</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">TPA / Insurance</span>
            <span class="meta-val">Star Health Comprehensive</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Claim Approval No.</span>
            <span class="meta-val">SH-TPA-98124</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Place of Supply</span>
            <span class="meta-val">Delhi (07)</span>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Service Category</th>
              <th>Itemized Description</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${billItems.map(item => `
              <tr>
                <td><strong>${item.category}</strong></td>
                <td>${item.description}</td>
                <td style="text-align: right; font-weight: bold;">₹ ${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row">
            <span>Subtotal</span>
            <span>₹ ${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Healthcare Service Tax (GST 5%)</span>
            <span>+ ₹ ${tax.toFixed(2)}</span>
          </div>
          <div class="total-row" style="color: #16a34a;">
            <span>Hospital Concession / Discount</span>
            <span>- ₹ ${discount.toFixed(2)}</span>
          </div>
          <div class="total-row" style="color: #0284c7;">
            <span>TPA / Cashless Insurance Settled</span>
            <span>- ₹ ${insuranceCover.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Payable</span>
            <span>₹ ${netTotal.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer-section">
          <div>
            <div style="font-size: 10px; color: #64748b;">GST Digital Invoice Token</div>
            <div style="display: inline-block; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-family: monospace; font-size: 9px; background: #f8fafc; margin-top: 4px;">
              [IRN: e71a82f0918cb092a15f928e19b88301]
            </div>
            <div style="font-size: 9px; color: #94a3b8; margin-top: 4px;">Digitally Signed as per GST E-Invoice Mandate</div>
          </div>
          <div class="auth-box">
            <div class="sign-script">K. L. Sharma</div>
            <div class="sign-line"></div>
            <div class="sign-title">Authorized Accounts Officer</div>
            <div class="sign-meta">SHOS Revenue & Patient Financial Services</div>
          </div>
        </div>

        <div class="disclaimer">
          This is an electronically generated and digitally authenticated hospital tax invoice. Received with thanks from Rahul Sharma.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Hospital Invoices & Billing Desk
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Transparent itemized medical expenses, TPA cashless claims, and online payment settlement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={printAndDownloadInvoice}
          >
            Download Invoice
          </Button>
          {!isPaid && (
            <Button
              variant="primary"
              size="sm"
              icon={CreditCard}
              onClick={() => setPayModalOpen(true)}
            >
              Pay Now (₹ {netTotal.toFixed(2)})
            </Button>
          )}
        </div>
      </div>

      {/* Main Invoice Card */}
      <div
        className="shos-card animate-fade-in"
        style={{
          padding: '28px 32px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Receipt size={24} style={{ color: 'var(--color-primary)' }} />
              <strong style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>
                Tax Invoice #SHOS-INV-2026-9901
              </strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
              Billing Cycle: <strong>05 Sep 2026</strong> • Patient: <strong>Rahul Sharma (UHID-90214)</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <StatusBadge status={isPaid ? 'Settled' : 'Pending Payment'} />
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
              Cashless TPA: <strong>Star Health Approved</strong>
            </div>
          </div>
        </div>

        {/* 6 Category Breakdown Table */}
        <div style={{ marginBottom: 24, overflowX: 'auto' }}>
          <table className="shos-table">
            <thead>
              <tr>
                <th>Service Category</th>
                <th>Itemized Description</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <Badge variant="primary" size="sm">{item.category}</Badge>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{item.description}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ₹ {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary UI (Subtotal, Tax, Discount, Insurance, Total) */}
        <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>GST / Healthcare Service Tax (5%)</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>+ ₹ {tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
              <span>Hospital Concession / Discount</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>- ₹ {discount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary)' }}>
              <span>Insurance / TPA Coverage</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>- ₹ {insuranceCover.toFixed(2)}</span>
            </div>

            <div
              style={{
                borderTop: '2px solid var(--color-primary)',
                paddingTop: 10,
                marginTop: 4,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--color-primary)'
              }}
            >
              <span>Total Payable</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹ {netTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Now Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Complete Medical Payment"
        maxWidth={480}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 14, backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Amount Due After Insurance Deductions
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
              ₹ {netTotal.toFixed(2)}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
              Select Payment Gateway / Method:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  border: selectedPaymentMethod === 'upi' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={() => setSelectedPaymentMethod('upi')}
                />
                <Smartphone size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>UPI (GPay / PhonePe / Paytm / BHIM)</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  border: selectedPaymentMethod === 'card' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => setSelectedPaymentMethod('card')}
                />
                <CreditCard size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Debit / Credit Card (Visa / Mastercard / RuPay)</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  border: selectedPaymentMethod === 'counter' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPaymentMethod === 'counter'}
                  onChange={() => setSelectedPaymentMethod('counter')}
                />
                <Building2 size={18} style={{ color: 'var(--color-secondary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pay Cash / POS at Hospital Billing Counter</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button variant="outline" size="sm" onClick={() => setPayModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" size="md" icon={CheckCircle2} onClick={handleSimulatePayment}>
              Confirm & Pay ₹ {netTotal.toFixed(2)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
