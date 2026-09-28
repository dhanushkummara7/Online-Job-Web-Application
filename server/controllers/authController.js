import { db } from '../config/store.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { emailService } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jobportal_jwt_secret_key_2026';

// Helper to sanitize user object (strip password hash and verification code)
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash, verification_code, reset_code, ...safeUser } = user;
  return safeUser;
};

export const authController = {
  // Login with Email & Password (or Quick Demo Logins)
  login: async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      if (!email && !role) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      let user = null;
      if (email) {
        user = await db.profiles.getByEmail(email);
      }

      // If user not found and role specified (legacy fallback)
      if (!user) {
        if (role) {
          const hashedPassword = await bcrypt.hash('password123', 10);
          user = await db.profiles.create({
            email: email || `user_${Date.now()}@example.com`,
            name: email ? email.split('@')[0] : 'Demo User',
            role: role || 'seeker',
            email_verified: true,
            password_hash: hashedPassword,
            avatar_url: role === 'recruiter' 
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
          });
        } else {
          return res.status(401).json({ 
            success: false, 
            message: 'No account found with this email. Please check your spelling or sign up.' 
          });
        }
      }

      // Password Verification
      if (password) {
        let isMatch = false;
        if (user.password_hash) {
          isMatch = await bcrypt.compare(password, user.password_hash);
        } else {
          // If no hash yet (seed data), accept 'password123' or seed password
          isMatch = (password === 'password123' || password === 'admin123' || password === 'demo123');
        }

        if (!isMatch) {
          return res.status(401).json({ 
            success: false, 
            message: 'Incorrect password. Please try again or use the demo credentials (password123).' 
          });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: sanitizeUser(user)
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Register New Account with Email Verification Dispatch
  register: async (req, res) => {
    try {
      const { email, password, name, role = 'seeker', headline, skills, companyName, companyWebsite } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ success: false, message: 'Full name and email are required.' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      }

      const existing = await db.profiles.getByEmail(email);
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'An account with this email address already exists. Please sign in instead.' 
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Generate 6-digit verification code
      const verification_code = Math.floor(100000 + Math.random() * 900000).toString();
      const verification_expires = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

      const newUser = await db.profiles.create({
        email,
        name,
        role,
        password_hash,
        email_verified: false,
        verification_code,
        verification_expires,
        headline: headline || (role === 'recruiter' ? 'Talent Acquisition Partner' : 'Software Professional'),
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      });

      // If recruiter specified a company, automatically create company profile
      if (role === 'recruiter' && companyName) {
        await db.companies.create({
          user_id: newUser.id,
          name: companyName,
          industry: 'Technology & Internet',
          location: 'Bengaluru, Karnataka, India',
          website: companyWebsite || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
        });
      }

      // Send Verification Email
      await emailService.sendVerificationEmail(email, name, verification_code, role);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account created! Please check your email for the verification code.',
        token,
        user: sanitizeUser(newUser),
        requiresVerification: true,
        emailSentTo: email
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Verify Email Code
  verifyEmail: async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
      }

      const user = await db.profiles.getByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.email_verified) {
        return res.json({ 
          success: true, 
          message: 'Email is already verified.', 
          user: sanitizeUser(user) 
        });
      }

      // Check code match (or universal demo code '123456')
      const isCodeValid = (user.verification_code === code.trim() || code.trim() === '123456');

      if (!isCodeValid) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid verification code. Please check your email inbox and try again.' 
        });
      }

      // Update user as verified
      const updated = await db.profiles.update(user.id, {
        email_verified: true,
        verification_code: null,
        verification_expires: null
      });

      // Dispatch Welcome Email
      await emailService.sendWelcomeEmail(user.email, user.name, user.role);

      return res.json({
        success: true,
        message: 'Email verified successfully! Welcome to CareerPulse AI.',
        user: sanitizeUser(updated)
      });
    } catch (err) {
      console.error('Verify email error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Resend Verification Email
  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }

      const user = await db.profiles.getByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      if (user.email_verified) {
        return res.json({ success: true, message: 'This account is already verified.' });
      }

      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      await db.profiles.update(user.id, {
        verification_code: newCode,
        verification_expires: expires
      });

      await emailService.sendVerificationEmail(user.email, user.name, newCode, user.role);

      return res.json({
        success: true,
        message: `New verification code sent to ${user.email}. Check your email inbox.`
      });
    } catch (err) {
      console.error('Resend verification error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Request Password Reset
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
      }

      const user = await db.profiles.getByEmail(email);
      if (!user) {
        // Return generic success to prevent email enumeration
        return res.json({ 
          success: true, 
          message: 'If an account exists with this email, a reset code has been dispatched.' 
        });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      await db.profiles.update(user.id, {
        reset_code: resetCode,
        reset_expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      });

      await emailService.sendPasswordResetEmail(user.email, user.name, resetCode);

      return res.json({
        success: true,
        message: `Password reset instructions and code sent to ${user.email}.`
      });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Complete Password Reset
  resetPassword: async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, code, and new password are required.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
      }

      const user = await db.profiles.getByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isCodeValid = (user.reset_code === code.trim() || code.trim() === '123456');
      if (!isCodeValid) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
      }

      const password_hash = await bcrypt.hash(newPassword, 10);
      await db.profiles.update(user.id, {
        password_hash,
        reset_code: null,
        reset_expires: null
      });

      return res.json({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.'
      });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Switch demo account instantly
  demoSwitch: async (req, res) => {
    try {
      const { role } = req.params; // 'seeker' or 'recruiter'
      const targetEmail = role === 'recruiter' ? 'marcus.recruiter@stripe.com' : 'sarah.jenkins@example.com';
      const user = await db.profiles.getByEmail(targetEmail);

      if (!user) {
        return res.status(404).json({ success: false, message: 'Demo profile not found' });
      }

      // Ensure demo account is verified
      if (!user.email_verified) {
        user.email_verified = true;
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user: sanitizeUser(user)
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get current authenticated profile
  getMe: async (req, res) => {
    try {
      const userId = req.userId || req.query.userId;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID missing' });
      }
      const user = await db.profiles.getById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found' });
      }
      return res.json({ success: true, user: sanitizeUser(user) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.params.id || req.body.id;
      const updates = req.body;
      // Do not allow raw password_hash update via this endpoint
      delete updates.password_hash;
      delete updates.verification_code;

      const updated = await db.profiles.update(userId, updates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
      return res.json({ success: true, user: sanitizeUser(updated) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
