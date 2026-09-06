// SHOS Mobile User Roles & Definitions

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  WARDBOY: 'wardboy',          // Ward Boy / Patient Care Assistant
  LAB: 'lab',                  // Lab Technician
  PHARMACY: 'pharmacy',        // Pharmacist
  AMBULANCE: 'ambulance',      // Ambulance Driver / EMT
  HOUSEKEEPING: 'housekeeping',
  PARKING: 'parking',          // Parking Staff
  RECEPTION: 'reception',      // Receptionist
  BILLING: 'billing',          // Billing Staff
  HR: 'hr',                    // HR / Staff Manager
  DEPARTMENT: 'department',    // Department Manager / HOD
  ADMIN: 'admin',              // Hospital Admin (Command Center)
  SUPERADMIN: 'superadmin',    // Super Admin (Governance)
};

export const ROLE_LABELS = {
  [ROLES.PATIENT]: 'Patient Portal',
  [ROLES.DOCTOR]: 'Doctor / Consultant',
  [ROLES.NURSE]: 'Nursing Officer',
  [ROLES.WARDBOY]: 'Ward Boy / PCA',
  [ROLES.LAB]: 'Lab Technician',
  [ROLES.PHARMACY]: 'Pharmacist',
  [ROLES.AMBULANCE]: 'Ambulance EMT',
  [ROLES.HOUSEKEEPING]: 'Housekeeping Staff',
  [ROLES.PARKING]: 'Parking Attendant',
  [ROLES.RECEPTION]: 'Receptionist',
  [ROLES.BILLING]: 'Billing Executive',
  [ROLES.HR]: 'HR / Staff Manager',
  [ROLES.DEPARTMENT]: 'Department HOD',
  [ROLES.ADMIN]: 'Hospital Admin',
  [ROLES.SUPERADMIN]: 'Super Admin',
};

export const ROLE_ICONS = {
  [ROLES.PATIENT]: 'person',
  [ROLES.DOCTOR]: 'medkit',
  [ROLES.NURSE]: 'fitness',
  [ROLES.WARDBOY]: 'walk',
  [ROLES.LAB]: 'flask',
  [ROLES.PHARMACY]: 'medical',
  [ROLES.AMBULANCE]: 'car',
  [ROLES.HOUSEKEEPING]: 'sparkles',
  [ROLES.PARKING]: 'car-sport',
  [ROLES.RECEPTION]: 'clipboard',
  [ROLES.BILLING]: 'receipt',
  [ROLES.HR]: 'people',
  [ROLES.DEPARTMENT]: 'git-network',
  [ROLES.ADMIN]: 'business',
  [ROLES.SUPERADMIN]: 'shield-checkmark',
};

export const DEMO_PRESETS = [
  { role: ROLES.PATIENT, label: 'Patient', email: 'patient@shos.hospital', name: 'Rahul Sharma', desc: 'Outpatient & Ward Inpatient' },
  { role: ROLES.DOCTOR, label: 'Doctor OPD', email: 'doctor@shos.hospital', name: 'Dr. Vikram Malhotra', desc: 'Sr. Consultant Cardiology' },
  { role: ROLES.NURSE, label: 'Nurse Station', email: 'nurse@shos.hospital', name: 'Sister Priya Nair', desc: 'ICU & Ward In-Charge' },
  { role: ROLES.WARDBOY, label: 'Ward Boy / PCA', email: 'wardboy@shos.hospital', name: 'Suresh Kumar', desc: 'Patient Care & Wheelchair' },
  { role: ROLES.LAB, label: 'Lab Tech', email: 'lab@shos.hospital', name: 'Ananya Roy', desc: 'Clinical Pathology & Samples' },
  { role: ROLES.PHARMACY, label: 'Pharmacist', email: 'pharmacy@shos.hospital', name: 'Sunil Mehta', desc: 'Central Dispensary' },
  { role: ROLES.AMBULANCE, label: 'Ambulance EMT', email: 'ambulance@shos.hospital', name: 'Rajesh Yadav', desc: 'Cardiac Mobile ICU #08' },
  { role: ROLES.HOUSEKEEPING, label: 'Housekeeping', email: 'housekeeping@shos.hospital', name: 'Deepak Verma', desc: 'Sanitization & Ward Hygiene' },
  { role: ROLES.PARKING, label: 'Parking Staff', email: 'parking@shos.hospital', name: 'Manoj Singh', desc: 'Campus Gates & Zone A/B' },
  { role: ROLES.RECEPTION, label: 'Receptionist', email: 'reception@shos.hospital', name: 'Neha Kapoor', desc: 'Walk-ins & Token Desk' },
  { role: ROLES.BILLING, label: 'Billing Staff', email: 'billing@shos.hospital', name: 'Kavita Verma', desc: 'TPA Claims & Cash Desk' },
  { role: ROLES.HR, label: 'HR Manager', email: 'hr@shos.hospital', name: 'Arun Iyer', desc: 'Staff Shifts & Shortage' },
  { role: ROLES.DEPARTMENT, label: 'Dept HOD', email: 'hod@shos.hospital', name: 'Dr. Meenakshi Sundaram', desc: 'Cardiology & HDU Head' },
  { role: ROLES.ADMIN, label: 'Hospital Admin', email: 'admin@shos.hospital', name: 'Dr. Rajiv Grover', desc: 'SHOS Command Center & AI' },
  { role: ROLES.SUPERADMIN, label: 'Super Admin', email: 'superadmin@shos.hospital', name: 'Apex Governance', desc: 'Multi-Campus & Security' },
];

export default ROLES;
