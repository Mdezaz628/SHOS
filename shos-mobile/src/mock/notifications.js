// Mock Notification Center Stream

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'Appointment Token Called',
    message: 'Token #24: Please proceed to OPD Room 204 for consultation with Dr. Vikram Malhotra.',
    category: 'Appointment',
    priority: 'High',
    time: '2 mins ago',
    read: false,
    roleTarget: 'patient',
  },
  {
    id: 'NOTIF-02',
    title: 'Lab Investigation Verified',
    message: 'Complete Blood Count (CBC) report is now ready for viewing and digital download.',
    category: 'Laboratory',
    priority: 'Normal',
    time: '45 mins ago',
    read: false,
    roleTarget: 'patient',
  },
  {
    id: 'NOTIF-03',
    title: 'Emergency STAT: Influx Alert',
    message: 'Trauma Bay: Level 1 poly-trauma incoming via Ambulance #08. ETA 8 mins.',
    category: 'Emergency',
    priority: 'Critical',
    time: '5 mins ago',
    read: false,
    roleTarget: 'doctor',
  },
  {
    id: 'NOTIF-04',
    title: 'AI Recommendation Pending Approval',
    message: 'M03-BED-OCCUPANCY: Recommendation to pre-allocate 8 HDU beds due to surge prediction.',
    category: 'AI Operational',
    priority: 'High',
    time: '1 hour ago',
    read: false,
    roleTarget: 'admin',
  },
  {
    id: 'NOTIF-05',
    title: 'Low Stock Alert: ICU Vasopressor',
    message: 'Inj. Noradrenaline 4mg is below reorder threshold (12 ampoules remaining).',
    category: 'Pharmacy',
    priority: 'High',
    time: '2 hours ago',
    read: true,
    roleTarget: 'pharmacy',
  },
  {
    id: 'NOTIF-06',
    title: 'Shift Shortage Alert',
    message: 'Night Shift ICU Nurse shortage detected (-3 nurses). Roster reassignment suggested.',
    category: 'HR',
    priority: 'Normal',
    time: '3 hours ago',
    read: true,
    roleTarget: 'hr',
  }
];

export default MOCK_NOTIFICATIONS;
