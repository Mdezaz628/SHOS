// SHOS Unified Hospital Operational Seed Data

export const SEED_DATA = {
  users: [
    { id: 'usr-patient', name: 'Rahul Sharma', email: 'patient@shos.com', role: 'patient', uhid: 'SHOS-2026-8942', phone: '+91 98765 43210' },
    { id: 'usr-doctor', name: 'Dr. Vikram Malhotra', email: 'doctor@shos.com', role: 'doctor', department: 'Cardiology', staffId: 'DOC-102', phone: '+91 98765 43211' },
    { id: 'usr-nurse', name: 'Sister Priya Nair', email: 'nurse@shos.com', role: 'nurse', department: 'Inpatient Ward A', staffId: 'NUR-404', phone: '+91 98765 43212' },
    { id: 'usr-wardboy', name: 'Ramesh Kumar', email: 'wardboy@shos.com', role: 'ward_boy', department: 'Logistics', staffId: 'WB-019', phone: '+91 98765 43213' },
    { id: 'usr-lab', name: 'Anjali Deshmukh', email: 'lab@shos.com', role: 'lab_technician', department: 'Pathology & Diagnostics', staffId: 'LAB-203', phone: '+91 98765 43214' },
    { id: 'usr-pharmacy', name: 'Suresh Patel', email: 'pharmacy@shos.com', role: 'pharmacist', department: 'Central Hospital Pharmacy', staffId: 'PH-308', phone: '+91 98765 43215' },
    { id: 'usr-ambulance', name: 'Rajesh Yadav', email: 'ambulance@shos.com', role: 'ambulance_driver', vehicle: 'KA-01-EQ-9921', staffId: 'AMB-112', phone: '+91 98765 43217' },
    { id: 'usr-housekeeping', name: 'Sunil Paswan', email: 'housekeeping@shos.com', role: 'housekeeping', department: 'Sanitation & Hygiene', staffId: 'HK-502', phone: '+91 98765 43218' },
    { id: 'usr-parking', name: 'Manoj Tiwari', email: 'parking@shos.com', role: 'parking_staff', zone: 'Zone A & B', staffId: 'PRK-04', phone: '+91 98765 43219' },
    { id: 'usr-reception', name: 'Kavita Verma', email: 'reception@shos.com', role: 'receptionist', desk: 'Front Desk #2', staffId: 'REC-101', phone: '+91 98765 43220' },
    { id: 'usr-billing', name: 'Deepak Saxena', email: 'billing@shos.com', role: 'billing_staff', desk: 'TPA & Cash Desk 4', staffId: 'BIL-601', phone: '+91 98765 43221' },
    { id: 'usr-hr', name: 'Arun Iyer', email: 'hr@shos.com', role: 'hr_manager', department: 'Human Resources', staffId: 'HR-801', phone: '+91 98765 43222' },
    { id: 'usr-dept', name: 'Dr. Sunita Rao', email: 'department@shos.com', role: 'department_manager', department: 'Cardiology', staffId: 'HOD-CAR', phone: '+91 98765 43223' },
    { id: 'usr-admin', name: 'Col. Sanjeev Kapoor', email: 'admin@shos.com', role: 'hospital_admin', department: 'Operations Command', staffId: 'ADM-001', phone: '+91 98765 43224' },
    { id: 'usr-superadmin', name: 'Dr. Rajiv Menon', email: 'superadmin@shos.com', role: 'super_admin', department: 'Executive Directorate', staffId: 'SUP-001', phone: '+91 98765 43225' },
  ],

  patients: [
    { id: 'P-101', name: 'Rahul Sharma', age: 34, gender: 'Male', uhid: 'SHOS-2026-8942', phone: '+91 98765 43210', bloodGroup: 'O+', status: 'waiting', tokenNumber: 24, triage: 'urgent', chiefComplaint: 'Chest tightness, palpitations post exertion', bedNumber: 'Ward A - Bed 04' },
    { id: 'P-102', name: 'Meena Kumari', age: 48, gender: 'Female', uhid: 'SHOS-2026-7781', phone: '+91 98765 43233', bloodGroup: 'B+', status: 'in_consultation', tokenNumber: 19, triage: 'urgent', chiefComplaint: 'Persistent hypertension & vertigo' },
    { id: 'P-103', name: 'Vikramaditya Rao', age: 62, gender: 'Male', uhid: 'SHOS-2026-1192', phone: '+91 98765 43234', bloodGroup: 'A+', status: 'admitted', tokenNumber: 12, triage: 'critical', chiefComplaint: 'Acute coronary syndrome, post PTCA stenting', bedNumber: 'ICU Bed 02' },
    { id: 'P-104', name: 'Farida Begum', age: 29, gender: 'Female', uhid: 'SHOS-2026-5541', phone: '+91 98765 43235', bloodGroup: 'AB+', status: 'waiting', tokenNumber: 22, triage: 'stable', chiefComplaint: 'Dyspnea & intermittent wheezing' },
  ],

  doctors: [
    { id: 'DOC-102', name: 'Dr. Vikram Malhotra', specialty: 'Interventional Cardiology', department: 'Cardiology', experience: '16 Years', qualification: 'MD, DM (Cardiology), FACC', rating: 4.9, availableToday: true, opdRoom: 'OPD-204', currentToken: 19 },
    { id: 'DOC-105', name: 'Dr. Sunita Rao', specialty: 'Neurology', department: 'Neurology', experience: '14 Years', qualification: 'MD, DM (Neurology)', rating: 4.8, availableToday: true, opdRoom: 'OPD-108', currentToken: 14 },
    { id: 'DOC-108', name: 'Dr. Rajesh Bhardwaj', specialty: 'Orthopedics & Joint Replacement', department: 'Orthopedics', experience: '19 Years', qualification: 'MS (Ortho), M.Ch (UK)', rating: 4.9, availableToday: true, opdRoom: 'OPD-312', currentToken: 8 },
    { id: 'DOC-110', name: 'Dr. Meera Nambiar', specialty: 'General Internal Medicine', department: 'General Medicine', experience: '11 Years', qualification: 'MD (Gen Med)', rating: 4.7, availableToday: true, opdRoom: 'OPD-101', currentToken: 25 },
  ],

  appointments: [
    { id: 'APP-901', patientId: 'P-101', patientName: 'Rahul Sharma', doctorId: 'DOC-102', doctorName: 'Dr. Vikram Malhotra', department: 'Cardiology', opdRoom: 'OPD-204', date: '2026-09-06', timeSlot: '11:30 AM', tokenNumber: 24, status: 'Confirmed' },
    { id: 'APP-902', patientId: 'P-102', patientName: 'Meena Kumari', doctorId: 'DOC-102', doctorName: 'Dr. Vikram Malhotra', department: 'Cardiology', opdRoom: 'OPD-204', date: '2026-09-06', timeSlot: '10:45 AM', tokenNumber: 19, status: 'In Consultation' },
    { id: 'APP-903', patientId: 'P-104', patientName: 'Farida Begum', doctorId: 'DOC-110', doctorName: 'Dr. Meera Nambiar', department: 'General Medicine', opdRoom: 'OPD-101', date: '2026-09-06', timeSlot: '12:15 PM', tokenNumber: 28, status: 'Confirmed' },
  ],

  queue: {
    department: 'Cardiology OPD',
    doctorName: 'Dr. Vikram Malhotra',
    opdRoom: 'OPD Room 204',
    currentServingToken: 19,
    userToken: 24,
    peopleAhead: 5,
    estimatedWaitMinutes: 35,
    averageConsultTimeMins: 7,
    queueStatus: 'Flowing Normally',
    activeTokensList: [
      { token: 19, uhid: 'SHOS-2026-3392', patient: 'Deepak Saxena', status: 'In Consultation' },
      { token: 20, uhid: 'SHOS-2026-7781', patient: 'Meena Kumari', status: 'Next Up' },
      { token: 21, uhid: 'SHOS-2026-1192', patient: 'Harish Chander', status: 'Waiting' },
      { token: 22, uhid: 'SHOS-2026-5541', patient: 'Farida Begum', status: 'Waiting' },
      { token: 23, uhid: 'SHOS-2026-9022', patient: 'Amitabh Sen', status: 'Waiting' },
      { token: 24, uhid: 'SHOS-2026-8942', patient: 'Rahul Sharma (You)', status: 'Waiting' },
    ],
  },

  beds: [
    { id: 'BED-101', ward: 'Cardiology HDU Ward 3', bedNumber: 'Bed 01', type: 'HDU Bed', status: 'available', chargesPerDay: 4500 },
    { id: 'BED-102', ward: 'Cardiology HDU Ward 3', bedNumber: 'Bed 02', type: 'HDU Bed', status: 'occupied', patientName: 'Sanjay Dutt', uhid: 'SHOS-2026-3321', doctor: 'Dr. Vikram Malhotra', admissionDate: '2026-09-04' },
    { id: 'BED-103', ward: 'Cardiology HDU Ward 3', bedNumber: 'Bed 03', type: 'HDU Bed', status: 'available', chargesPerDay: 4500 },
    { id: 'BED-104', ward: 'Cardiology HDU Ward 3', bedNumber: 'Bed 04', type: 'HDU Bed', status: 'occupied', patientName: 'Rahul Sharma', uhid: 'SHOS-2026-8942', patientId: 'P-101', doctor: 'Dr. Vikram Malhotra', admissionDate: '2026-09-05' },
    { id: 'BED-105', ward: 'Cardiology HDU Ward 3', bedNumber: 'Bed 05', type: 'HDU Bed', status: 'cleaning', chargesPerDay: 4500 },
    { id: 'BED-106', ward: 'Emergency ICU Block', bedNumber: 'ICU 02', type: 'Ventilator ICU', status: 'occupied', patientName: 'Vikramaditya Rao', uhid: 'SHOS-2026-1192', doctor: 'Dr. Sunita Rao', admissionDate: '2026-09-05' },
  ],

  tasks: [
    { id: 'TSK-101', title: 'Wheelchair Transfer to Radiology (CT Scan)', patientName: 'Rahul Sharma', uhid: 'SHOS-2026-8942', location: 'Ward A (Bed 04)', destination: 'Basement 1 CT Suite 2', priority: 'High', status: 'Assigned', time: '11:15 AM' },
    { id: 'TSK-102', title: 'Blood Sample Transport to Central Pathology', patientName: 'Meena Kumari', uhid: 'SHOS-2026-7781', location: 'OPD Room 204', destination: 'Pathology Lab 3rd Floor', priority: 'Urgent', status: 'In Progress', time: '11:00 AM' },
    { id: 'TSK-103', title: 'Bed 05 Terminal Disinfection & Linen Replacement', location: 'Cardiology Ward 3', destination: 'Discharge Turnover', priority: 'Normal', status: 'Accepted', time: '10:45 AM' },
  ],

  labOrders: [
    { id: 'LAB-551', testName: 'High-Sensitivity Troponin-I (Cardiac Biomarker)', patientName: 'Rahul Sharma', uhid: 'SHOS-2026-8942', doctorName: 'Dr. Vikram Malhotra', date: '2026-09-06', status: 'completed', result: '14.2 pg/mL (Normal < 19.8 pg/mL)', flag: 'Normal', verifiedBy: 'Dr. R. K. Sen, MD' },
    { id: 'LAB-552', testName: 'Complete Blood Count with Platelet Histogram', patientName: 'Rahul Sharma', uhid: 'SHOS-2026-8942', doctorName: 'Dr. Vikram Malhotra', date: '2026-09-06', status: 'completed', result: 'Hb: 14.1 g/dL, TLC: 7,800 /mcL, Platelets: 2.35 L/mcL', flag: 'Normal', verifiedBy: 'Dr. R. K. Sen, MD' },
    { id: 'LAB-553', testName: 'Comprehensive Lipid Profile & Lipid Subfractions', patientName: 'Rahul Sharma', uhid: 'SHOS-2026-8942', doctorName: 'Dr. Vikram Malhotra', date: '2026-09-06', status: 'in_progress', result: 'Specimen under automated spectrophotometry analysis', flag: 'Pending' },
  ],

  medicines: [
    { id: 'MED-01', name: 'Tab. Atorvastatin 20mg', generic: 'Atorvastatin Calcium', category: 'Lipid Lowering', stock: 1420, batchNumber: 'ATV-2026-B8', expiryDate: '2027-11', price: 14.50 },
    { id: 'MED-02', name: 'Tab. Telmisartan 40mg', generic: 'Telmisartan IP', category: 'Antihypertensive', stock: 890, batchNumber: 'TEL-2026-C2', expiryDate: '2027-08', price: 9.80 },
    { id: 'MED-03', name: 'Tab. Clopidogrel 75mg', generic: 'Clopidogrel Bisulfate', category: 'Antiplatelet', stock: 32, batchNumber: 'CLP-2025-A1', expiryDate: '2026-10', price: 16.20, lowStock: true },
    { id: 'MED-04', name: 'Inj. Low Molecular Heparin 0.6ml', generic: 'Enoxaparin Sodium', category: 'Anticoagulant', stock: 18, batchNumber: 'ENOX-26-9', expiryDate: '2026-12', price: 420.00, lowStock: true },
  ],

  prescriptions: [
    {
      id: 'RX-7741',
      date: '2026-09-06',
      patientId: 'P-101',
      patientName: 'Rahul Sharma',
      uhid: 'SHOS-2026-8942',
      doctorName: 'Dr. Vikram Malhotra',
      specialty: 'Cardiology',
      diagnosis: 'Sinus Tachycardia with Grade-1 Essential Hypertension',
      status: 'active',
      medicines: [
        { name: 'Tab. Telmisartan 40mg', dosage: '1 Tablet', frequency: 'Once Daily (Morning post breakfast)', duration: '30 Days', instructions: 'Monitor BP weekly' },
        { name: 'Tab. Atorvastatin 20mg', dosage: '1 Tablet', frequency: 'Once Daily (Night after dinner)', duration: '30 Days', instructions: 'Repeat lipid profile post 4 weeks' },
      ],
    },
  ],

  ambulances: [
    { id: 'AMB-01', vehicleNumber: 'KA-01-EQ-9921', driverName: 'Rajesh Yadav', driverPhone: '+91 98765 43217', type: 'Advanced Life Support (ALS) Cardiac Ambulance', status: 'Dispatched', etaMinutes: 8, location: 'Indiranagar 100ft Rd', destination: 'SHOS Main ER Bay 1' },
    { id: 'AMB-02', vehicleNumber: 'KA-01-EQ-8812', driverName: 'Sunil Rathore', driverPhone: '+91 98765 43228', type: 'Basic Life Support (BLS)', status: 'Available', location: 'Hospital Main Gate Bay' },
  ],

  billing: [
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
      tax: 0,
      discount: 1000,
      insuranceCovered: 16750,
      insuranceProvider: 'Star Health Comprehensive Gold',
      claimStatus: 'Pre-Approved (Cashless TPA)',
      patientPayable: 3000,
      paymentStatus: 'paid',
    },
  ],

  staff: [
    { id: 'STF-101', name: 'Dr. Vikram Malhotra', role: 'Senior Consultant', department: 'Cardiology', shift: '08:00 - 16:00', status: 'On Duty', phone: '+91 98765 43211' },
    { id: 'STF-102', name: 'Sister Priya Nair', role: 'Nursing Officer In-Charge', department: 'Inpatient Ward A', shift: '07:00 - 15:00', status: 'On Duty', phone: '+91 98765 43212' },
    { id: 'STF-103', name: 'Anjali Deshmukh', role: 'Senior Lab Technologist', department: 'Pathology', shift: '09:00 - 17:00', status: 'On Duty', phone: '+91 98765 43214' },
    { id: 'STF-104', name: 'Ramesh Kumar', role: 'Patient Care Assistant (PCA)', department: 'Logistics', shift: '06:00 - 14:00', status: 'On Duty', phone: '+91 98765 43213' },
  ],

  bloodBank: [
    { group: 'A+', units: 28, status: 'Adequate', reserved: 4 },
    { group: 'A-', units: 6, status: 'Critical Low', reserved: 2 },
    { group: 'B+', units: 34, status: 'Adequate', reserved: 5 },
    { group: 'B-', units: 8, status: 'Low', reserved: 1 },
    { group: 'O+', units: 42, status: 'Surplus', reserved: 8 },
    { group: 'O-', units: 4, status: 'Critical Low', reserved: 2 },
    { group: 'AB+', units: 14, status: 'Moderate', reserved: 2 },
    { group: 'AB-', units: 3, status: 'Critical Low', reserved: 1 },
  ],

  resources: [
    { id: 'RES-01', name: 'High-End Intensive Care Ventilator (Dräger Evita V800)', category: 'Life Support', location: 'ICU Bed 02', status: 'Allocated', lastService: '2026-08-20' },
    { id: 'RES-02', name: 'Bedside Multipara Patient Monitor (Philips IntelliVue)', category: 'Monitoring', location: 'Ward A Bed 04', status: 'Allocated', lastService: '2026-08-15' },
    { id: 'RES-03', name: 'Digital Syringe Infusion Pump (B. Braun Perfusor)', category: 'Drug Delivery', location: 'Central Biomedical Pool', status: 'Available', lastService: '2026-08-28' },
    { id: 'RES-04', name: 'Mobile C-Arm Digital Fluoroscopy X-Ray Unit', category: 'Radiology', location: 'OT Suite 3', status: 'Available', lastService: '2026-08-10' },
  ],

  parking: {
    totalSlots: 320,
    availableSlots: 46,
    occupiedSlots: 254,
    reservedVIP: 20,
    zones: [
      { name: 'Zone A (Emergency & OPD)', total: 120, occupied: 114, available: 6 },
      { name: 'Zone B (Inpatient & Staff)', total: 200, occupied: 140, available: 60 },
    ],
  },

  aiPredictions: {
    patientLoadForecast: { tomorrowTotal: 158, confidence: '94%', trend: '+8.2%' },
    emergencyDemandForecast: { expectedCases: 24, highRiskWindow: '18:00 - 22:00' },
    bedOccupancyForecast: { projectedOccupancy: '89.4%', status: 'Nearing Threshold' },
    staffShortagePrediction: { doctorsDeficit: 1, nursesDeficit: 3, criticalDept: 'Emergency & ICU' },
    noShowRisk: { highRiskRate: '12.4%', predictedLostSlots: 8 },
    readmissionRisk: { highRiskPatientsCount: 4, flag: 'Action Required' },
  },

  aiRecommendations: [
    {
      id: 'REC-001',
      title: 'Authorize 3 Float Nurses for Evening ER Surge',
      reason: 'Predictive surge model forecasts 24 emergency cases (+40% above baseline) between 18:00 and 22:00.',
      expectedImpact: 'Prevents triage bottleneck; reduces patient wait time by 32 minutes.',
      priority: 'High',
      status: 'Pending',
      model: 'SHOS-EmergencySurge-v3',
    },
    {
      id: 'REC-002',
      title: 'Expedite Ward A Discharge Summaries by 11:30 AM',
      reason: 'Projected HDU bed occupancy will exceed 92% by 14:00 based on booked post-op transfers.',
      expectedImpact: 'Releases 5 HDU beds before elective cardiology surgeries commence.',
      priority: 'Urgent',
      status: 'Pending',
      model: 'SHOS-BedOccupancyEngine',
    },
    {
      id: 'REC-003',
      title: 'Replenish O-Negative Blood Bank Reserves',
      reason: 'Current inventory is 4 units; planned trauma admissions exceed safe reserve threshold of 8 units.',
      expectedImpact: 'Guarantees unhindered transfusion capability for weekend trauma incoming.',
      priority: 'Critical',
      status: 'Approved',
      model: 'SHOS-BloodBankOptimizer',
    },
  ],

  hospitalPlan: {
    planDate: '2026-09-07',
    expectedPatients: 158,
    expectedEmergency: 24,
    expectedBedOccupancy: '89.4%',
    overallRisk: 'MODERATE',
    rosterAllocation: {
      doctors: { required: 18, available: 17, shortage: 1 },
      nurses: { required: 42, available: 39, shortage: 3 },
      support: { required: 22, available: 22, shortage: 0 },
    },
  },

  notifications: [
    { id: 'NOTIF-01', title: 'OPD Token Alert', message: 'Token #19 is currently in consultation. Your token #24 is expected in ~35 mins.', time: '10 mins ago', type: 'appointment', read: false, role: 'patient' },
    { id: 'NOTIF-02', title: 'High-Sensitivity Troponin Report Ready', message: 'Diagnostic findings for Rahul Sharma (SHOS-2026-8942) published by NABL Pathology.', time: '25 mins ago', type: 'lab', read: false, role: 'patient' },
    { id: 'NOTIF-03', title: '🚨 Cardiac Emergency Dispatched', message: 'ALS Ambulance KA-01-EQ-9921 inbound to ER Bay 1 with acute chest trauma. ETA: 8 mins.', time: '2 mins ago', type: 'emergency', read: false, role: 'doctor' },
    { id: 'NOTIF-04', title: 'Low Stock Alert: Clopidogrel 75mg', message: 'Central Pharmacy stock has dropped to 32 units (below safe threshold of 50).', time: '1 hour ago', type: 'pharmacy', read: true, role: 'pharmacist' },
    { id: 'NOTIF-05', title: 'AI Surge Forecast Published', message: "Tomorrow's Hospital Operations Plan ready for Administrator authorization.", time: '2 hours ago', type: 'ai', read: false, role: 'hospital_admin' },
  ],

  auditLogs: [
    { id: 'AUD-01', user: 'Dr. Vikram Malhotra', action: 'Prescription Created', module: 'eRx', details: 'Prescribed Telmisartan 40mg for Rahul Sharma (SHOS-2026-8942)', timestamp: '2026-09-06 10:30:12', severity: 'Info' },
    { id: 'AUD-02', user: 'Sister Priya Nair', action: 'Vitals Logged', module: 'Nursing', details: 'BP 120/80, Pulse 74 recorded for Bed 04', timestamp: '2026-09-06 09:45:00', severity: 'Info' },
    { id: 'AUD-03', user: 'Col. Sanjeev Kapoor', action: 'AI Recommendation Approved', module: 'Operations', details: 'Approved REC-003 for O-Negative replenishment', timestamp: '2026-09-06 08:15:22', severity: 'High' },
  ],

  securityEvents: [
    { id: 'SEC-01', event: 'Multi-Factor Session Handshake', ip: '172.29.35.227', status: 'Verified', timestamp: '2026-09-06 02:40:11' },
    { id: 'SEC-02', event: 'EHR Access Authorization Check', ip: '172.29.35.227', status: 'Authorized (Role: Patient)', timestamp: '2026-09-06 02:45:30' },
  ],
};
