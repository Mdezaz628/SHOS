import express from 'express';
import { getBills, payBill } from '../controllers/billingController.js';

const router = express.Router();

router.get('/', getBills);
router.post('/:id/pay', payBill);

export default router;
