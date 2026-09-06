import express from 'express';
import { getEmergencyStatus, getAmbulances, requestEmergencySOS, updateAmbulanceStatus } from '../controllers/emergencyController.js';

const router = express.Router();

router.get('/', getEmergencyStatus);                          // GET /api/emergency
router.get('/active', getEmergencyStatus);                   // GET /api/emergency/active
router.get('/ambulances', getAmbulances);                    // GET /api/emergency/ambulances
router.post('/sos', requestEmergencySOS);
router.put('/ambulances/:id/status', updateAmbulanceStatus);

export default router;
