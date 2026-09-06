import express from 'express';
import { getAppointments, createAppointment, cancelAppointment } from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id/cancel', cancelAppointment);

export default router;
