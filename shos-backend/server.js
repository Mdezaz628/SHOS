import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import queueRoutes from './src/routes/queueRoutes.js';
import bedRoutes from './src/routes/bedRoutes.js';
import labRoutes from './src/routes/labRoutes.js';
import pharmacyRoutes from './src/routes/pharmacyRoutes.js';
import billingRoutes from './src/routes/billingRoutes.js';
import emergencyRoutes from './src/routes/emergencyRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import operationsRoutes from './src/routes/operationsRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import financeRoutes from './src/routes/financeRoutes.js';

import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

import fs from 'fs';

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SHOS Unified Hospital Operations Backend',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Client Error Telemetry Endpoint
app.post('/api/telemetry/client-error', (req, res) => {
  try {
    const errorData = {
      receivedAt: new Date().toISOString(),
      ...req.body
    };
    fs.writeFileSync('./client-error.log', JSON.stringify(errorData, null, 2));
    console.error('🚨 [CLIENT ERROR TELEMETRY CAPTURED]:', errorData);
  } catch (e) {
    console.error('Error logging client error:', e);
  }
  res.json({ status: 'CAPTURED' });
});

// API Routes Mounted
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/finance', financeRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Listen on 0.0.0.0 so both localhost and mobile devices on LAN can connect
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🏥 SHOS Unified Hospital Operations API`);
  console.log(`📡 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://172.29.35.227:${PORT}`);
  console.log(`=======================================================`);
});
