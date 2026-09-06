import { store } from '../data/store.js';

export const getLabOrders = async (req, res) => {
  const orders = store.get('labOrders');
  return res.json({ success: true, count: orders.length, data: orders });
};

export const createLabOrder = async (req, res) => {
  const { testName, patientName, uhid, doctorName, priority } = req.body;
  const newOrder = store.insert('labOrders', {
    testName: testName || 'Routine Biochemistry Analysis',
    patientName: patientName || 'Rahul Sharma',
    uhid: uhid || 'SHOS-2026-8942',
    doctorName: doctorName || 'Dr. Vikram Malhotra',
    date: new Date().toISOString().split('T')[0],
    status: 'in_progress',
    priority: priority || 'Normal',
    flag: 'Pending',
  });
  return res.status(201).json({ success: true, message: 'Lab order generated.', data: newOrder });
};

export const updateLabResult = async (req, res) => {
  const { result, verifiedBy } = req.body;
  const updated = store.update('labOrders', req.params.id, {
    result: result || 'Findings within normal diagnostic parameters.',
    status: 'completed',
    flag: 'Normal',
    verifiedBy: verifiedBy || 'Dr. R. K. Sen, MD (Pathology)',
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Lab order not found.' });
  }

  return res.json({ success: true, message: 'Diagnostic result signed & verified.', data: updated });
};
