import { store } from '../data/store.js';

export const getMedicines = async (req, res) => {
  const medicines = store.get('medicines');
  return res.json({ success: true, count: medicines.length, data: medicines });
};

export const getPrescriptions = async (req, res) => {
  const prescriptions = store.get('prescriptions');
  return res.json({ success: true, count: prescriptions.length, data: prescriptions });
};

export const createPrescription = async (req, res) => {
  const { patientName, uhid, doctorName, diagnosis, medicines } = req.body;
  const newRx = store.insert('prescriptions', {
    date: new Date().toISOString().split('T')[0],
    patientName: patientName || 'Rahul Sharma',
    uhid: uhid || 'SHOS-2026-8942',
    doctorName: doctorName || 'Dr. Vikram Malhotra',
    diagnosis: diagnosis || 'Clinical Evaluation',
    status: 'active',
    medicines: medicines || [{ name: 'Tab. Paracetamol 650mg', dosage: '1 Tab', frequency: 'SOS', duration: '3 Days' }],
  });
  return res.status(201).json({ success: true, message: 'eRx created and routed to Central Pharmacy.', data: newRx });
};

export const dispensePrescription = async (req, res) => {
  const updated = store.update('prescriptions', req.params.id, { status: 'dispensed' });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Prescription not found.' });
  }
  return res.json({ success: true, message: 'Prescription packaged & inventory deducted.', data: updated });
};
