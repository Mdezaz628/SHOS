// Pharmacy & Inventory Service Layer

import { MOCK_MEDICINES } from '../mock/medicines';
import { MOCK_PRESCRIPTIONS } from '../mock/prescriptions';

export const pharmacyService = {
  getInventory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...MOCK_MEDICINES];
  },

  getPendingPrescriptions: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_PRESCRIPTIONS.filter((p) => p.status === 'Pending Dispensation' || p.items.some((i) => !i.dispensed));
  },

  dispenseMedication: async (prescriptionId, medicineId, quantity) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      prescriptionId,
      medicineId,
      dispensedQuantity: quantity,
      timestamp: new Date().toISOString(),
    };
  },
};

export default pharmacyService;
