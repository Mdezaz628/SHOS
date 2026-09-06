// Bed Management & Allocation Service Layer

import { MOCK_BEDS } from '../mock/beds';

export const bedService = {
  getBeds: async (ward = null) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (ward && ward !== 'All') {
      return MOCK_BEDS.filter((b) => b.ward.toLowerCase().includes(ward.toLowerCase()));
    }
    return [...MOCK_BEDS];
  },

  updateBedStatus: async (bedId, status, patientData = null) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      bedId,
      status,
      patient: patientData,
      updatedAt: new Date().toISOString(),
    };
  },
};

export default bedService;
