// Patient Service Layer

import { MOCK_PATIENTS } from '../mock/patients';
import { MOCK_LAB_ORDERS } from '../mock/labOrders';
import { MOCK_PRESCRIPTIONS } from '../mock/prescriptions';
import { MOCK_BILLING } from '../mock/billing';
import { MOCK_BEDS } from '../mock/beds';

export const patientService = {
  getProfile: async (patientId = 'P-101') => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[0];
  },

  getAllPatients: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...MOCK_PATIENTS];
  },

  getPatientReports: async (patientId = 'P-101') => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_LAB_ORDERS.filter((r) => r.patientId === patientId);
  },

  getPatientPrescriptions: async (patientId = 'P-101') => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_PRESCRIPTIONS.filter((rx) => rx.patientId === patientId);
  },

  getPatientBills: async (patientId = 'P-101') => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_BILLING.filter((b) => b.patientId === patientId);
  },

  getAdmissionStatus: async (patientId = 'P-101') => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[0];
    const bed = MOCK_BEDS.find((b) => b.patientId === patientId);
    return {
      isAdmitted: patient.admissionStatus === 'Admitted',
      ward: patient.ward,
      room: patient.room,
      bedNumber: patient.bedNumber,
      consultant: patient.consultantDoctor,
      admissionDate: patient.admissionDate,
      vitals: patient.vitals,
      bedDetails: bed || null,
    };
  },
};

export default patientService;
