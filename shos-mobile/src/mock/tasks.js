// Mock Clinical & Operational Tasks (Ward Boy, Nurse, Housekeeping)

export const MOCK_TASKS = [
  // Ward Boy / PCA Tasks
  {
    id: 'TSK-WB-01',
    assignedRole: 'wardboy',
    title: 'Wheelchair Transfer to Radiology',
    patientName: 'Sunita Devi (UHID-6412)',
    fromLocation: 'Ortho OPD Room 108',
    toLocation: 'MRI / X-Ray Suite (Basement 1)',
    priority: 'Urgent',
    status: 'In Progress',
    assignedTime: '10:15 AM',
    notes: 'Patient has severe right knee instability. Handle with care.',
  },
  {
    id: 'TSK-WB-02',
    assignedRole: 'wardboy',
    title: 'Blood Sample Transport to Central Lab',
    patientName: 'Gopal Krishna Menon (UHID-7821)',
    fromLocation: 'ICU-B (Floor 2)',
    toLocation: 'Clinical Pathology Central Lab (Floor 1)',
    priority: 'STAT',
    status: 'Assigned',
    assignedTime: '10:25 AM',
    notes: 'Troponin-I STAT sample. Deliver on ice within 10 mins.',
  },
  {
    id: 'TSK-WB-03',
    assignedRole: 'wardboy',
    title: 'Stretcher Shift Post-Surgery',
    patientName: 'Kavita Chawla (UHID-1190)',
    fromLocation: 'OT Suite 3',
    toLocation: 'Post-Op Recovery Ward (Floor 3)',
    priority: 'Normal',
    status: 'Completed',
    assignedTime: '09:00 AM',
    notes: 'Patient stable, vitals normal.',
  },

  // Nursing Tasks
  {
    id: 'TSK-NR-01',
    assignedRole: 'nurse',
    title: 'Hourly Telemetry & Vitals Logging',
    patientName: 'Rahul Sharma (HDU-Bed-04)',
    fromLocation: 'Cardiology HDU Ward 3',
    toLocation: 'Bedside Station',
    priority: 'High',
    status: 'In Progress',
    assignedTime: '10:00 AM',
    notes: 'Monitor BP and SpO2. Doctor requested ECG if pulse > 95 bpm.',
  },
  {
    id: 'TSK-NR-02',
    assignedRole: 'nurse',
    title: 'Administer IV Antibiotic (Ceftriaxone 1g)',
    patientName: 'Gopal Krishna Menon (ICU-02)',
    fromLocation: 'ICU-B Medication Dispenser',
    toLocation: 'Bedside ICU-02',
    priority: 'Urgent',
    status: 'Assigned',
    assignedTime: '11:00 AM',
    notes: 'Check IV cannula patency before infusion.',
  },

  // Housekeeping Tasks
  {
    id: 'TSK-HK-01',
    assignedRole: 'housekeeping',
    title: 'Terminal Disinfection & Sanitization',
    patientName: 'Post-Discharge Room Turnaround',
    fromLocation: 'General Ward Bed GEN-102',
    toLocation: 'Room 102',
    priority: 'High',
    status: 'In Progress',
    assignedTime: '09:45 AM',
    notes: 'Full fogging and fresh linen replacement required before 11 AM.',
  },
  {
    id: 'TSK-HK-02',
    assignedRole: 'housekeeping',
    title: 'Bio-Hazard Waste Bin Clearance',
    patientName: 'Clinical Waste Management',
    fromLocation: 'Trauma Bay & Emergency Minor OT',
    toLocation: 'Central Bio-Medical Waste Vault',
    priority: 'STAT',
    status: 'Assigned',
    assignedTime: '10:30 AM',
    notes: 'Red and Yellow bags clearance mandatory as per PCB norms.',
  }
];

export default MOCK_TASKS;
