import { db } from '../config/store.js';

export const companyController = {
  getCompanies: async (req, res) => {
    try {
      const companies = await db.companies.getAll();
      return res.json({ success: true, count: companies.length, companies });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await db.companies.getById(id);
      if (!company) {
        return res.status(404).json({ success: false, message: 'Company not found' });
      }
      
      // Also get jobs for this company
      const companyJobs = await db.jobs.getAll({ company_id: company.id });

      return res.json({ success: true, company, jobs: companyJobs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

export const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const { userId } = req.params;
      const notifs = await db.notifications.getByUser(userId);
      return res.json({ success: true, notifications: notifs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  markRead: async (req, res) => {
    try {
      const { id } = req.params;
      const notif = await db.notifications.markAsRead(id);
      return res.json({ success: true, notification: notif });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  markAllRead: async (req, res) => {
    try {
      const { userId } = req.body;
      await db.notifications.markAllAsRead(userId);
      return res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
