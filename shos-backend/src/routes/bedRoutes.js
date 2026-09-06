import express from 'express';
import { getBeds, updateBedStatus } from '../controllers/bedController.js';

const router = express.Router();

router.get('/', getBeds);
router.put('/:id/status', updateBedStatus);

export default router;
