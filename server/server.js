import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/jobs.routes.js';
import applicationRoutes from './routes/applications.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { companyRouter, notificationRouter } from './routes/companies.routes.js';
import emailRoutes from './routes/email.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/companies', companyRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AI-Powered Online Job Portal API',
    supabase_configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://your-project.supabase.co'),
    features: [
      'Dual Role Portals (Job Seeker & Recruiter)',
      'AI Resume ATS Analyzer & Skill Gap Matcher',
      'AI Job Match Scorer',
      'AI Job Description Generator',
      'AI Cover Letter Generator',
      'Application Pipeline & Status Tracker',
      'Saved Jobs & In-App Notifications'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Job Portal API Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
