// Mock Super Admin Governance, Multi-Campus Status & Security Audit Logs

import { Alert } from 'react-native';

export const MOCK_SUPERADMIN = {
  campuses: [
    {
      id: 'CAMPUS-01',
      name: 'SHOS Central Apex Hospital (Main Campus)',
      location: 'Ansari Nagar, New Delhi',
      status: 'Online',
      beds: '221 / 250 Beds (88.4%)',
      activeDoctors: 42,
      activeNurses: 84,
      emergencyStatus: 'Normal Capacity',
      aiEngineStatus: 'Active (FastAPI Gateway Online)',
    },
    {
      id: 'CAMPUS-02',
      name: 'SHOS South Delhi Heart & Vascular Pavilion',
      location: 'Saket, New Delhi',
      status: 'Online',
      beds: '148 / 180 Beds (82.2%)',
      activeDoctors: 28,
      activeNurses: 62,
      emergencyStatus: 'Cath Lab Standby',
      aiEngineStatus: 'Active',
    },
    {
      id: 'CAMPUS-03',
      name: 'SHOS Gurugram Oncology & Critical Care Unit',
      location: 'Sector 44, Gurugram',
      status: 'Online',
      beds: '190 / 240 Beds (79.1%)',
      activeDoctors: 34,
      activeNurses: 70,
      emergencyStatus: 'Normal Capacity',
      aiEngineStatus: 'Active',
    }
  ],
  auditLogs: [
    {
      id: 'LOG-8812',
      user: 'Dr. Rajiv Grover (Admin)',
      action: 'Authorized Emergency HDU Bed Pre-allocation',
      module: 'Bed Management / AI Center',
      timestamp: '2026-09-06 08:35:12',
      status: 'Success',
      severity: 'Low',
    },
    {
      id: 'LOG-8813',
      user: 'Sunil Mehta (Pharmacist)',
      action: 'Dispensed 90 Tabs Atorvastatin (RX-8841)',
      module: 'Pharmacy Central',
      timestamp: '2026-09-06 09:12:04',
      status: 'Success',
      severity: 'Low',
    },
    {
      id: 'LOG-8814',
      user: 'Dr. Sameer Khan (Emergency)',
      action: 'Triage Upgrade: Critical Trauma Case',
      module: 'Emergency Resuscitation Bay',
      timestamp: '2026-09-06 10:44:28',
      status: 'Alert Logged',
      severity: 'High',
    },
    {
      id: 'LOG-8815',
      user: 'System Cron',
      action: 'AI Model Weights Check & R² Verification',
      module: 'M01-M08 Pipeline',
      timestamp: '2026-09-06 11:00:00',
      status: 'Passed (R² Avg: 0.92)',
      severity: 'Low',
    }
  ],
  securityEvents: [
    {
      id: 'SEC-01',
      event: 'Successful Multi-Factor Authentication',
      actor: 'superadmin@shos.hospital',
      ipAddress: '10.200.4.18 (Hospital Internal VPN)',
      timestamp: 'Today 08:00 AM',
      risk: 'Zero Risk',
    },
    {
      id: 'SEC-02',
      event: 'Patient Record Access Verification',
      actor: 'Dr. Vikram Malhotra',
      ipAddress: '10.200.4.52 (OPD Workstation)',
      timestamp: 'Today 09:30 AM',
      risk: 'Authorized Access',
    }
  ]
};

export default MOCK_SUPERADMIN;
