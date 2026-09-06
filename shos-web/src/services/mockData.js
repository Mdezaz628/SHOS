export const HOSPITAL_INFO = {
  name: 'SHOS Central Multispecialty Hospital',
  location: 'New Delhi, India',
  accreditation: 'NABH & NABL Accredited',
  totalBeds: 250,
  emergencyHotline: '+91 11 2890 0108'
};

export const MOCK_METRICS = {
  activePatients: 184,
  opdTokensToday: 132,
  emergencyAdmissions: 28,
  criticalPatients: 9,
  bedOccupancyRate: 88.4,
  availableBeds: 29,
  activeStaff: 64,
  pendingLabReports: 18,
  lowStockMedicines: 4,
  aiForecastedLoadTomorrow: 144
};

export const MOCK_AI_MODELS = [
  {
    code: 'PATIENT_LOAD_FORECAST',
    name: 'Patient Load Forecasting',
    algorithm: 'Random Forest Regressor',
    r2Score: 0.942,
    mae: 4.12,
    version: '1.0.0',
    prediction: '144 patients tomorrow',
    status: 'Optimal',
    target: 'hospital_patient_load'
  },
  {
    code: 'EMERGENCY_DEMAND_FORECAST',
    name: 'Emergency Demand Forecaster',
    algorithm: 'Random Forest Regressor',
    r2Score: 0.918,
    mae: 3.45,
    version: '1.0.0',
    prediction: '48 emergency cases expected',
    status: 'Optimal',
    target: 'hospital_emergency_department'
  },
  {
    code: 'BED_OCCUPANCY_FORECAST',
    name: 'Bed Occupancy Predictor',
    algorithm: 'Random Forest Regressor',
    r2Score: 0.931,
    mae: 2.18,
    version: '1.0.0',
    prediction: '89.5% occupancy peak (+2 days)',
    status: 'High Alert',
    target: 'hospital_bed_occupancy'
  },
  {
    code: 'STAFF_REQUIREMENT_FORECAST',
    name: 'Staff & Role Optimizer',
    algorithm: 'Multi-Role Random Forest',
    r2Score: 0.895,
    mae: 1.84,
    version: '1.0.0',
    prediction: 'Shortage: 2 Doctors, 4 Nurses',
    status: 'Shortage Warning',
    target: 'hospital_staff_requirement'
  },
  {
    code: 'PHARMACY_DEMAND_FORECAST',
    name: 'Pharmacy Medicine Demand',
    algorithm: 'Random Forest Regressor',
    r2Score: 0.924,
    mae: 8.70,
    version: '1.0.0',
    prediction: '310 units dispensing forecasted',
    status: 'Normal',
    target: 'pharmacy_medicine_demand'
  },
  {
    code: 'LAB_WORKLOAD_FORECAST',
    name: 'Lab Workload & Sample Estimator',
    algorithm: 'Random Forest Regressor',
    r2Score: 0.906,
    mae: 11.20,
    version: '1.0.0',
    prediction: '412 lab tests expected (+2 days)',
    status: 'Heavy Load',
    target: 'lab_workload'
  },
  {
    code: 'NO_SHOW_PREDICTION',
    name: 'Appointment No-Show Classifier',
    algorithm: 'Random Forest Classifier',
    r2Score: 0.884,
    mae: 0.12,
    version: '1.0.0',
    prediction: 'Risk: 14% high-risk no-shows',
    status: 'Active Monitoring',
    target: 'appointment_no_show'
  },
  {
    code: 'ANOMALY_DETECTION',
    name: 'Hospital Operational Anomaly Detection',
    algorithm: 'Isolation Forest',
    r2Score: 0.965,
    mae: 0.04,
    version: '1.0.0',
    prediction: 'No critical operational anomalies',
    status: 'Normal',
    target: 'hospital_operational_anomaly'
  }
];

