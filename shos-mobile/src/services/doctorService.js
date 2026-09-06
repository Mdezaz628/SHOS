// Doctor & Clinical Service Layer

import { MOCK_DOCTORS } from '../mock/doctors';
import { MOCK_PATIENTS } from '../mock/patients';
import { MOCK_APPOINTMENTS } from '../mock/appointments';

export const doctorService = {
  getDoctors: async (department = null) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (department && department !== 'All') {
      return MOCK_DOCTORS.filter((d) => d.department.toLowerCase().includes(department.toLowerCase()));
    }
    return [...MOCK_DOCTORS];
  },

  getDoctorById: async (doctorId) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_DOCTORS.find((d) => d.id === doctorId) || MOCK_DOCTORS[0];
  },

  getDoctorDashboard: async (doctorId = 'DOC-01') => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId) || MOCK_DOCTORS[0];
    const appointments = MOCK_APPOINTMENTS.filter((a) => a.doctorId === doctorId || !a.doctorId);
    return {
      doctor,
      todayAppointmentsCount: doctor.todayAppointments,
      waitingPatientsCount: doctor.waitingPatients,
      emergencyCasesCount: 4,
      pendingLabReportsCount: 6,
      pendingPrescriptionsCount: 3,
      workloadScore: '86%',
      shiftInfo: 'Morning Shift (08:00 - 16:00)',
      activeAppointments: appointments,
    };
  },

  saveClinicalNotes: async (patientId, notesData) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, savedAt: new Date().toISOString(), ...notesData };
  },

  createPrescription: async (rxData) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      rxNumber: 'SHOS-RX-2026-' + Math.floor(10000 + Math.random() * 90000),
      ...rxData,
    };
  },

  createReferral: async (referralData) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      referralId: 'REF-2026-' + Math.floor(1000 + Math.random() * 9000),
      ...referralData,
    };
  },
};

export default doctorService;
