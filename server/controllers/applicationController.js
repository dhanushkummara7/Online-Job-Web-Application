import { db } from '../config/store.js';
import { aiService } from '../services/aiService.js';
import { emailService } from '../services/emailService.js';

export const applicationController = {
  // Get all applications with filters
  getApplications: async (req, res) => {
    try {
      const { applicant_id, recruiter_id, job_id } = req.query;
      const applications = await db.applications.getAll({ applicant_id, recruiter_id, job_id });
      return res.json({ success: true, count: applications.length, applications });
    } catch (err) {
      console.error('getApplications error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get application by ID
  getApplicationById: async (req, res) => {
    try {
      const { id } = req.params;
      const application = await db.applications.getById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      return res.json({ success: true, application });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Submit new application
  apply: async (req, res) => {
    try {
      const { job_id, applicant_id, resume_url, resume_text, cover_letter } = req.body;

      if (!job_id || !applicant_id) {
        return res.status(400).json({ success: false, message: 'job_id and applicant_id are required.' });
      }

      const job = await db.jobs.getById(job_id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Target job position not found.' });
      }

      const applicant = await db.profiles.getById(applicant_id);
      const textToAnalyze = resume_text || applicant?.resume_text || applicant?.bio || '';
      const candidateSkills = applicant?.skills || [];

      // Run AI match scoring against target job
      const aiMatch = aiService.scoreJobMatch(candidateSkills, textToAnalyze, job);

      const newApplication = await db.applications.create({
        job_id,
        applicant_id,
        resume_url: resume_url || applicant?.resume_url || '',
        resume_text: textToAnalyze,
        cover_letter: cover_letter || '',
        match_score: aiMatch.score,
        ai_analysis: {
          overall_fit: aiMatch.rating,
          score: aiMatch.score,
          matched_skills: aiMatch.matched_skills,
          missing_skills: aiMatch.missing_skills,
          verdict: aiMatch.verdict,
          submitted_at: new Date().toISOString()
        }
      });

      // Dispatch Confirmation Email to Applicant
      if (applicant?.email) {
        await emailService.sendApplicationSubmittedEmail(
          applicant.email,
          applicant.name || 'Job Seeker',
          job.title,
          job.company?.name || 'Company',
          newApplication.match_score
        );
      }

      // Dispatch Notification Email to Recruiter (if recruiter profile exists)
      if (job.recruiter_id) {
        const recruiter = await db.profiles.getById(job.recruiter_id);
        if (recruiter?.email) {
          await emailService.sendNewCandidateAlertEmail(
            recruiter.email,
            recruiter.name || 'Hiring Manager',
            applicant?.name || 'A Candidate',
            job.title,
            newApplication.match_score
          );
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully! Confirmation email dispatched.',
        application: newApplication
      });
    } catch (err) {
      console.error('Apply error:', err);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Update application status & recruiter notes
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, recruiter_notes, interview_date } = req.body;

      const updates = {};
      if (status) updates.status = status;
      if (recruiter_notes !== undefined) updates.recruiter_notes = recruiter_notes;
      if (interview_date !== undefined) updates.interview_date = interview_date;

      const updated = await db.applications.update(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // If status updated, notify applicant via email
      if (status && updated.applicant?.email) {
        await emailService.sendApplicationStatusEmail(
          updated.applicant.email,
          updated.applicant.name || 'Candidate',
          updated.job?.title || 'Applied Position',
          updated.job?.company?.name || 'Company',
          status,
          interview_date
        );
      }

      return res.json({
        success: true,
        message: `Application updated to ${status || 'new status'} and applicant notified via email`,
        application: updated
      });
    } catch (err) {
      console.error('updateStatus error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