export const MOCK_AI_RECOMMENDATIONS = [
  {
    id: 1,
    code: 'REC-BED-20260906-01',
    type: 'bed_allocation',
    title: 'Pre-allocate 8 HDU beds to Emergency Ward',
    reasoning: 'Bed occupancy model predicts 89.5% surge in adult respiratory admissions over the next 48 hours.',
    priority: 'High',
    suggestedAction: 'Reassign 4 step-down beds in Ward B and clear 4 planned discharge patients before 11:00 AM.',
    status: 'pending',
    impact: 'Prevents ER bed bottleneck by 65%',
    createdAt: '10 mins ago'
  },
  {
    id: 2,
    code: 'REC-STAFF-20260906-02',
    type: 'staffing',
    title: 'Add 2 Emergency Medical Officers for Night Shift B',
    reasoning: 'Emergency Demand algorithm projects 48 admissions between 8:00 PM and 3:00 AM.',
    priority: 'Critical',
    suggestedAction: 'Deploy Dr. Arvind Sharma and Dr. Priya Sen from OPD pool to Trauma Bay 1 & 2.',
    status: 'pending',
    impact: 'Reduces patient triage wait time from 28m to 9m',
    createdAt: '35 mins ago'
  },
  {
    id: 3,
    code: 'REC-PHARM-20260906-03',
    type: 'inventory',
    title: 'Urgent Restock: Paracetamol IV (100ml) & Ceftriaxone 1g',
    reasoning: 'Pharmacy forecasting indicates stock will hit critical depletion threshold within 36 hours.',
    priority: 'Medium',
    suggestedAction: 'Trigger purchase order to Central Medical Depot for 300 vials of Paracetamol IV.',
    status: 'approved',
    impact: 'Guarantees 100% medication fulfillment rate',
    createdAt: '2 hours ago'
  }
];

export const MOCK_EMERGENCY_CASES = [
  {
    id: 'ER-2026-081',
    patientName: 'Rajesh Malhotra',
    age: 54,
    gender: 'M',
    triageLevel: 'Level 1 - Resuscitation',
    triageColor: 'danger',
    complaint: 'Acute Anterior STEMI, Severe Chest Pain (BP: 85/50)',
    arrivalTime: '10:14 PM',
    assignedDoctor: 'Dr. Vivek Mehra (Cardiology)',
    bay: 'Trauma Bay 1',
    status: 'Under Active CPR / Cath Lab Prep'
  },
  {
    id: 'ER-2026-082',
    patientName: 'Sunita Verma',
    age: 36,
    gender: 'F',
    triageLevel: 'Level 2 - Emergent',
    triageColor: 'warning',
    complaint: 'Severe Polytrauma, Road Accident, Right Femur Fracture',
    arrivalTime: '10:28 PM',
    assignedDoctor: 'Dr. Ananya Nair (Orthopaedics)',
    bay: 'Bay 3',
    status: 'Stabilized, CT Scan Scheduled'
  },
  {
    id: 'ER-2026-083',
    patientName: 'Mohd. Imran',
    age: 68,
    gender: 'M',
    triageLevel: 'Level 2 - Emergent',
    triageColor: 'warning',
    complaint: 'Acute Exacerbation of COPD, SpO2 81% on room air',
    arrivalTime: '10:45 PM',
    assignedDoctor: 'Dr. S. K. Gupta (Pulmonology)',
    bay: 'Oxygen Bay 4',
    status: 'High-Flow Nasal Cannula Started'
  },
  {
    id: 'ER-2026-084',
    patientName: 'Aarav Patel',
    age: 7,
    gender: 'M',
    triageLevel: 'Level 3 - Urgent',
    triageColor: 'primary',
    complaint: 'High-grade fever (103.4°F), Dehydration, Febrile Seizure',
    arrivalTime: '11:02 PM',
    assignedDoctor: 'Dr. Meenakshi Rao (Pediatrics)',
    bay: 'Pediatric Bay 1',
    status: 'IV Paracetamol administered'
  }
];

