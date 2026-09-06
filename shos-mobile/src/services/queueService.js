// Live Queue Telemetry Service
// Connected to Unified SHOS Backend

import { apiClient } from '../api/client';
import { MOCK_QUEUE } from '../mock/queue';

export const queueService = {
  getLiveQueue: async (departmentId = null) => {
    try {
      const res = await apiClient.get('/queue');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.log('[queueService] Fallback to local mock:', err.message);
    }
    return { ...MOCK_QUEUE };
  },

  advanceQueue: async () => {
    try {
      const res = await apiClient.post('/queue/advance');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.log('[queueService] Advance fallback:', err.message);
    }
    return {
      ...MOCK_QUEUE,
      currentServingToken: MOCK_QUEUE.currentServingToken + 1,
      peopleAhead: Math.max(0, MOCK_QUEUE.peopleAhead - 1),
    };
  },
};

export default queueService;
