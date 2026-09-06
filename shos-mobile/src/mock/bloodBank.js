// Mock Blood Bank Inventory & Donor Registry

export const MOCK_BLOOD_BANK = {
  inventory: [
    { group: 'A+', units: 24, status: 'Adequate', expiringIn7Days: 2 },
    { group: 'A-', units: 6, status: 'Low', expiringIn7Days: 0 },
    { group: 'B+', units: 32, status: 'Optimal', expiringIn7Days: 3 },
    { group: 'B-', units: 8, status: 'Low', expiringIn7Days: 1 },
    { group: 'O+', units: 45, status: 'Optimal', expiringIn7Days: 4 },
    { group: 'O-', units: 4, status: 'Critical Low', expiringIn7Days: 0 }, // Universal Donor Alert
    { group: 'AB+', units: 18, status: 'Adequate', expiringIn7Days: 2 },
    { group: 'AB-', units: 3, status: 'Critical Low', expiringIn7Days: 0 },
  ],
  totalUnitsAvailable: 140,
  activeUrgentRequests: [
    {
      id: 'BLD-REQ-01',
      patientName: 'Gopal Krishna Menon (UHID-7821)',
      group: 'A+',
      unitsRequested: 2,
      priority: 'STAT (Cardiac OT Standby)',
      status: 'Reserved',
      requestedBy: 'Dr. Vikram Malhotra',
      time: '09:15 AM',
    },
    {
      id: 'BLD-REQ-02',
      patientName: 'Trauma Bay Inflow (Poly-trauma)',
      group: 'O-',
      unitsRequested: 4,
      priority: 'CRITICAL STAT',
      status: 'Dispatched',
      requestedBy: 'Dr. Sameer Khan',
      time: '10:30 AM',
    },
  ],
  recentDonations: [
    { donor: 'Amit Singhal', group: 'O+', units: 1, date: '2026-09-05', screening: 'Passed (HIV, Hep-B, Hep-C Negative)' },
    { donor: 'Kunal Joshi', group: 'B+', units: 1, date: '2026-09-04', screening: 'Passed' },
  ],
};

export default MOCK_BLOOD_BANK;
