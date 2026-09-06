import express from 'express';
import {
  getMedicines,
  getPrescriptions,
  createPrescription,
  dispensePrescription,
} from '../controllers/pharmacyController.js';

const router = express.Router();

router.get('/medicines', getMedicines);
router.get('/prescriptions', getPrescriptions);
router.post('/prescriptions', createPrescription);
router.put('/prescriptions/:id/dispense', dispensePrescription);

export default router;
