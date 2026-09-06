import { store } from '../data/store.js';

export const getNotifications = async (req, res) => {
  const { role } = req.query;
  let notifications = store.get('notifications');
  if (role) {
    notifications = notifications.filter((n) => !n.role || n.role === role);
  }
  const unreadCount = notifications.filter((n) => !n.read).length;
  return res.json({ success: true, count: notifications.length, unreadCount, data: notifications });
};

export const markNotificationAsRead = async (req, res) => {
  const updated = store.update('notifications', req.params.id, { read: true });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Notification not found.' });
  }
  return res.json({ success: true, message: 'Marked as read.', data: updated });
};

export const getAuditLogs = async (req, res) => {
  const auditLogs = store.get('auditLogs');
  return res.json({ success: true, count: auditLogs.length, data: auditLogs });
};

export const getSecurityEvents = async (req, res) => {
  const events = store.get('securityEvents');
  return res.json({ success: true, count: events.length, data: events });
};

// --- Staff & User Governance (Full Admin Power) ---
export const getAllUsers = async (req, res) => {
  const users = store.get('users');
  return res.json({ success: true, count: users.length, data: users });
};

export const createUser = async (req, res) => {
  const { name, email, role, department, phone, staffId } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, and role are mandatory.' });
  }

  const users = store.get('users');
  const existing = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'User with this email already exists.' });
  }

  const newUser = store.insert('users', {
    name,
    email,
    role,
    department: department || 'General Operations',
    phone: phone || '+91 98000 00000',
    staffId: staffId || `STF-${Math.floor(100 + Math.random() * 900)}`,
    status: 'Active',
    joinedDate: new Date().toISOString().split('T')[0],
  });

  // Log to Audit trail
  store.insert('auditLogs', {
    user: req.user?.name || 'Hospital Admin',
    action: 'Staff Member Enrolled',
    module: 'HR & Governance',
    details: `Appointed ${name} as ${role} (${department})`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    severity: 'High',
  });

  return res.status(201).json({ success: true, message: 'User added successfully.', data: newUser });
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status, role, department } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (role) updates.role = role;
  if (department) updates.department = department;

  const updated = store.update('users', id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User record not found.' });
  }

  store.insert('auditLogs', {
    user: req.user?.name || 'Hospital Admin',
    action: `User Status Changed to ${status || 'Modified'}`,
    module: 'Governance',
    details: `Updated ${updated.name} (${updated.role}) - Status: ${updated.status || 'Active'}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    severity: 'Medium',
  });

  return res.json({ success: true, message: 'User profile updated.', data: updated });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = store.findById('users', id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const removed = store.delete('users', id);
  if (!removed) {
    return res.status(500).json({ success: false, message: 'Failed to remove user.' });
  }

  store.insert('auditLogs', {
    user: req.user?.name || 'Hospital Admin',
    action: 'Staff Member Terminated / Removed',
    module: 'Governance',
    details: `Terminated account: ${user.name} (${user.role} - ${user.email})`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    severity: 'High',
  });

  return res.json({ success: true, message: `User ${user.name} removed from hospital roster.` });
};

// --- Executive Report for Super Admin ---
export const getExecutiveReport = async (req, res) => {
  const users = store.get('users');
  const appointments = store.get('appointments');
  const beds = store.get('beds');
  const billing = store.get('billing');
  const transactions = store.get('transactions') || [];
  const auditLogs = store.get('auditLogs');

  const totalPatients = appointments.length;
  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const totalBeds = beds.length;
  const totalStaff = users.filter((u) => u.role !== 'patient').length;
  const totalRevenue = billing.reduce((acc, b) => acc + (b.subtotal || 0), 0);
  const paidRevenue = billing
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + (b.subtotal || 0), 0);

  const report = {
    generatedAt: new Date().toISOString(),
    institution: 'SHOS Multispecialty Hospital & Research Center',
    reportingAdmin: 'Hospital Operations Command',
    metrics: {
      totalStaff,
      totalPatients,
      bedOccupancyRate: `${Math.round((occupiedBeds / (totalBeds || 1)) * 100)}%`,
      occupiedBeds,
      totalBeds,
      totalRevenue,
      paidRevenue,
      pendingBilling: totalRevenue - paidRevenue,
    },
    staffSummary: users.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      department: u.department || 'N/A',
      status: u.status || 'Active',
      email: u.email,
    })),
    recentAudits: auditLogs.slice(0, 15),
    executiveNote: 'Institutional integrity verified. All departments performing under operational SLA guidelines.',
  };

  return res.json({ success: true, data: report });
};
