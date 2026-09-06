// Admin & Super Admin Command Center Service Layer
// Connected to SHOS Unified Backend with local mock fallback.

import { apiClient } from '../api/client';
import { HOSPITAL_INFO } from '../mock/hospitalInfo';
import { MOCK_BLOOD_BANK } from '../mock/bloodBank';
import { MOCK_RESOURCES } from '../mock/resources';
import { MOCK_PARKING } from '../mock/parking';
import { MOCK_SUPERADMIN } from '../mock/superadmin';

export const adminService = {
  getHospitalOverview: async () => {
    try {
      const [patientsRes, bedsRes, staffRes] = await Promise.all([
        apiClient.get('/patients'),
        apiClient.get('/beds'),
        apiClient.get('/operations/staff'),
      ]);
      const patients = patientsRes.data?.data || [];
      const beds = bedsRes.data?.data || [];
      const staff = staffRes.data?.data || [];
      return {
        hospital: HOSPITAL_INFO,
        metrics: {
          activePatients: patients.length || 184,
          opdTokensToday: 132,
          emergencyAdmissions: 28,
          criticalPatients: patients.filter((p) => p.triage === 'critical').length || 9,
          bedOccupancyRate: beds.length
            ? Math.round((beds.filter((b) => b.status === 'occupied').length / beds.length) * 100)
            : 88.4,
          availableBeds: beds.filter((b) => b.status === 'available').length || 29,
          activeStaff: staff.length || 64,
          pendingLabReports: 18,
          lowStockMedicines: 4,
          aiForecastedLoadTomorrow: 144,
        },
      };
    } catch (err) {
      console.log('[adminService] Overview fallback to mock:', err.message);
    }
    return {
      hospital: HOSPITAL_INFO,
      metrics: {
        activePatients: 184,
        opdTokensToday: 132,
        emergencyAdmissions: 28,
        criticalPatients: 9,
        bedOccupancyRate: 88.4,
        availableBeds: 29,
        activeStaff: 64,
        pendingLabReports: 18,
        lowStockMedicines: 4,
        aiForecastedLoadTomorrow: 144,
      },
    };
  },

  getBloodBank: async () => {
    try {
      const res = await apiClient.get('/operations/blood-bank');
      if (res.data?.success) return res.data.data;
    } catch (err) {
      console.log('[adminService] Blood bank fallback:', err.message);
    }
    return { ...MOCK_BLOOD_BANK };
  },

  getResources: async () => {
    try {
      const res = await apiClient.get('/operations/resources');
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch (err) {
      console.log('[adminService] Resources fallback:', err.message);
    }
    return [...MOCK_RESOURCES];
  },

  getParkingTelemetry: async () => {
    try {
      const res = await apiClient.get('/operations/parking');
      if (res.data?.success) return res.data.data;
    } catch (err) {
      console.log('[adminService] Parking fallback:', err.message);
    }
    return { ...MOCK_PARKING };
  },

  generateParkingPass: async (vehicleData) => {
    try {
      const res = await apiClient.post('/operations/parking/pass', vehicleData);
      if (res.data?.success) return res.data.data;
    } catch (err) {
      console.log('[adminService] Parking pass fallback:', err.message);
    }
    return {
      passId: 'PK-' + Math.floor(1000 + Math.random() * 9000),
      entryTime: 'Just now',
      qrCode: 'SHOS-PARK-' + Date.now(),
      ...vehicleData,
    };
  },

  getAuditLogs: async () => {
    try {
      const res = await apiClient.get('/operations/audit-logs');
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch (err) {
      console.log('[adminService] Audit logs fallback:', err.message);
    }
    return [];
  },

  getSuperAdminGovernance: async () => {
    try {
      const usersRes = await apiClient.get('/admin/users');
      if (usersRes.data?.success) return usersRes.data;
    } catch (err) {
      console.log('[adminService] Governance fallback:', err.message);
    }
    return { ...MOCK_SUPERADMIN };
  },
};

export default adminService;
