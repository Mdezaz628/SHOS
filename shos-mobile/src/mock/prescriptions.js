// Mock Prescriptions

export const MOCK_PRESCRIPTIONS = [
  {
    id: 'RX-8841',
    rxNumber: 'SHOS-RX-2026-08841',
    patientId: 'P-101',
    patientName: 'Rahul Sharma',
    uhid: 'SHOS-2026-8942',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Vikram Malhotra',
    doctorDesignation: 'Sr. Consultant Cardiologist',
    date: '2026-09-04',
    diagnosis: 'Post Percutaneous Coronary Intervention (PCI) • Dyslipidemia',
    status: 'Active',
    items: [
      {
        medicine: 'Tab. Atorvastatin 20mg',
        dosage: '1 Tablet',
        frequency: '0 - 0 - 1 (Night)',
        timing: 'After Food (Post-dinner)',
        duration: '90 Days',
        quantity: 90,
        dispensed: true,
      },
      {
        medicine: 'Tab. Metoprolol Tartrate 25mg',
        dosage: '1 Tablet',
        frequency: '1 - 0 - 1 (Morning & Evening)',
        timing: 'After Food',
        duration: '90 Days',
        quantity: 180,
        dispensed: true,
      },
      {
        medicine: 'Tab. Ecosprin 75mg (Aspirin)',
        dosage: '1 Tablet',
        frequency: '0 - 1 - 0 (Afternoon)',
        timing: 'Immediately after lunch',
        duration: '180 Days',
        quantity: 180,
        dispensed: true,
      },
      {
        medicine: 'Tab. Pantoprazole 40mg',
        dosage: '1 Tablet',
        frequency: '1 - 0 - 0 (Morning)',
        timing: 'Empty Stomach (30 mins before breakfast)',
        duration: '30 Days',
        quantity: 30,
        dispensed: true,
      }
    ],
    instructions: 'Follow low-sodium, heart-healthy diet. Avoid heavy strenuous weight-lifting. Monitor blood pressure twice weekly.',
    nextFollowUp: '2026-10-04 (1 Month)',
  },
  {
    id: 'RX-8842',
    rxNumber: 'SHOS-RX-2026-08842',
    patientId: 'P-102',
    patientName: 'Ananya Deshmukh',
    uhid: 'SHOS-2026-9014',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Ananya Sen',
    doctorDesignation: 'Chief Pulmonologist',
    date: '2026-09-06',
    diagnosis: 'Acute Bronchospasm • Allergic Asthma Exacerbation',
    status: 'Pending Dispensation',
    items: [
      {
        medicine: 'Inhaler Budecort 200 (Budesonide)',
        dosage: '2 Puffs',
        frequency: '1 - 0 - 1 (Twice daily)',
        timing: 'Rinse mouth after inhalation',
        duration: '30 Days',
        quantity: 1,
        dispensed: false,
      },
      {
        medicine: 'Tab. Montelukast 10mg + Levocetirizine 5mg',
        dosage: '1 Tablet',
        frequency: '0 - 0 - 1 (Bedtime)',
        timing: 'After dinner',
        duration: '15 Days',
        quantity: 15,
        dispensed: false,
      }
    ],
    instructions: 'Steam inhalation twice daily. Avoid cold food and dust exposure.',
    nextFollowUp: '2026-09-20 (2 Weeks)',
  }
];

export default MOCK_PRESCRIPTIONS;
