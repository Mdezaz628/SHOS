import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  getAuditLogs,
  getSecurityEvents,
  getAllUsers,
  createUser,
  updateUserStatus,
  deleteUser,
  getExecutiveReport,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.get('/audit-logs', getAuditLogs);
router.get('/security-events', getSecurityEvents);

// Staff & User Governance
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Executive Reporting for Super Admin
router.get('/executive-report', getExecutiveReport);

export default router;
