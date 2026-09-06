// Super Admin Financial Intelligence & Enterprise Oversight View
// Displays live hospital financial transactions, revenue streams, payment modes, and admin governance audit

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const FinancialIntelligenceView = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFinance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/finance/overview');
      const json = await res.json();
      if (json.success && json.data) {
        setFinancialData(json.data);
      }
    } catch (e) {
      console.log('[FinancialIntelligence] Backend offline, using initial enterprise ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
    const interval = setInterval(fetchFinance, 10000);
    return () => clearInterval(interval);
  }, []);

  const metrics = financialData?.metrics || {
    totalGross: 170400,
    totalSettled: 153400,
    totalInsurance: 148250,
    totalOutOfPocket: 22150,
    transactionCount: 4,
    averageTicketSize: 42600,
  };

  const transactions = financialData?.transactions || [];
  const departmentWise = financialData?.departmentWise || [
    { dept: 'Cardiology', revenue: 20750, share: '12.2%' },
    { dept: 'Emergency & ICU', revenue: 145000, share: '85.1%' },
    { dept: 'General Medicine', revenue: 2800, share: '1.6%' },
    { dept: 'Pulmonology', revenue: 1850, share: '1.1%' },
  ];
  const paymentModes = financialData?.paymentModes || [
    { mode: 'Cashless TPA / Insurance', amount: 148250, percentage: 87.0 },
    { mode: 'UPI & NetBanking', amount: 18000, percentage: 10.6 },
    { mode: 'Credit / Debit Card', amount: 2800, percentage: 1.6 },
    { mode: 'Direct Cash OPD', amount: 1350, percentage: 0.8 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Executive Financial Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Gross Revenue (Total Billed)</span>
            <DollarSign size={17} style={{ color: '#059669' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', margin: '8px 0' }}>
            ₹ {metrics.totalGross?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
            ↑ 14.8% vs last billing cycle
          </div>
        </div>

        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Insurance / TPA Payouts</span>
            <ShieldCheck size={17} style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#0284c7', margin: '8px 0' }}>
            ₹ {metrics.totalInsurance?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            Star Health, HDFC Ergo, CGHS
          </div>
        </div>

        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Direct Patient Collections</span>
            <CreditCard size={17} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#8b5cf6', margin: '8px 0' }}>
            ₹ {metrics.totalOutOfPocket?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            UPI, Cards & Cash Co-pay
          </div>
        </div>

        <div className="shos-card" style={{ padding: 20, borderLeft: '5px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Settled Realized Ratio</span>
            <TrendingUp size={17} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#f59e0b', margin: '8px 0' }}>
            {Math.round((metrics.totalSettled / (metrics.totalGross || 1)) * 100)}%
          </div>
          <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>
            Zero bad-debt default
          </div>
        </div>
      </div>

      {/* Revenue Breakdown by Department and Payment Instrument */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        <Card title="Departmental Revenue Contribution" subtitle="Gross operational clinical inflow distribution">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {departmentWise.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>{d.dept}</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Contribution: {d.share}</div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0284c7' }}>
                  ₹ {d.revenue?.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Payment Instrument & Settlement Gateway" subtitle="Direct clearing via UPI, Banking switch, and TPA">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paymentModes.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>{p.mode}</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>Share: {p.percentage}%</div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669' }}>
                  ₹ {p.amount?.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Financial Transactions Audit Trail */}
      <Card
        title="Live Institutional Financial Transactions Audit Stream"
        subtitle="Unfiltered real-time transaction ledger with payment gateway references & patient UHID"
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Txn ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Invoice Ref</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Patient & UHID</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Department & Service</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Gross Amount</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Payment Instrument</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Timestamp</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {txn.id}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {txn.invoiceId}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <strong style={{ color: 'var(--color-text)' }}>{txn.patientName}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {txn.uhid}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{txn.department}</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>{txn.service}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#059669', fontSize: '0.9rem' }}>
                    ₹ {txn.grossAmount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem' }}>
                    <strong>{txn.mode}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Ref: {txn.gatewayRef}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {txn.timestamp}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <Badge variant={txn.status === 'Settled' ? 'success' : 'warning'}>
                      {txn.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
