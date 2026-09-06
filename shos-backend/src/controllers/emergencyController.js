import { store } from '../data/store.js';

export const getEmergencyStatus = async (req, res) => {
  const ambulances = store.get('ambulances');
  const activeDispatches = ambulances.filter((a) => a.status === 'Dispatched');
  return res.json({
    success: true,
    data: {
      activeDispatches,
      totalAmbulances: ambulances.length,
      availableAmbulances: ambulances.filter((a) => a.status === 'Available').length,
      dispatchedAmbulances: activeDispatches.length,
      erBayStatus: 'Bay 1: Incoming ALS | Bay 2: Available | Bay 3: Cleaning',
      triageStats: { red: 1, orange: 2, yellow: 4, green: 8 },
    },
  });
};

export const getAmbulances = async (req, res) => {

  const ambulances = store.get('ambulances');
  return res.json({ success: true, count: ambulances.length, data: ambulances });
};

export const requestEmergencySOS = async (req, res) => {
  const { location, patientName, emergencyType } = req.body;
  const sosEvent = {
    id: `SOS-${Date.now().toString().slice(-4)}`,
    location: location || 'Indiranagar Main Road, Bengaluru',
    patientName: patientName || 'Rahul Sharma',
    emergencyType: emergencyType || 'Cardiac Arrest / Chest Pain',
    triage: 'Critical (Red)',
    ambulanceAssigned: 'KA-01-EQ-9921 (ALS Mobile ICU)',
    driverName: 'Rajesh Yadav (+91 98765 43217)',
    eta: '8 minutes',
    status: 'Dispatched',
    createdAt: new Date().toISOString(),
  };

  // Add alert to notifications
  store.insert('notifications', {
    title: '🚨 Emergency SOS Dispatched',
    message: `ALS Ambulance assigned to ${sosEvent.patientName} at ${sosEvent.location}.`,
    time: 'Just now',
    type: 'emergency',
    read: false,
    role: 'ambulance_driver',
  });

  return res.status(201).json({
    success: true,
    message: 'Emergency SOS activated. ALS Ambulance dispatched.',
    data: sosEvent,
  });
};

export const updateAmbulanceStatus = async (req, res) => {
  const { status, location, etaMinutes } = req.body;
  const updated = store.update('ambulances', req.params.id, {
    status,
    ...(location ? { location } : {}),
    ...(etaMinutes !== undefined ? { etaMinutes } : {}),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Ambulance record not found.' });
  }

  return res.json({ success: true, message: `Ambulance mission updated to ${status}.`, data: updated });
};
