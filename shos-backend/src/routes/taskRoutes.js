import express from 'express';
import { getTasks, advanceTaskStatus } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.put('/:id/advance', advanceTaskStatus);

export default router;
