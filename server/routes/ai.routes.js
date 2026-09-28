import express from 'express';
import { aiController } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze-resume', aiController.analyzeResume);
router.post('/match-job', aiController.matchJob);
router.post('/generate-cover-letter', aiController.generateCoverLetter);
router.post('/generate-job-description', aiController.generateJobDescription);
router.get('/recommendations', aiController.recommendJobs);

// Google Gemini AI Routes
router.get('/google-key-status', aiController.getGoogleKeyStatus);
router.post('/google-key', aiController.setGoogleApiKey);
router.post('/smart-search', aiController.smartSearch);

export default router;
