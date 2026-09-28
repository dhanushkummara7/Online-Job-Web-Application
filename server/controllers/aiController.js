import { aiService } from '../services/aiService.js';
import { googleAiService } from '../services/googleAiService.js';
import { db } from '../config/store.js';

export const aiController = {
  // Analyze Resume (ATS scoring, skill extraction, recommendations)
  analyzeResume: async (req, res) => {
    try {
      const { resumeText, category } = req.body;
      if (!resumeText) {
        return res.status(400).json({ success: false, message: 'Resume text is required for AI analysis.' });
      }

      const result = await aiService.analyzeResume(resumeText, category || 'Software Engineering');
      return res.json({ success: true, analysis: result });
    } catch (err) {
      console.error('analyzeResume error:', err);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Match resume/skills against a job
  matchJob: async (req, res) => {
    try {
      const { candidateSkills, resumeText, jobId } = req.body;
      const job = await db.jobs.getById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      const match = aiService.scoreJobMatch(candidateSkills || [], resumeText || '', job);
      return res.json({ success: true, match });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Generate tailored AI Cover Letter
  generateCoverLetter: async (req, res) => {
    try {
      const { candidateName, candidateSkills, candidateBio, jobTitle, companyName, jobRequirements } = req.body;
      const letter = await aiService.generateCoverLetter({
        candidateName,
        candidateSkills,
        candidateBio,
        jobTitle,
        companyName,
        jobRequirements
      });
      return res.json({ success: true, coverLetter: letter });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Generate AI Job Description for Recruiters
  generateJobDescription: async (req, res) => {
    try {
      const { title, category, experienceLevel, workplaceType, keyBullets } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Job title is required.' });
      }

      const generated = await aiService.generateJobDescription({
        title,
        category: category || 'Software Engineering',
        experienceLevel: experienceLevel || 'Mid Level',
        workplaceType: workplaceType || 'Remote',
        keyBullets: keyBullets || []
      });

      return res.json({ success: true, data: generated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Recommend jobs based on profile
  recommendJobs: async (req, res) => {
    try {
      const { userId } = req.query;
      const profile = userId ? await db.profiles.getById(userId) : null;
      const allJobs = await db.jobs.getAll();

      const recommended = aiService.recommendJobs(profile, allJobs);
      return res.json({ success: true, jobs: recommended });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // --- Real-Time Google Gemini AI API Key & Smart Search Integration ---

  // Check Google API Key Status
  getGoogleKeyStatus: async (req, res) => {
    try {
      const status = googleAiService.checkKeyStatus();
      return res.json({ success: true, status });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Set & Test Google API Key in real-time
  setGoogleApiKey: async (req, res) => {
    try {
      const { apiKey } = req.body;
      if (!apiKey) {
        return res.status(400).json({ success: false, message: 'Google API Key is required' });
      }

      // Test key directly against Google Gemini 1.5 Flash API
      const testResult = await googleAiService.testKey(apiKey);
      googleAiService.setApiKey(apiKey);

      return res.json({
        success: true,
        message: 'Google Gemini API Key connected successfully in real-time! ✨',
        status: googleAiService.checkKeyStatus()
      });
    } catch (err) {
      console.error('setGoogleApiKey error:', err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Real-time Semantic Smart Search using Google Gemini AI
  smartSearch: async (req, res) => {
    try {
      const { query, location } = req.body;
      const allJobs = await db.jobs.getAll();

      const searchResult = await googleAiService.smartSearch({
        query,
        location,
        jobs: allJobs
      });

      return res.json({
        success: true,
        count: searchResult.jobs.length,
        jobs: searchResult.jobs,
        isAiPowered: searchResult.isAiPowered,
        provider: searchResult.provider,
        intent: searchResult.intent
      });
    } catch (err) {
      console.error('smartSearch error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
