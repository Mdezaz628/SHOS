// AI Predictions & Recommendations Service
// Connected to Unified SHOS Backend

import { apiClient } from '../api/client';
import { MOCK_AI_PREDICTIONS } from '../mock/aiPredictions';
import { MOCK_AI_RECOMMENDATIONS } from '../mock/aiRecommendations';
import { MOCK_HOSPITAL_PLAN } from '../mock/hospitalPlan';

export const aiService = {
  getPredictions: async () => {
    try {
      const res = await apiClient.get('/ai/predictions');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.log('[aiService] Predictions fallback to local mock:', err.message);
    }
    return { ...MOCK_AI_PREDICTIONS };
  },

  getHospitalPlan: async () => {
    try {
      const res = await apiClient.get('/operations/hospital-plan');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.log('[aiService] Hospital plan fallback:', err.message);
    }
    return { ...MOCK_HOSPITAL_PLAN };
  },

  getRecommendations: async () => {
    try {
      const res = await apiClient.get('/ai/recommendations');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.log('[aiService] Recommendations fallback:', err.message);
    }
    return [...MOCK_AI_RECOMMENDATIONS];
  },

  approveRecommendation: async (id) => {
    try {
      const res = await apiClient.post(`/ai/recommendations/${id}/approve`);
      if (res.data?.success) {
        return { success: true, id, status: 'Approved' };
      }
    } catch (err) {
      console.log('[aiService] Approve recommendation fallback:', err.message);
    }
    return { success: true, id, status: 'Approved' };
  },

  rejectRecommendation: async (id) => {
    try {
      const res = await apiClient.post(`/ai/recommendations/${id}/reject`);
      if (res.data?.success) {
        return { success: true, id, status: 'Rejected' };
      }
    } catch (err) {
      console.log('[aiService] Reject recommendation fallback:', err.message);
    }
    return { success: true, id, status: 'Rejected' };
  },
};

export default aiService;
