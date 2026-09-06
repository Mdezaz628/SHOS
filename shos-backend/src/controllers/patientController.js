import { store } from '../data/store.js';

export const getPatients = async (req, res) => {
  const patients = store.get('patients');
  return res.json({ success: true, count: patients.length, data: patients });
};

export const getPatientById = async (req, res) => {
  const patient = store.findById('patients', req.params.id) || store.get('patients').find((p) => p.uhid === req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found.' });
  }
  return res.json({ success: true, data: patient });
};

export const createPatient = async (req, res) => {
  const { name, age, gender, phone, bloodGroup, chiefComplaint } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Patient name is required.' });
  }

  const newPatient = store.insert('patients', {
    name,
    age: age || 30,
    gender: gender || 'Unspecified',
    phone: phone || '+91 98000 00000',
    uhid: `SHOS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    bloodGroup: bloodGroup || 'B+',
    status: 'waiting',
    tokenNumber: Math.floor(25 + Math.random() * 15),
    triage: 'stable',
    chiefComplaint: chiefComplaint || 'Walk-in OPD Consultation',
  });

  return res.status(201).json({ success: true, message: 'Patient registered.', data: newPatient });
};

export const updatePatient = async (req, res) => {
  const updated = store.update('patients', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Patient record not found.' });
  }
  return res.json({ success: true, message: 'Patient updated.', data: updated });
};
