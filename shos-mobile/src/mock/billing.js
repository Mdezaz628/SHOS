// Mock Billing Ledger, Invoices & Insurance Claims

export const MOCK_BILLING = [
  {
    id: 'INV-8821',
    invoiceNumber: 'SHOS-INV-2026-08821',
    patientId: 'P-101',
    patientName: 'Rahul Sharma',
    uhid: 'SHOS-2026-8942',
    date: '2026-09-06',
    admissionDate: '2026-09-04',
    ward: 'Cardiology HDU Ward 3 (Bed 04)',
    items: [
      { service: 'HDU Bed Charges (2 Days @ ₹4,500/day)', amount: 9000 },
      { service: 'Specialist Consultation (Dr. Vikram Malhotra)', amount: 2400 },
      { service: 'Pathology Lab Investigations (CBC, Lipid, Troponin)', amount: 3200 },
      { service: 'ECG & Bedside Cardiac Telemetry Monitoring', amount: 1800 },
      { service: 'Pharmacy Consumables & IV Medication', amount: 2850 },
      { service: 'Nursing & Biomedical Care Charges', amount: 1500 },
    ],
    subtotal: 20750,
    tax: 0, // Healthcare exempt in India
    discount: 1000,
    insuranceCovered: 16750,
    insuranceProvider: 'Star Health Comprehensive Gold',
    claimStatus: 'Pre-Approved (Cashless TPA)',
    patientPayable: 3000,
    paymentStatus: 'Paid (Pre-auth settled)',
  },
  {
    id: 'INV-8822',
    invoiceNumber: 'SHOS-INV-2026-08822',
    patientId: 'P-104',
    patientName: 'Sunita Devi',
    uhid: 'SHOS-2026-6412',
    date: '2026-09-06',
    admissionDate: 'Outpatient',
    ward: 'OPD Ortho',
    items: [
      { service: 'Outpatient Consultation (Dr. Rajesh Bhardwaj)', amount: 1500 },
      { service: 'Digital Knee X-Ray (AP & Lateral View)', amount: 900 },
      { service: 'Pharmacy (NSAIDs & Gel)', amount: 450 },
    ],
    subtotal: 2850,
    tax: 0,
    discount: 0,
    insuranceCovered: 0,
    insuranceProvider: 'Direct Outpatient',
    claimStatus: 'Not Claimed',
    patientPayable: 2850,
    paymentStatus: 'Pending at Counter',
  }
];

export const MOCK_BILLING_METRICS = {
  todayCollection: '₹4,82,400',
  pendingBillsCount: 14,
  unpaidAmount: '₹84,200',
  insuranceClaimsPending: 9,
  claimsSettledToday: '₹12,40,000',
};

export default MOCK_BILLING;
