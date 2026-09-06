import express from 'express';
import { getFinancialOverview, recordTransaction } from '../controllers/financeController.js';

const router = express.Router();

router.get('/overview', getFinancialOverview);
router.post('/record', recordTransaction);

export default router;
