// Billing & Invoicing Service Layer
// Connected to SHOS Unified Backend with local mock fallback.

import { apiClient } from '../api/client';
import { MOCK_BILLING, MOCK_BILLING_METRICS } from '../mock/billing';

export const billingService = {
  getInvoices: async () => {
    try {
      const res = await apiClient.get('/billing');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.log('[billingService] Invoices fallback to mock:', err.message);
    }
    return [...MOCK_BILLING];
  },

  getMetrics: async () => {
    try {
      const res = await apiClient.get('/billing/metrics');
      if (res.data?.success) return res.data.data;
    } catch (err) {
      console.log('[billingService] Metrics fallback:', err.message);
    }
    return { ...MOCK_BILLING_METRICS };
  },

  recordPayment: async (invoiceId, amount, paymentMode = 'UPI') => {
    try {
      const res = await apiClient.post(`/billing/${invoiceId}/pay`, { amount, paymentMode });
      if (res.data?.success) return res.data.data;
    } catch (err) {
      console.log('[billingService] Record payment fallback:', err.message);
    }
    return {
      success: true,
      invoiceId,
      amount,
      paymentMode,
      transactionId: 'TXN-SHOS-' + Math.floor(10000000 + Math.random() * 90000000),
      timestamp: new Date().toISOString(),
      status: 'Paid',
    };
  },
};

export default billingService;
