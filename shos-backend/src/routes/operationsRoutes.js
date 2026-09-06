import express from 'express';
import {
  getStaff,
  getParking,
  generateParkingPass,
  getBloodBank,
  getResources,
  getHospitalPlan,
  getAuditLogs,
  getSecurityEvents,
  getNotifications,
} from '../controllers/operationsController.js';

const router = express.Router();

router.get('/staff', getStaff);
router.get('/parking', getParking);
router.post('/parking/pass', generateParkingPass);
router.get('/blood-bank', getBloodBank);
router.get('/resources', getResources);
router.get('/hospital-plan', getHospitalPlan);   // GET /api/operations/hospital-plan
router.get('/audit-logs', getAuditLogs);          // GET /api/operations/audit-logs
router.get('/security-events', getSecurityEvents); // GET /api/operations/security-events
router.get('/notifications', getNotifications);   // GET /api/operations/notifications

export default router;
