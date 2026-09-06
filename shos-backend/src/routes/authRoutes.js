import express from 'express';
import {
  login,
  register,
  switchRole,
  getProfile,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/switch-role', switchRole);
router.get('/profile', authenticate, getProfile);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
