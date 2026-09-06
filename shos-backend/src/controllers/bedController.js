import { store } from '../data/store.js';

export const getBeds = async (req, res) => {
  const beds = store.get('beds');
  return res.json({ success: true, count: beds.length, data: beds });
};

export const updateBedStatus = async (req, res) => {
  const { status, patientName, uhid, doctor } = req.body;
  const updated = store.update('beds', req.params.id, {
    status,
    ...(patientName ? { patientName } : {}),
    ...(uhid ? { uhid } : {}),
    ...(doctor ? { doctor } : {}),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Bed not found.' });
  }

  return res.json({ success: true, message: `Bed status updated to ${status}.`, data: updated });
};
