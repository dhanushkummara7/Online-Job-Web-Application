import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// In-Memory store of sent emails so users can inspect received emails in-app
export const sentEmails = [
  {
    id: 'em-welcome-demo-seeker',
    to: 'sarah.jenkins@example.com',
    from: '"CareerPulse AI" <noreply@careerpulse.ai>',
    subject: 'Welcome to CareerPulse AI! 🚀 Next Steps for Your Career',
    preview: 'Welcome Sarah! Your profile is verified and ready. Discover top engineering opportunities matched to your skills...',
    type: 'welcome',
    role: 'seeker',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: true,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-top: 8px; color: #fff; }
          .content { padding: 32px 24px; }
          h1 { font-size: 20px; font-weight: 700; color: #f8fafc; margin-top: 0; }
          p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
          .step-card { background: #1e293b; border-radius: 12px; padding: 16px; margin: 12px 0; border-left: 4px solid #6366f1; }
          .step-title { font-weight: 600; color: #f1f5f9; font-size: 14px; }
          .step-desc { font-size: 13px; color: #94a3b8; margin-top: 4px; }
          .btn { display: inline-block; background: #6366f1; color: #ffffff !important; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; text-decoration: none; margin: 20px 0; text-align: center; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#c7d2fe;">AI</span></div>
            <div class="badge">Job Seeker Verified</div>
          </div>
          <div class="content">
            <h1>Welcome aboard, Sarah! 👋</h1>
            <p>Your CareerPulse AI account is now active. You have full access to high-impact software engineering roles, automated ATS resume scoring, and direct recruiter pipelines.</p>
            
            <div class="step-card">
              <div class="step-title">1. AI Resume Studio</div>
              <div class="step-desc">Test your resume against top tech job descriptions to get instant ATS scores and missing keyword recommendations.</div>
            </div>

            <div class="step-card">
              <div class="step-title">2. Smart Matching Engine</div>
              <div class="step-desc">Explore curated positions in Bengaluru, Hyderabad, Mumbai, and Remote with verified salaries up to ₹65 LPA.</div>
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3000" class="btn">Explore Verified Jobs</a>
            </div>
          </div>
          <div class="footer">
            © 2026 CareerPulse AI Portal. Secure Job Platform.<br>
            Sent to sarah.jenkins@example.com
          </div>
        </div>
      </body>
      </html>
    `
  },
  {
    id: 'em-welcome-demo-recruiter',
    to: 'marcus.recruiter@stripe.com',
    from: '"CareerPulse AI" <noreply@careerpulse.ai>',
    subject: 'Welcome to CareerPulse AI for Recruiters! 💼 Hire Top Tech Talent',
    preview: 'Welcome Marcus! Your Stripe recruiter profile is live. Post jobs with AI descriptions and review scored candidates...',
    type: 'welcome',
    role: 'recruiter',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    read: true,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 32px 24px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #ffffff; }
          .content { padding: 32px 24px; }
          h1 { font-size: 20px; font-weight: 700; color: #f8fafc; margin-top: 0; }
          p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
          .btn { display: inline-block; background: #7c3aed; color: #ffffff !important; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; text-decoration: none; margin: 20px 0; text-align: center; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#f3e8ff;">Recruiter</span></div>
          </div>
          <div class="content">
            <h1>Welcome, Marcus! 🚀</h1>
            <p>Your recruiter hub for <strong>Stripe India</strong> is ready. Start posting openings with AI-generated job specifications and screen pre-ranked applicants instantly.</p>
            <div style="text-align: center;">
              <a href="http://localhost:3000" class="btn">Open Recruiter Hub</a>
            </div>
          </div>
          <div class="footer">
            © 2026 CareerPulse AI. Sent to marcus.recruiter@stripe.com
          </div>
        </div>
      </body>
      </html>
    `
  }
];

// Initialize Nodemailer Transporter if SMTP configured
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('📧 SMTP transporter initialized for host:', process.env.SMTP_HOST);
  } catch (err) {
    console.warn('⚠️ SMTP Transporter init failed, running in resilient simulated mode:', err.message);
  }
} else {
  console.log('ℹ️ Nodemailer ready with built-in Interactive In-App Email Viewer & preview system.');
}

export const emailService = {
  // Send email helper
  sendEmail: async ({ to, subject, html, text, type = 'general', code = null, role = 'seeker' }) => {
    const emailRecord = {
      id: `em-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      to,
      from: '"CareerPulse AI" <noreply@careerpulse.ai>',
      subject,
      preview: text ? text.substring(0, 140) + '...' : subject,
      html,
      text: text || '',
      type,
      code,
      role,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Save to sent emails repository
    sentEmails.unshift(emailRecord);

    // If real transporter available, dispatch concurrently
    if (transporter) {
      try {
        await transporter.sendMail({
          from: emailRecord.from,
          to,
          subject,
          text,
          html
        });
        console.log(`[SMTP] Successfully delivered email "${subject}" to ${to}`);
      } catch (err) {
        console.warn(`[SMTP Delivery Warning] ${err.message}. Retained in in-app email inbox.`);
      }
    } else {
      console.log(`📨 [Email Simulated] To: ${to} | Subject: "${subject}" | Code: ${code || 'N/A'}`);
    }

    return emailRecord;
  },

  // 1. Send Verification Code Email
  sendVerificationEmail: async (toEmail, userName, code, role = 'seeker') => {
    const subject = `Verify your CareerPulse AI account - Code: ${code}`;
    const text = `Hi ${userName}, your verification code for CareerPulse AI is ${code}. Enter this code on the verification screen to activate your account. This code expires in 15 minutes.`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; }
          .logo { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .badge { display: inline-block; background: rgba(255,255,255,0.25); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; color: #ffffff; letter-spacing: 0.5px; }
          .content { padding: 32px 28px; }
          h1 { font-size: 22px; font-weight: 700; color: #f8fafc; margin-top: 0; margin-bottom: 12px; }
          p { font-size: 15px; line-height: 1.6; color: #94a3b8; margin-top: 0; }
          .code-box { background: #1e1b4b; border: 2px dashed #6366f1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
          .code-label { font-size: 12px; text-transform: uppercase; color: #a5b4fc; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; }
          .code-value { font-size: 38px; font-family: 'Courier New', Courier, monospace; font-weight: 800; color: #ffffff; letter-spacing: 8px; line-height: 1; }
          .code-note { font-size: 12px; color: #818cf8; margin-top: 8px; }
          .features { background: #1e293b; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .features-title { font-weight: 600; color: #e2e8f0; font-size: 13px; margin-bottom: 8px; }
          .features-item { font-size: 13px; color: #94a3b8; display: flex; align-items: center; gap: 8px; margin: 6px 0; }
          .footer { padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
          .tag { color: #6366f1; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#c7d2fe;">AI</span></div>
            <div class="badge">Security & Authentication</div>
          </div>
          <div class="content">
            <h1>Welcome, ${userName}! 🎯</h1>
            <p>Thank you for creating an account as a <strong style="color:#a5b4fc;">${role === 'recruiter' ? 'Verified Recruiter' : 'Job Seeker'}</strong>. To complete your registration and protect your security, please verify your email address.</p>
            
            <div class="code-box">
              <div class="code-label">Your 6-Digit Verification Code</div>
              <div class="code-value">${code}</div>
              <div class="code-note">⏳ Valid for 15 minutes. Never share this code.</div>
            </div>

            <p style="font-size: 13px; color: #64748b; margin-top: 16px;">
              If you didn't request this registration, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            © 2026 CareerPulse AI Portal. Next-Gen Tech Hiring & Career Platform.<br>
            Delivered securely to ${toEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    return await emailService.sendEmail({
      to: toEmail,
      subject,
      html,
      text,
      type: 'verification',
      code,
      role
    });
  },

  // 2. Send Welcome Confirmation Email
  sendWelcomeEmail: async (toEmail, userName, role = 'seeker') => {
    const subject = `Welcome to CareerPulse AI, ${userName}! 🎉 Your account is verified`;
    const text = `Hi ${userName}, your CareerPulse AI account is now officially verified and ready. Start exploring AI jobs or posting listings today!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; }
          .logo { font-size: 26px; font-weight: 800; color: #ffffff; }
          .content { padding: 32px 28px; }
          h1 { font-size: 22px; font-weight: 700; color: #f8fafc; margin-top: 0; }
          p { font-size: 15px; line-height: 1.6; color: #94a3b8; }
          .card { background: #1e293b; border-radius: 12px; padding: 18px; margin: 16px 0; border: 1px solid #334155; }
          .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 12px 30px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; margin: 18px 0; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#a7f3d0;">AI</span></div>
            <div style="color:#ecfdf5; font-size: 12px; font-weight: 600; margin-top: 6px;">ACCOUNT ACTIVATED</div>
          </div>
          <div class="content">
            <h1>You're all set, ${userName}! 🚀</h1>
            <p>Your email address is verified. You now have full access to CareerPulse AI's suite of smart career tools.</p>
            
            <div class="card">
              <strong style="color:#ffffff;">What you can do right now:</strong>
              <ul style="color:#94a3b8; font-size: 14px; padding-left: 20px; margin-top: 8px;">
                ${role === 'seeker' 
                  ? `<li>Upload your CV in the AI Resume Studio for real-time ATS match scoring</li>
                     <li>Filter jobs across Bengaluru, Hyderabad, Delhi NCR, Mumbai & Remote</li>
                     <li>Track your real-time application stages and interviews</li>`
                  : `<li>Post new tech openings with automated AI job description generator</li>
                     <li>Review ranked applicants filtered by skill compatibility scores</li>
                     <li>Manage candidate hiring pipelines seamlessly</li>`
                }
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3000" class="btn">Launch Platform</a>
            </div>
          </div>
          <div class="footer">
            © 2026 CareerPulse AI Portal. Sent to ${toEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    return await emailService.sendEmail({
      to: toEmail,
      subject,
      html,
      text,
      type: 'welcome',
      role
    });
  },

  // 3. Send Password Reset Email
  sendPasswordResetEmail: async (toEmail, userName, code) => {
    const subject = `Reset your CareerPulse AI password - Code: ${code}`;
    const text = `Hi ${userName}, we received a request to reset your CareerPulse AI password. Use code: ${code}. Valid for 15 minutes.`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #e11d48 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #ffffff; }
          .content { padding: 32px 28px; }
          .code-box { background: #3b0764; border: 2px dashed #c084fc; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .code-value { font-size: 36px; font-family: monospace; font-weight: 800; color: #ffffff; letter-spacing: 6px; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#fecdd3;">Security</span></div>
          </div>
          <div class="content">
            <h2 style="color:#ffffff; margin-top:0;">Password Reset Request</h2>
            <p style="color:#94a3b8; font-size:14px; line-height:1.6;">
              Hello ${userName}, we received a request to reset the password for your account associated with <strong>${toEmail}</strong>.
            </p>
            <div class="code-box">
              <div style="font-size:12px; color:#e9d5ff; font-weight:700; text-transform:uppercase;">Password Reset Code</div>
              <div class="code-value">${code}</div>
              <div style="font-size:12px; color:#d8b4fe; margin-top:6px;">Expires in 15 minutes</div>
            </div>
            <p style="color:#64748b; font-size:13px;">If you didn't request this change, please ignore this email or review your security settings.</p>
          </div>
          <div class="footer">© 2026 CareerPulse AI Portal.</div>
        </div>
      </body>
      </html>
    `;

    return await emailService.sendEmail({
      to: toEmail,
      subject,
      html,
      text,
      type: 'password_reset',
      code
    });
  },

  // 4. Send Application Submitted Confirmation Email (To Seeker)
  sendApplicationSubmittedEmail: async (toEmail, applicantName, jobTitle, companyName, matchScore = 85) => {
    const subject = `Application Confirmed: ${jobTitle} at ${companyName} 📄`;
    const text = `Hi ${applicantName}, your application for "${jobTitle}" at ${companyName} has been received with an AI compatibility score of ${matchScore}%. The hiring team has been notified.`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px 24px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #ffffff; }
          .content { padding: 32px 28px; }
          .badge { display: inline-block; background: #059669; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; }
          .job-card { background: #1e293b; border-radius: 12px; padding: 18px; margin: 20px 0; border-left: 4px solid #4f46e5; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#a5f3fc;">AI</span></div>
            <div class="badge">Application Received</div>
          </div>
          <div class="content">
            <h2 style="color:#ffffff; margin-top:0;">Application Submitted! 🎉</h2>
            <p style="color:#94a3b8; font-size:14px; line-height:1.6;">
              Hi <strong>${applicantName}</strong>, your application has been successfully submitted and delivered to the talent team.
            </p>
            <div class="job-card">
              <div style="font-size:16px; font-weight:700; color:#ffffff;">${jobTitle}</div>
              <div style="font-size:13px; color:#a5b4fc; margin-top:4px;">${companyName}</div>
              <div style="margin-top:12px; display:inline-block; background:rgba(79, 70, 229, 0.2); color:#c7d2fe; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600;">
                AI Compatibility Match: ${matchScore}%
              </div>
            </div>
            <p style="color:#94a3b8; font-size:13px; line-height:1.5;">
              You will receive real-time notifications and email updates as your application progresses through recruiter review and interview scheduling.
            </p>
          </div>
          <div class="footer">© 2026 CareerPulse AI Portal. Sent to ${toEmail}</div>
        </div>
      </body>
      </html>
    `;

    return await emailService.sendEmail({
      to: toEmail,
      subject,
      html,
      text,
      type: 'application'
    });
  },

  // 5. Send New Candidate Alert (To Recruiter)
  sendNewCandidateAlertEmail: async (toEmail, recruiterName, applicantName, jobTitle, matchScore = 85) => {
    const subject = `New Candidate: ${applicantName} applied for ${jobTitle} 🎯`;
    const text = `Hi ${recruiterName}, ${applicantName} just applied for your role "${jobTitle}" with a ${matchScore}% AI ATS match score.`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); padding: 32px 24px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #ffffff; }
          .content { padding: 32px 28px; }
          .score-pill { display: inline-block; background: #3b0764; color: #f472b6; padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 10px; border: 1px solid #831843; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#fbcfe8;">Recruiter</span></div>
          </div>
          <div class="content">
            <h2 style="color:#ffffff; margin-top:0;">New Candidate Application 🎯</h2>
            <p style="color:#94a3b8; font-size:14px; line-height:1.6;">
              Hello <strong>${recruiterName}</strong>, a new applicant has applied for your job opening:
            </p>
            <div style="background:#1e293b; border-radius:12px; padding:16px; margin:16px 0;">
              <div style="font-size:16px; font-weight:700; color:#ffffff;">${applicantName}</div>
              <div style="font-size:13px; color:#cbd5e1; margin-top:4px;">Position: <strong>${jobTitle}</strong></div>
              <div class="score-pill">ATS Match Score: ${matchScore}%</div>
            </div>
            <p style="color:#94a3b8; font-size:13px;">
              Log in to your Recruiter Hub to review the candidate's resume, skill analysis, and schedule an interview.
            </p>
          </div>
          <div class="footer">© 2026 CareerPulse AI Portal. Sent to ${toEmail}</div>
        </div>
      </body>
      </html>
    `;

    return await emailService.sendEmail({
      to: toEmail,
      subject,
      html,
      text,
      type: 'recruiter_alert'
    });
  },

  // 6. Send Application Status Update Email (To Seeker)
  sendApplicationStatusEmail: async (toEmail, applicantName, jobTitle, companyName, newStatus, interviewDate = null) => {
    const isOffer = newStatus === 'Offered';
    const isInterview = newStatus === 'Interviewing';
    const subject = `${isOffer ? '🎉 Job Offer: ' : isInterview ? '📅 Interview Invitation: ' : 'Status Update: '}${jobTitle} at ${companyName}`;
    const text = `Hi ${applicantName}, your application status for "${jobTitle}" at ${companyName} has changed to: ${newStatus}.${interviewDate ? ` Interview scheduled for: ${interviewDate}.` : ''}`;
    
    const bannerGradient = isOffer 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : isInterview 
      ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' 
      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: ${bannerGradient}; padding: 32px 24px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #ffffff; }
          .content { padding: 32px 28px; }
          .status-badge { display: inline-block; background: #1e293b; color: #ffffff; border: 2px solid #6366f1; padding: 8px 18px; border-radius: 10px; font-size: 15px; font-weight: 700; margin: 16px 0; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ CareerPulse <span style="color:#ffffff;">Update</span></div>
          </div>
          <div class="content">
            <h2 style="color:#ffffff; margin-top:0;">
              ${isOffer ? 'Congratulations! Offer Extended 🎉' : isInterview ? 'Interview Scheduled! 📅' : 'Application Status Update'}
            </h2>
            <p style="color:#94a3b8; font-size:14px; line-height:1.6;">
              Dear <strong>${applicantName}</strong>, the hiring team for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has updated your application status:
            </p>
            <div style="text-align: center;">
              <div class="status-badge">${newStatus}</div>
            </div>
            ${interviewDate ? `
              <div style="background:#1e1b4b; border:1px solid #6366f1; border-radius:10px; padding:14px; margin:16px 0; text-align:center;">
                <div style="font-size:11px; text-transform:uppercase; color:#a5b4fc; font-weight:700;">Interview Details</div>
                <div style="font-size:15px; color:#ffffff; font-weight:600; margin-top:4px;">${interviewDate}</div>
              </div>
            ` : ''}
            <p style="color:#94a3b8; font-size:13px; line-height:1.5;">
              View more details and manage your applications directly inside your CareerPulse candidate dashboard.
            </p>
          </div>
          <div class="footer">© 2026 CareerPulse AI Portal. Sent to ${toEmail}</div>
        </div>
      </body>
      </html>
    `;

    return await emailService.sendEmail({
      to: toEmail,
      subject,
      html,
      text,
      type: 'status_update'
    });
  },

  // Query sent emails for user
  getEmailsForUser: (email) => {
    if (!email) return sentEmails;
    const lower = email.toLowerCase();
    return sentEmails.filter(e => e.to.toLowerCase() === lower);
  },

  // Get single email by ID
  getEmailById: (id) => {
    return sentEmails.find(e => e.id === id) || null;
  }
};
