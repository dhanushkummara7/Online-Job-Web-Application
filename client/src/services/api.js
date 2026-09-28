// API Service for communicating with backend

const BASE_URL = '/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the request');
  }
  return data;
};

export const api = {
  // Authentication & Profiles
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    verifyEmail: async (payload) => {
      const res = await fetch(`${BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    resendVerification: async (payload) => {
      const res = await fetch(`${BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    forgotPassword: async (payload) => {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    resetPassword: async (payload) => {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    demoSwitch: async (role) => {
      const res = await fetch(`${BASE_URL}/auth/demo-switch/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return handleResponse(res);
    },
    getMe: async (userId) => {
      const res = await fetch(`${BASE_URL}/auth/me?userId=${userId}`);
      return handleResponse(res);
    },
    updateProfile: async (id, data) => {
      const res = await fetch(`${BASE_URL}/auth/profile/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Jobs
  jobs: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'All') {
          query.append(key, val);
        }
      });
      const res = await fetch(`${BASE_URL}/jobs?${query.toString()}`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/jobs/${id}`);
      return handleResponse(res);
    },
    create: async (jobData) => {
      const res = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      return handleResponse(res);
    },
    update: async (id, jobData) => {
      const res = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(res);
    },
    getSaved: async (userId) => {
      const res = await fetch(`${BASE_URL}/jobs/saved/${userId}`);
      return handleResponse(res);
    },
    toggleSave: async (userId, jobId) => {
      const res = await fetch(`${BASE_URL}/jobs/saved/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobId })
      });
      return handleResponse(res);
    }
  },

  // Applications
  applications: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params);
      const res = await fetch(`${BASE_URL}/applications?${query.toString()}`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/applications/${id}`);
      return handleResponse(res);
    },
    apply: async (applicationData) => {
      const res = await fetch(`${BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });
      return handleResponse(res);
    },
    updateStatus: async (id, statusData) => {
      const res = await fetch(`${BASE_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData)
      });
      return handleResponse(res);
    }
  },

  // AI Services
  ai: {
    analyzeResume: async (resumeText, category) => {
      const res = await fetch(`${BASE_URL}/ai/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, category })
      });
      return handleResponse(res);
    },
    matchJob: async (candidateSkills, resumeText, jobId) => {
      const res = await fetch(`${BASE_URL}/ai/match-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateSkills, resumeText, jobId })
      });
      return handleResponse(res);
    },
    generateCoverLetter: async (details) => {
      const res = await fetch(`${BASE_URL}/ai/generate-cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      return handleResponse(res);
    },
    generateJobDescription: async (promptData) => {
      const res = await fetch(`${BASE_URL}/ai/generate-job-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData)
      });
      return handleResponse(res);
    },
    getRecommendations: async (userId) => {
      const res = await fetch(`${BASE_URL}/ai/recommendations?userId=${userId || ''}`);
      return handleResponse(res);
    }
  },

  // Companies
  companies: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/companies`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/companies/${id}`);
      return handleResponse(res);
    }
  },

  // Notifications
  notifications: {
    getByUser: async (userId) => {
      const res = await fetch(`${BASE_URL}/notifications/${userId}`);
      return handleResponse(res);
    },
    markRead: async (id) => {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT'
      });
      return handleResponse(res);
    },
    markAllRead: async (userId) => {
      const res = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      return handleResponse(res);
    }
  },

  // In-App Email & Notification Center
  email: {
    getInbox: async (email) => {
      const query = email ? `?email=${encodeURIComponent(email)}` : '';
      const res = await fetch(`${BASE_URL}/email/inbox${query}`);
      return handleResponse(res);
    },
    preview: async (id) => {
      const res = await fetch(`${BASE_URL}/email/preview/${id}`);
      return handleResponse(res);
    },
    markRead: async (id) => {
      const res = await fetch(`${BASE_URL}/email/mark-read/${id}`, { method: 'POST' });
      return handleResponse(res);
    },
    sendTest: async (email, name) => {
      const res = await fetch(`${BASE_URL}/email/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      return handleResponse(res);
    }
  },

  // Health / Supabase check
  getHealth: async () => {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse(res);
  }
};
