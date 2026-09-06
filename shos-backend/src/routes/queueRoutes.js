import express from 'express';
import { getLiveQueue, advanceQueue } from '../controllers/queueController.js';

const router = express.Router();

router.get('/', getLiveQueue);
router.post('/advance', advanceQueue);

export default router;