export const MOCK_AMBULANCES = [
  { id: 'AMB-01', driver: 'Manoj Kumar', type: 'Advanced Life Support (ALS)', status: 'On Route (ETA 6 mins)', patient: 'Cardiac Arrest', location: 'Ring Road Flyover' },
  { id: 'AMB-02', driver: 'Suraj Singh', type: 'Basic Life Support (BLS)', status: 'Stationed at Bay', patient: 'Available', location: 'Emergency Portico' },
  { id: 'AMB-03', driver: 'Kailash Joshi', type: 'Advanced Life Support (ALS)', status: 'Returning to Base', patient: 'Patient Delivered', location: 'South Extension' },
  { id: 'AMB-04', driver: 'Vikram Negi', type: 'Neonatal ICU Transport', status: 'Stationed at Bay', patient: 'Available', location: 'Emergency Portico' }
];

export const MOCK_WARDS = [
  {
    name: 'Intensive Care Unit (ICU)',
    total: 30,
    occupied: 28,
    type: 'Critical Care',
    nurseRatio: '1:1',
    beds: [
      { id: 'ICU-101', patient: 'Rajiv Sengupta (62/M)', status: 'Occupied', condition: 'Critical', ventilator: true },
      { id: 'ICU-102', patient: 'Anita Deshmukh (48/F)', status: 'Occupied', condition: 'Guarded', ventilator: false },
      { id: 'ICU-103', patient: null, status: 'Available', condition: 'Sanitized', ventilator: true },
      { id: 'ICU-104', patient: 'Harish Saxena (71/M)', status: 'Occupied', condition: 'Critical', ventilator: true },
      { id: 'ICU-105', patient: null, status: 'Reserved (Pre-Op)', condition: 'Sterilizing', ventilator: true },
      { id: 'ICU-106', patient: 'Deepak Chopra (55/M)', status: 'Occupied', condition: 'Stable', ventilator: false }
    ]
  },
  {
    name: 'High Dependency Unit (HDU)',
    total: 40,
    occupied: 36,
    type: 'Intermediate Care',
    nurseRatio: '1:2',
    beds: [
      { id: 'HDU-201', patient: 'Geeta Kumari (59/F)', status: 'Occupied', condition: 'Moderate', ventilator: false },
      { id: 'HDU-202', patient: 'Rameshwar Lal (64/M)', status: 'Occupied', condition: 'Moderate', ventilator: false },
      { id: 'HDU-203', patient: null, status: 'Available', condition: 'Ready', ventilator: false },
      { id: 'HDU-204', patient: null, status: 'Available', condition: 'Ready', ventilator: false }
    ]
  },
  {
    name: 'General Medical Ward (Male)',
    total: 60,
    occupied: 52,
    type: 'Inpatient',
    nurseRatio: '1:5',
    beds: [
      { id: 'GWM-301', patient: 'Virender Bhasin (42/M)', status: 'Occupied', condition: 'Stable', ventilator: false },
      { id: 'GWM-302', patient: 'Tariq Alvi (38/M)', status: 'Occupied', condition: 'Discharge Pending', ventilator: false }
    ]
  },
  {
    name: 'General Medical Ward (Female)',
    total: 60,
    occupied: 54,
    type: 'Inpatient',
    nurseRatio: '1:5',
    beds: [
      { id: 'GWF-401', patient: 'Pooja Agarwal (29/F)', status: 'Occupied', condition: 'Stable', ventilator: false },
      { id: 'GWF-402', patient: null, status: 'Available', condition: 'Ready', ventilator: false }
    ]
  }
];

export const MOCK_APPOINTMENTS = [
  { token: 'T-101', patient: 'Kavita Chawla', dept: 'Cardiology', doctor: 'Dr. Vivek Mehra', slot: '09:00 AM', status: 'Consulting' },
  { token: 'T-102', patient: 'Arun Bhatnagar', dept: 'Cardiology', doctor: 'Dr. Vivek Mehra', slot: '09:20 AM', status: 'Waiting' },
  { token: 'T-103', patient: 'Prakash Sethi', dept: 'Orthopaedics', doctor: 'Dr. Ananya Nair', slot: '09:15 AM', status: 'Consulting' },
  { token: 'T-104', patient: 'Neelam Kaul', dept: 'Neurology', doctor: 'Dr. Rohan Mathur', slot: '09:30 AM', status: 'Waiting' },
  { token: 'T-105', patient: 'Santosh Devi', dept: 'General Medicine', doctor: 'Dr. Radhika Roy', slot: '09:40 AM', status: 'Waiting' },
  { token: 'T-106', patient: 'Baldev Krishan', dept: 'Cardiology', doctor: 'Dr. Vivek Mehra', slot: '10:00 AM', status: 'Scheduled' }
];

