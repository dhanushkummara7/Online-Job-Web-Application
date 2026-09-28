import express from 'express';
import { emailService, sentEmails } from '../services/emailService.js';

const router = express.Router();

// Get emails for a user or all if not specified
router.get('/inbox', (req, res) => {
  try {
    const { email } = req.query;
    const emails = emailService.getEmailsForUser(email);
    return res.json({
      success: true,
      count: emails.length,
      emails
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single email details / preview
router.get('/preview/:id', (req, res) => {
  try {
    const email = emailService.getEmailById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    email.read = true;
    return res.json({ success: true, email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Render raw HTML email for iframe or direct link
router.get('/render/:id', (req, res) => {
  try {
    const email = emailService.getEmailById(req.params.id);
    if (!email) {
      return res.status(404).send('<h2>Email not found</h2>');
    }
    email.read = true;
    res.setHeader('Content-Type', 'text/html');
    return res.send(email.html);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

// Mark email as read
router.post('/mark-read/:id', (req, res) => {
  try {
    const email = emailService.getEmailById(req.params.id);
    if (email) {
      email.read = true;
    }
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Send test email
router.post('/send-test', async (req, res) => {
  try {
    const { email, name = 'Valued User' } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Recipient email is required.' });
    }

    const testEmail = await emailService.sendEmail({
      to: email,
      subject: 'CareerPulse AI - System Health & Email Notification Test 🔔',
      text: `Hello ${name}, this is a test email sent from CareerPulse AI platform to confirm your email notification channels are configured properly.`,
      html: `
        <div style="font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px;">
          <h2 style="color: #6366f1;">CareerPulse AI Email Notification Test ✅</h2>
          <p>Hi ${name},</p>
          <p>This is a confirmation test email verifying that your email notifications and alerts are properly active.</p>
          <div style="background: #1e293b; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #10b981; font-size: 13px;">
            Status: Active & Verified<br>
            Timestamp: ${new Date().toLocaleString()}
          </div>
        </div>
      `,
      type: 'general'
    });

    return res.json({ success: true, message: 'Test email sent successfully!', email: testEmail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
