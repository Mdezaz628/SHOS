// Unified SHOS API Service for Web Dashboard
// Connects directly to the shared Express backend on port 5000

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('shos_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn(`[SHOS Web API] Request failed for ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

export const shosApi = {
  // System Health
  getHealth: () => request('/health'),

  // Auth
  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.success && res.token) {
      localStorage.setItem('shos_jwt_token', res.token);
    }
    return res;
  },

  switchRole: async (role) => {
    const res = await request('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (res.success && res.token) {
      localStorage.setItem('shos_jwt_token', res.token);
    }
    return res;
  },

  register: (patientData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(patientData),
    }),

  // Clinical & Operations
  getPatients: () => request('/patients'),
  getDoctors: (department) => request(`/doctors${department ? `?department=${department}` : ''}`),
  getAppointments: () => request('/appointments'),
  bookAppointment: (apptData) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(apptData),
    }),
  getLiveQueue: () => request('/queue'),
  advanceQueue: () => request('/queue/advance', { method: 'POST' }),
  getBeds: () => request('/beds'),
  updateBedStatus: (id, status, details) =>
    request(`/beds/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...details }),
    }),

  // Diagnostic & Pharmacy
  getLabOrders: () => request('/lab'),
  updateLabResult: (id, result) =>
    request(`/lab/${id}/result`, {
      method: 'PUT',
      body: JSON.stringify({ result }),
    }),
  getMedicines: () => request('/pharmacy/medicines'),
  getPrescriptions: () => request('/pharmacy/prescriptions'),
  dispensePrescription: (id) =>
    request(`/pharmacy/prescriptions/${id}/dispense`, { method: 'PUT' }),

  // Billing
  getBills: () => request('/billing'),
  payBill: (id) => request(`/billing/${id}/pay`, { method: 'POST' }),

  // Emergency & Logistics
  getAmbulances: () => request('/emergency/ambulances'),
  requestEmergencySOS: (sosData) =>
    request('/emergency/sos', {
      method: 'POST',
      body: JSON.stringify(sosData),
    }),
  getTasks: () => request('/tasks'),
  advanceTask: (id) => request(`/tasks/${id}/advance`, { method: 'PUT' }),

  // Operations
  getStaff: () => request('/operations/staff'),
  getParking: () => request('/operations/parking'),
  getBloodBank: () => request('/operations/blood-bank'),
  getResources: () => request('/operations/resources'),

  // AI Decision Support
  getAIPredictions: () => request('/ai/predictions'),
  getHospitalPlan: () => request('/ai/hospital-plan'),
  getAIRecommendations: () => request('/ai/recommendations'),
  approveRecommendation: (id) =>
    request(`/ai/recommendations/${id}/approve`, { method: 'POST' }),
  rejectRecommendation: (id) =>
    request(`/ai/recommendations/${id}/reject`, { method: 'POST' }),

  // Governance
  getAuditLogs: () => request('/admin/audit-logs'),
  getSecurityEvents: () => request('/admin/security-events'),
  getNotifications: (role) =>
    request(`/admin/notifications${role ? `?role=${role}` : ''}`),
};

export default shosApi;
