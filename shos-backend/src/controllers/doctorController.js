import { store } from '../data/store.js';

export const getDoctors = async (req, res) => {
  const { department } = req.query;
  let doctors = store.get('doctors');
  if (department && department !== 'All') {
    doctors = doctors.filter((d) => d.department.toLowerCase() === department.toLowerCase());
  }
  return res.json({ success: true, count: doctors.length, data: doctors });
};

export const getDoctorById = async (req, res) => {
  const doctor = store.findById('doctors', req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found.' });
  }
  return res.json({ success: true, data: doctor });
};
