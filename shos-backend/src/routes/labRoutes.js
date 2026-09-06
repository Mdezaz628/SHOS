import express from 'express';
import { getLabOrders, createLabOrder, updateLabResult } from '../controllers/labController.js';

const router = express.Router();

router.get('/', getLabOrders);          // GET /api/lab
router.get('/orders', getLabOrders);   // GET /api/lab/orders (alias)
router.post('/', createLabOrder);
router.post('/orders', createLabOrder);
router.put('/:id/result', updateLabResult);

export default router;
