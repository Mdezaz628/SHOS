// Ambulance Fleet & EMT Service Layer

import { MOCK_AMBULANCES } from '../mock/ambulances';

export const ambulanceService = {
  getActiveTracking: async (ambulanceId = 'AMB-08') => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_AMBULANCES.find((a) => a.id === ambulanceId) || MOCK_AMBULANCES[0];
  },

  getAllAmbulances: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...MOCK_AMBULANCES];
  },

  updateTripStatus: async (ambulanceId, newStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      ambulanceId,
      status: newStatus,
      timestamp: new Date().toISOString(),
    };
  },
};

export default ambulanceService;
