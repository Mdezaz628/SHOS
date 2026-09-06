import express from 'express';
import {
  getAIPredictions,
  getHospitalPlan,
  getAIRecommendations,
  approveRecommendation,
  rejectRecommendation,
} from '../controllers/aiController.js';

const router = express.Router();

router.get('/predictions', getAIPredictions);
router.get('/hospital-plan', getHospitalPlan);
router.get('/recommendations', getAIRecommendations);
router.post('/recommendations/:id/approve', approveRecommendation);
router.post('/recommendations/:id/reject', rejectRecommendation);

export default router;
