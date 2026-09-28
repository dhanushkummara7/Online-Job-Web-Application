import { db } from '../config/store.js';

export const jobController = {
  // Get all jobs with filtering
  getJobs: async (req, res) => {
    try {
      const { search, location, category, workplace_type, job_type, experience_level, min_salary, recruiter_id, company_id } = req.query;
      const jobs = await db.jobs.getAll({
        search,
        location,
        category,
        workplace_type,
        job_type,
        experience_level,
        min_salary,
        recruiter_id,
        company_id
      });
      return res.json({ success: true, count: jobs.length, jobs });
    } catch (err) {
      console.error('getJobs error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get single job by ID
  getJobById: async (req, res) => {
    try {
      const { id } = req.params;
      const job = await db.jobs.getById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      // increment view count
      await db.jobs.incrementViews(id);
      return res.json({ success: true, job });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Create new job posting
  createJob: async (req, res) => {
    try {
      const {
        title,
        company_id,
        recruiter_id,
        category,
        description,
        responsibilities,
        requirements,
        skills_required,
        location,
        workplace_type,
        job_type,
        experience_level,
        salary_min,
        salary_max,
        deadline
      } = req.body;

      if (!title || !category || !description) {
        return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
      }

      // Default company if not provided
      let finalCompanyId = company_id;
      if (!finalCompanyId) {
        const companies = await db.companies.getAll();
        finalCompanyId = companies[0]?.id || 'c-stripe';
      }

      const newJob = await db.jobs.create({
        recruiter_id: recruiter_id || 'u-recruiter-1',
        company_id: finalCompanyId,
        title,
        category,
        description,
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        skills_required: Array.isArray(skills_required) ? skills_required : [],
        location: location || 'Bengaluru, Karnataka, India',
        workplace_type: workplace_type || 'Remote',
        job_type: job_type || 'Full-time',
        experience_level: experience_level || 'Mid Level',
        salary_min: Number(salary_min) || 2500000,
        salary_max: Number(salary_max) || 4500000,
        currency: 'INR',
        is_featured: false,
        status: 'Active',
        deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      return res.status(201).json({ success: true, job: newJob });
    } catch (err) {
      console.error('createJob error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Update existing job
  updateJob: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await db.jobs.update(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      return res.json({ success: true, job: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Delete job
  deleteJob: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db.jobs.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      return res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Saved Jobs
  getSavedJobs: async (req, res) => {
    try {
      const { userId } = req.params;
      const saved = await db.savedJobs.getByUser(userId);
      return res.json({ success: true, savedJobs: saved });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  toggleSaveJob: async (req, res) => {
    try {
      const { userId, jobId } = req.body;
      if (!userId || !jobId) {
        return res.status(400).json({ success: false, message: 'userId and jobId required' });
      }
      const result = await db.savedJobs.toggle(userId, jobId);
      return res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
