import { store } from '../data/store.js';

// Get live financial transactions & enterprise collections
export const getFinancialOverview = async (req, res) => {
  const billing = store.get('billing') || [];
  
  // Create or retrieve ledger
  let transactions = store.get('transactions');
  if (!transactions || transactions.length === 0) {
    transactions = [
      {
        id: 'TXN-9941',
        invoiceId: 'INV-8821',
        patientName: 'Rahul Sharma',
        uhid: 'SHOS-2026-8942',
        department: 'Cardiology HDU',
        service: 'Specialist Consultation & HDU Care',
        grossAmount: 20750,
        insurancePaid: 16750,
        patientPaid: 3000,
        mode: 'UPI (Google Pay)',
        status: 'Settled',
        timestamp: '2026-09-06 11:24:18',
        gatewayRef: 'UPI-AXIS-9821049281',
      },
      {
        id: 'TXN-9942',
        invoiceId: 'INV-8822',
        patientName: 'Meena Kumari',
        uhid: 'SHOS-2026-7781',
        department: 'General Medicine OPD',
        service: 'Consultation & Lab Biochemistry',
        grossAmount: 2800,
        insurancePaid: 0,
        patientPaid: 2800,
        mode: 'Credit Card (HDFC)',
        status: 'Settled',
        timestamp: '2026-09-06 10:45:00',
        gatewayRef: 'CC-HDFC-39218491',
      },
      {
        id: 'TXN-9943',
        invoiceId: 'INV-8823',
        patientName: 'Farida Begum',
        uhid: 'SHOS-2026-5541',
        department: 'Pulmonology',
        service: 'Spirometry & Nebulization Care',
        grossAmount: 1850,
        insurancePaid: 1500,
        patientPaid: 350,
        mode: 'Cashless TPA (Star Health)',
        status: 'Settled',
        timestamp: '2026-09-06 10:12:44',
        gatewayRef: 'TPA-STAR-098231',
      },
      {
        id: 'TXN-9944',
        invoiceId: 'INV-8824',
        patientName: 'Vikramaditya Rao',
        uhid: 'SHOS-2026-1192',
        department: 'Emergency ICU',
        service: 'Emergency PTCA & Stenting Consumables',
        grossAmount: 145000,
        insurancePaid: 130000,
        patientPaid: 15000,
        mode: 'NetBanking / TPA',
        status: 'Pre-Approved / In Clearance',
        timestamp: '2026-09-06 09:30:15',
        gatewayRef: 'NEFT-ICICI-8812903',
      },
    ];
    store.set('transactions', transactions);
  }

  const totalGross = transactions.reduce((sum, t) => sum + (t.grossAmount || 0), 0);
  const totalSettled = transactions
    .filter((t) => t.status === 'Settled')
    .reduce((sum, t) => sum + (t.patientPaid + t.insurancePaid), 0);
  const totalInsurance = transactions.reduce((sum, t) => sum + (t.insurancePaid || 0), 0);
  const totalOutOfPocket = transactions.reduce((sum, t) => sum + (t.patientPaid || 0), 0);

  return res.json({
    success: true,
    data: {
      metrics: {
        totalGross,
        totalSettled,
        totalInsurance,
        totalOutOfPocket,
        transactionCount: transactions.length,
        averageTicketSize: Math.round(totalGross / transactions.length),
      },
      transactions,
      departmentWise: [
        { dept: 'Cardiology', revenue: 20750, share: '12.2%' },
        { dept: 'Emergency & ICU', revenue: 145000, share: '85.1%' },
        { dept: 'General Medicine', revenue: 2800, share: '1.6%' },
        { dept: 'Pulmonology', revenue: 1850, share: '1.1%' },
      ],
      paymentModes: [
        { mode: 'Cashless TPA / Insurance', amount: 148250, percentage: 87.0 },
        { mode: 'UPI & NetBanking', amount: 18000, percentage: 10.6 },
        { mode: 'Credit / Debit Card', amount: 2800, percentage: 1.6 },
        { mode: 'Direct Cash OPD', amount: 1350, percentage: 0.8 },
      ],
    },
  });
};

export const recordTransaction = async (req, res) => {
  const { invoiceId, patientName, uhid, department, service, grossAmount, mode } = req.body;
  
  const newTxn = store.insert('transactions', {
    id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceId: invoiceId || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    patientName: patientName || 'Walk-in Patient',
    uhid: uhid || 'SHOS-2026-0000',
    department: department || 'OPD',
    service: service || 'Hospital Service',
    grossAmount: parseFloat(grossAmount) || 800,
    patientPaid: parseFloat(grossAmount) || 800,
    insurancePaid: 0,
    mode: mode || 'UPI',
    status: 'Settled',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    gatewayRef: `PAY-${Date.now().toString().slice(-8)}`,
  });

  return res.status(201).json({ success: true, message: 'Transaction logged.', data: newTxn });
};
