import { store } from '../data/store.js';

export const getAppointments = async (req, res) => {
  const appointments = store.get('appointments');
  return res.json({ success: true, count: appointments.length, data: appointments });
};

export const createAppointment = async (req, res) => {
  const { patientName, patientId, uhid, doctorName, doctorId, department, date, timeSlot, complaint } = req.body;
  const tokenNumber = Math.floor(20 + Math.random() * 20);

  const newAppt = store.insert('appointments', {
    patientName: patientName || 'Rahul Sharma',
    patientId: patientId || uhid || 'SHOS-2026-8942',
    doctorName: doctorName || 'Dr. Vikram Malhotra',
    doctorId: doctorId || 'DOC-102',
    department: department || 'Cardiology',
    date: date || '2026-09-07',
    timeSlot: timeSlot || '10:00 AM',
    tokenNumber,
    complaint: complaint || 'Routine OPD Consultation',
    status: 'Confirmed',
    receptionCheckIn: false,
    opdRoom: 'OPD-204',
  });

  // Automatically dispatch notification to Receptionist
  store.insert('notifications', {
    title: 'New Patient Booking Received',
    message: `${newAppt.patientName} booked with ${newAppt.doctorName} (${newAppt.department}) for ${newAppt.date} at ${newAppt.timeSlot}. Token #${tokenNumber}.`,
    time: 'Just now',
    type: 'appointment',
    read: false,
    role: 'receptionist',
  });

  // Audit log entry
  store.insert('auditLogs', {
    user: newAppt.patientName,
    action: 'New OPD Booking Scheduled',
    module: 'Reception & Scheduling',
    details: `Booking created for ${newAppt.doctorName} (Token #${tokenNumber}). Transmitted to Front Desk.`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    severity: 'Info',
  });

  return res.status(201).json({ success: true, message: 'Appointment booked successfully. Details transmitted to Reception.', data: newAppt });
};

export const cancelAppointment = async (req, res) => {
  const updated = store.update('appointments', req.params.id, { status: 'Cancelled' });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }
  return res.json({ success: true, message: 'Appointment cancelled.', data: updated });
};
