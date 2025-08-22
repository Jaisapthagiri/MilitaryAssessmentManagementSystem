import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import refRoutes from './src/routes/refRoutes.js';
import purchaseRoutes from './src/routes/purchaseRoutes.js';
import transferRoutes from './src/routes/transferRoutes.js';
import assignmentRoutes from './src/routes/assignmentRoutes.js';
import expenditureRoutes from './src/routes/expenditureRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import { apiLogger } from './src/middleware/apiLogger.js';
import { seedIfNeeded } from './src/seed/seed.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(apiLogger);

app.get('/', (req, res) =>
  res.json({ ok: true, message: 'Military Asset Management API' })
);

app.use('/api/auth', authRoutes);
app.use('/api', refRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/dashboard', dashboardRoutes);

connectDB().then(async () => {
  if (process.env.SEED_ON_START === 'true') {
    await seedIfNeeded();
  }
}).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});

export default app;   
