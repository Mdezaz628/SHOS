export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  SUPPORT: 'support', // Ward Boy
  LAB: 'lab',         // Lab Technician
  PHARMACY: 'pharmacy', // Pharmacist
  AMBULANCE: 'ambulance', // Ambulance Driver
  HOUSEKEEPING: 'housekeeping',
  PARKING: 'parking',
  RECEPTION: 'reception', // Receptionist
  BILLING: 'billing',     // Billing Staff
  HR: 'hr',               // HR Manager
  DEPARTMENT: 'department', // Department Manager
  ADMIN: 'admin',         // Hospital Admin
  SUPERADMIN: 'superadmin' // Super Admin
};

export const ROLE_LABELS = {
  [ROLES.PATIENT]: 'Patient',
  [ROLES.DOCTOR]: 'Doctor / Consultant',
  [ROLES.NURSE]: 'Nursing Officer',
  [ROLES.SUPPORT]: 'Ward Boy / Support Staff',
  [ROLES.LAB]: 'Lab Technician',
  [ROLES.PHARMACY]: 'Pharmacist',
  [ROLES.AMBULANCE]: 'Ambulance Driver',
  [ROLES.HOUSEKEEPING]: 'Housekeeping Staff',
  [ROLES.PARKING]: 'Parking Staff',
  [ROLES.RECEPTION]: 'Receptionist',
  [ROLES.BILLING]: 'Billing Staff',
  [ROLES.HR]: 'HR Manager',
  [ROLES.DEPARTMENT]: 'Department Manager',
  [ROLES.ADMIN]: 'Hospital Admin',
  [ROLES.SUPERADMIN]: 'Super Admin'
};

export const ROLE_ROUTES = {
  [ROLES.PATIENT]: '/patient',
  [ROLES.DOCTOR]: '/doctor',
  [ROLES.NURSE]: '/nurse',
  [ROLES.SUPPORT]: '/support',
  [ROLES.LAB]: '/lab',
  [ROLES.PHARMACY]: '/pharmacy',
  [ROLES.AMBULANCE]: '/ambulance',
  [ROLES.HOUSEKEEPING]: '/housekeeping',
  [ROLES.PARKING]: '/parking',
  [ROLES.RECEPTION]: '/reception',
  [ROLES.BILLING]: '/billing',
  [ROLES.HR]: '/hr',
  [ROLES.DEPARTMENT]: '/department',
  [ROLES.ADMIN]: '/admin',
  [ROLES.SUPERADMIN]: '/superadmin'
};
