// Emergency & Triage Service Layer

import { HOSPITAL_INFO } from '../mock/hospitalInfo';

export const emergencyService = {
  dispatchEmergencySOS: async (emergencyData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      sosToken: 'SOS-' + Math.floor(10000 + Math.random() * 90000),
      assignedAmbulance: 'AMB-08 (Cardiac Mobile ICU #08)',
      etaMinutes: 8,
      triageLevel: emergencyData.severity || 'Critical',
      destination: HOSPITAL_INFO.name + ' — Trauma Bay',
      dispatchedAt: new Date().toISOString(),
      ...emergencyData,
    };
  },

  getActiveEmergencies: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [
      {
        id: 'EMG-101',
        patient: 'Rahul Sharma (Admitted HDU)',
        location: 'Cardiology HDU Ward 3',
        severity: 'Critical Red',
        triageCode: 'T1-CRITICAL',
        complaint: 'Suspected acute ischemic chest pain',
        assignedDoctor: 'Dr. Vikram Malhotra',
        bed: 'HDU-04',
        status: 'Stabilizing',
      },
      {
        id: 'EMG-102',
        patient: 'Poly-trauma Incoming (Vehicular Collision)',
        location: 'Ring Road Flyover Junction',
        severity: 'STAT Red',
        triageCode: 'T1-POLYTRAUMA',
        complaint: 'Head injury with multiple blunt trauma',
        assignedDoctor: 'Dr. Sameer Khan',
        bed: 'Trauma Bay Bed 01',
        status: 'Ambulance En Route (ETA 8m)',
      }
    ];
  },
};

export default emergencyService;
