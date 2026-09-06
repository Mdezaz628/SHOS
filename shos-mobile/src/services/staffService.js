// Staff & HR Operations Service Layer

import { MOCK_STAFF, MOCK_HR_METRICS } from '../mock/staff';
import { MOCK_TASKS } from '../mock/tasks';

export const staffService = {
  getStaffMembers: async (role = null) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (role && role !== 'All') {
      return MOCK_STAFF.filter((s) => s.role.toLowerCase() === role.toLowerCase());
    }
    return [...MOCK_STAFF];
  },

  getHRMetrics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...MOCK_HR_METRICS };
  },

  getTasksForRole: async (role) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_TASKS.filter((t) => t.assignedRole.toLowerCase() === role.toLowerCase());
  },

  updateTaskStatus: async (taskId, newStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return { success: true, taskId, status: newStatus };
  },
};

export default staffService;