export const MOCK_PHARMACY = [
  { code: 'MED-001', name: 'Paracetamol IV (100ml Infusion)', category: 'Analgesic / Antipyretic', stock: 18, minLevel: 50, unit: 'Bottles', status: 'Critical Low', price: 95 },
  { code: 'MED-002', name: 'Ceftriaxone 1g Injection', category: 'Antibiotic', stock: 24, minLevel: 60, unit: 'Vials', status: 'Low Stock', price: 180 },
  { code: 'MED-003', name: 'Pantoprazole 40mg IV', category: 'GI Protectant', stock: 140, minLevel: 80, unit: 'Vials', status: 'Adequate', price: 65 },
  { code: 'MED-004', name: 'Noradrenaline 4mg Injection', category: 'Vasopressor (ICU)', stock: 32, minLevel: 40, unit: 'Ampoules', status: 'Low Stock', price: 210 },
  { code: 'MED-005', name: 'Insulin Glargine (Lantus 100IU)', category: 'Endocrine', stock: 85, minLevel: 30, unit: 'Pens', status: 'Adequate', price: 680 },
  { code: 'MED-006', name: 'Atorvastatin 20mg Tablets', category: 'Cardiology', stock: 450, minLevel: 100, unit: 'Strips', status: 'Adequate', price: 120 }
];

export const MOCK_LAB_ORDERS = [
  { orderId: 'LAB-901', patient: 'Rajesh Malhotra', test: 'Cardiac Enzymes (Troponin-I, CK-MB)', priority: 'STAT (Emergency)', status: 'Processing', time: '10:20 PM' },
  { orderId: 'LAB-902', patient: 'Sunita Verma', test: 'Complete Blood Count (CBC) + Crossmatch 2 Units', priority: 'Urgent', status: 'Sample Received', time: '10:35 PM' },
  { orderId: 'LAB-903', patient: 'Mohd. Imran', test: 'Arterial Blood Gas (ABG Analysis)', priority: 'STAT (Emergency)', status: 'Report Ready', time: '10:48 PM' },
  { orderId: 'LAB-904', patient: 'Harish Saxena', test: 'Serum Creatinine & Blood Urea Nitrogen', priority: 'Routine', status: 'In Queue', time: '11:00 PM' },
  { orderId: 'LAB-905', patient: 'Anita Deshmukh', test: 'Blood Culture & Sensitivity (Bact/ALERT)', priority: 'Urgent', status: 'Incubating (48h)', time: '09:15 PM' }
];

export const MOCK_STAFF = [
  { id: 'EMP-01', name: 'Dr. Vivek Mehra', role: 'Head of Cardiology', shift: 'Morning + On-Call', department: 'Cardiology', status: 'Active (ER)', patientsAssigned: 14 },
  { id: 'EMP-02', name: 'Dr. Ananya Nair', role: 'Senior Trauma Surgeon', shift: 'Night Shift B', department: 'Trauma & Ortho', status: 'In Surgery', patientsAssigned: 8 },
  { id: 'EMP-03', name: 'Sister Mary Joseph', role: 'ICU Charge Nurse', shift: 'Night Shift B', department: 'Critical Care', status: 'Active', patientsAssigned: 4 },
  { id: 'EMP-04', name: 'Nurse Ritu Sharma', role: 'Triage Staff Nurse', shift: 'Night Shift B', department: 'Emergency Room', status: 'Active', patientsAssigned: 12 },
  { id: 'EMP-05', name: 'Dr. Radhika Roy', role: 'Physician / Intensivist', shift: 'Morning Shift', department: 'General Medicine', status: 'Available', patientsAssigned: 19 },
  { id: 'EMP-06', name: 'Rohan Joshi', role: 'Senior Lab Technologist', shift: 'Night Shift B', department: 'Pathology & Blood Bank', status: 'Active', patientsAssigned: 26 }
];
