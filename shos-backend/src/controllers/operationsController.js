import { store } from '../data/store.js';

export const getStaff = async (req, res) => {
  const staff = store.get('staff');
  return res.json({ success: true, count: staff.length, data: staff });
};

export const getParking = async (req, res) => {
  const parking = store.get('parking');
  return res.json({ success: true, data: parking });
};

export const generateParkingPass = async (req, res) => {
  const { vehicleNumber, vehicleType, zone } = req.body;
  const pass = {
    passId: `PRK-${Date.now().toString().slice(-4)}`,
    vehicleNumber: vehicleNumber || 'KA-01-MJ-4411',
    vehicleType: vehicleType || 'Car / 4-Wheeler',
    assignedSlot: 'A-24 (Near OPD Gate)',
    entryTime: new Date().toLocaleTimeString(),
    qrPayload: `SHOS-PARK-${vehicleNumber}-${Date.now()}`,
  };
  return res.status(201).json({ success: true, message: 'Parking pass generated.', data: pass });
};

export const getBloodBank = async (req, res) => {
  const bloodBank = store.get('bloodBank');
  return res.json({ success: true, data: bloodBank });
};

export const getResources = async (req, res) => {
  const resources = store.get('resources');
  return res.json({ success: true, count: resources.length, data: resources });
};

// ─── New: Hospital Plan & Admin Operations ───────────────────────────

export const getHospitalPlan = async (req, res) => {
  const plan = store.get('hospitalPlan') || store.data?.hospitalPlan;
  // hospitalPlan is a single object not array — handle it
  const planData = Array.isArray(plan) ? plan[0] : plan;
  return res.json({
    success: true,
    data: planData || {
      planDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      expectedPatients: 158,
      expectedEmergency: 24,
      expectedBedOccupancy: '89.4%',
      overallRisk: 'MODERATE',
      rosterAllocation: {
        doctors: { required: 18, available: 17, shortage: 1 },
        nurses: { required: 42, available: 39, shortage: 3 },
        support: { required: 22, available: 22, shortage: 0 },
      },
    },
  });
};

export const getAuditLogs = async (req, res) => {
  const logs = store.get('auditLogs');
  return res.json({ success: true, count: logs.length, data: logs });
};

export const getSecurityEvents = async (req, res) => {
  const events = store.get('securityEvents');
  return res.json({ success: true, count: events.length, data: events });
};

export const getNotifications = async (req, res) => {
  const notifications = store.get('notifications');
  return res.json({ success: true, count: notifications.length, data: notifications });
};

