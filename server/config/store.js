// Resilient Data Store with Supabase support & fallback memory persistence
import { initialProfiles, initialCompanies, initialJobs, initialApplications, initialSavedJobs, initialNotifications } from '../data/seedData.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// In-Memory Data Store (Initialized with rich seed data)
export const memoryDb = {
  profiles: [...initialProfiles],
  companies: [...initialCompanies],
  jobs: [...initialJobs],
  applications: [...initialApplications],
  savedJobs: [...initialSavedJobs],
  notifications: [...initialNotifications]
};

// Supabase client instance (if configured)
let supabaseClient = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Connected to Supabase Cloud Instance:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Supabase client initialization warning, using in-memory store:', err.message);
  }
} else {
  console.log('ℹ️ Running with Built-in Resilient Store & Rich Real-World Seed Data.');
}

export const getSupabase = () => supabaseClient;

// Helper DB Services that work seamlessly with memory store or Supabase
export const db = {
  // Profiles / Users
  profiles: {
    getAll: async () => memoryDb.profiles,
    getById: async (id) => memoryDb.profiles.find(p => p.id === id) || null,
    getByEmail: async (email) => memoryDb.profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null,
    create: async (data) => {
      const newProfile = {
        id: data.id || `u-${Date.now()}`,
        skills: [],
        experience: [],
        education: [],
        preferences: { remote: true, job_types: ["Full-time"], expected_salary: 100000 },
        created_at: new Date().toISOString(),
        ...data
      };
      memoryDb.profiles.push(newProfile);
      return newProfile;
    },
    update: async (id, updates) => {
      const idx = memoryDb.profiles.findIndex(p => p.id === id);
      if (idx === -1) return null;
      memoryDb.profiles[idx] = { ...memoryDb.profiles[idx], ...updates, updated_at: new Date().toISOString() };
      return memoryDb.profiles[idx];
    }
  },

  // Companies
  companies: {
    getAll: async () => memoryDb.companies,
    getById: async (id) => memoryDb.companies.find(c => c.id === id || c.slug === id) || null,
    create: async (data) => {
      const newCompany = {
        id: data.id || `c-${Date.now()}`,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        verified: true,
        rating: 4.8,
        reviews_count: 1,
        benefits: data.benefits || [],
        created_at: new Date().toISOString(),
        ...data
      };
      memoryDb.companies.push(newCompany);
      return newCompany;
    },
    update: async (id, updates) => {
      const idx = memoryDb.companies.findIndex(c => c.id === id);
      if (idx === -1) return null;
      memoryDb.companies[idx] = { ...memoryDb.companies[idx], ...updates };
      return memoryDb.companies[idx];
    }
  },

  // Jobs
  jobs: {
    getAll: async (filters = {}) => {
      let result = [...memoryDb.jobs];
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(j => 
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.skills_required?.some(s => s.toLowerCase().includes(query)) ||
          j.location.toLowerCase().includes(query)
        );
      }

      if (filters.location && filters.location !== 'All' && filters.location !== 'All India') {
        const locQuery = filters.location.toLowerCase();
        result = result.filter(j => 
          j.location.toLowerCase().includes(locQuery) ||
          (locQuery.includes('remote') && (j.workplace_type === 'Remote' || j.location.toLowerCase().includes('remote'))) ||
          ((locQuery.includes('delhi') || locQuery.includes('ncr')) && (j.location.toLowerCase().includes('gurgaon') || j.location.toLowerCase().includes('noida') || j.location.toLowerCase().includes('delhi')))
        );
      }

      if (filters.category && filters.category !== 'All') {
        result = result.filter(j => j.category.toLowerCase() === filters.category.toLowerCase());
      }

      if (filters.workplace_type && filters.workplace_type !== 'All') {
        result = result.filter(j => j.workplace_type === filters.workplace_type);
      }

      if (filters.job_type && filters.job_type !== 'All') {
        result = result.filter(j => j.job_type === filters.job_type);
      }

      if (filters.experience_level && filters.experience_level !== 'All') {
        result = result.filter(j => j.experience_level === filters.experience_level);
      }

      if (filters.min_salary) {
        result = result.filter(j => j.salary_max >= Number(filters.min_salary));
      }

      if (filters.recruiter_id) {
        result = result.filter(j => j.recruiter_id === filters.recruiter_id);
      }

      if (filters.company_id) {
        result = result.filter(j => j.company_id === filters.company_id);
      }

      // Attach company details
      return result.map(job => {
        const company = memoryDb.companies.find(c => c.id === job.company_id);
        return { ...job, company };
      });
    },
    getById: async (id) => {
      const job = memoryDb.jobs.find(j => j.id === id);
      if (!job) return null;
      const company = memoryDb.companies.find(c => c.id === job.company_id);
      return { ...job, company };
    },
    create: async (data) => {
      const newJob = {
        id: data.id || `job-${Date.now()}`,
        status: data.status || 'Active',
        views_count: 0,
        applicants_count: 0,
        skills_required: data.skills_required || [],
        responsibilities: data.responsibilities || [],
        requirements: data.requirements || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data
      };
      memoryDb.jobs.unshift(newJob);
      const company = memoryDb.companies.find(c => c.id === newJob.company_id);
      return { ...newJob, company };
    },
    update: async (id, updates) => {
      const idx = memoryDb.jobs.findIndex(j => j.id === id);
      if (idx === -1) return null;
      memoryDb.jobs[idx] = { ...memoryDb.jobs[idx], ...updates, updated_at: new Date().toISOString() };
      const company = memoryDb.companies.find(c => c.id === memoryDb.jobs[idx].company_id);
      return { ...memoryDb.jobs[idx], company };
    },
    delete: async (id) => {
      const idx = memoryDb.jobs.findIndex(j => j.id === id);
      if (idx === -1) return false;
      memoryDb.jobs.splice(idx, 1);
      return true;
    },
    incrementViews: async (id) => {
      const job = memoryDb.jobs.find(j => j.id === id);
      if (job) job.views_count = (job.views_count || 0) + 1;
    }
  },

  // Applications
  applications: {
    getAll: async (filters = {}) => {
      let result = [...memoryDb.applications];
      if (filters.applicant_id) {
        result = result.filter(a => a.applicant_id === filters.applicant_id);
      }
      if (filters.job_id) {
        result = result.filter(a => a.job_id === filters.job_id);
      }
      if (filters.recruiter_id) {
        const recruiterJobs = memoryDb.jobs.filter(j => j.recruiter_id === filters.recruiter_id).map(j => j.id);
        result = result.filter(a => recruiterJobs.includes(a.job_id));
      }

      // Populate applicant profile and job details
      return result.map(app => {
        const job = memoryDb.jobs.find(j => j.id === app.job_id);
        const company = job ? memoryDb.companies.find(c => c.id === job.company_id) : null;
        const applicant = memoryDb.profiles.find(p => p.id === app.applicant_id);
        return {
          ...app,
          job: job ? { ...job, company } : null,
          applicant
        };
      });
    },
    getById: async (id) => {
      const app = memoryDb.applications.find(a => a.id === id);
      if (!app) return null;
      const job = memoryDb.jobs.find(j => j.id === app.job_id);
      const company = job ? memoryDb.companies.find(c => c.id === job.company_id) : null;
      const applicant = memoryDb.profiles.find(p => p.id === app.applicant_id);
      return {
        ...app,
        job: job ? { ...job, company } : null,
        applicant
      };
    },
    create: async (data) => {
      // Check existing application
      const existing = memoryDb.applications.find(a => a.job_id === data.job_id && a.applicant_id === data.applicant_id);
      if (existing) {
        throw new Error('You have already applied for this position.');
      }

      const newApp = {
        id: data.id || `app-${Date.now()}`,
        status: 'Applied',
        match_score: data.match_score || 85,
        ai_analysis: data.ai_analysis || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data
      };
      memoryDb.applications.unshift(newApp);

      // Increment job applicants count
      const job = memoryDb.jobs.find(j => j.id === data.job_id);
      if (job) {
        job.applicants_count = (job.applicants_count || 0) + 1;
      }

      // Add notification for recruiter
      if (job && job.recruiter_id) {
        memoryDb.notifications.unshift({
          id: `notif-${Date.now()}`,
          user_id: job.recruiter_id,
          title: 'New Candidate Applied',
          message: `A candidate submitted an application for "${job.title}" with an AI match score of ${newApp.match_score}%.`,
          type: 'info',
          read: false,
          link: `/recruiter/jobs/${job.id}`,
          created_at: new Date().toISOString()
        });
      }

      return newApp;
    },
    update: async (id, updates) => {
      const idx = memoryDb.applications.findIndex(a => a.id === id);
      if (idx === -1) return null;
      
      const prevStatus = memoryDb.applications[idx].status;
      memoryDb.applications[idx] = { 
        ...memoryDb.applications[idx], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };

      const updatedApp = memoryDb.applications[idx];
      const job = memoryDb.jobs.find(j => j.id === updatedApp.job_id);

      // If status changed, notify applicant
      if (updates.status && updates.status !== prevStatus) {
        memoryDb.notifications.unshift({
          id: `notif-${Date.now()}`,
          user_id: updatedApp.applicant_id,
          title: `Application Status Updated: ${updates.status}`,
          message: `Your application for "${job?.title || 'Position'}" was updated to: ${updates.status}.`,
          type: updates.status === 'Interviewing' || updates.status === 'Offered' ? 'success' : 'info',
          read: false,
          link: '/applications',
          created_at: new Date().toISOString()
        });
      }

      return updatedApp;
    }
  },

  // Saved Jobs
  savedJobs: {
    getByUser: async (userId) => {
      const saved = memoryDb.savedJobs.filter(s => s.user_id === userId);
      return saved.map(s => {
        const job = memoryDb.jobs.find(j => j.id === s.job_id);
        const company = job ? memoryDb.companies.find(c => c.id === job.company_id) : null;
        return {
          ...s,
          job: job ? { ...job, company } : null
        };
      });
    },
    toggle: async (userId, jobId) => {
      const idx = memoryDb.savedJobs.findIndex(s => s.user_id === userId && s.job_id === jobId);
      if (idx !== -1) {
        memoryDb.savedJobs.splice(idx, 1);
        return { saved: false };
      } else {
        const newSaved = {
          id: `saved-${Date.now()}`,
          user_id: userId,
          job_id: jobId,
          created_at: new Date().toISOString()
        };
        memoryDb.savedJobs.push(newSaved);
        return { saved: true, item: newSaved };
      }
    }
  },

  // Notifications
  notifications: {
    getByUser: async (userId) => {
      return memoryDb.notifications.filter(n => n.user_id === userId);
    },
    markAsRead: async (id) => {
      const notif = memoryDb.notifications.find(n => n.id === id);
      if (notif) notif.read = true;
      return notif;
    },
    markAllAsRead: async (userId) => {
      memoryDb.notifications.filter(n => n.user_id === userId).forEach(n => n.read = true);
      return true;
    }
  }
};
