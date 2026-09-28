import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('seeker'); // 'seeker' or 'recruiter'
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  
  // Email Inbox Modal & State
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [unreadEmailsCount, setUnreadEmailsCount] = useState(0);
  const [activeEmailPreview, setActiveEmailPreview] = useState(null);

  // Toast notifier helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadNotifications = async (userId) => {
    if (!userId) return;
    try {
      const res = await api.notifications.getByUser(userId);
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.notifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const loadEmails = useCallback(async (userEmail) => {
    try {
      const res = await api.email.getInbox(userEmail || user?.email);
      if (res.success && res.emails) {
        setEmails(res.emails);
        setUnreadEmailsCount(res.emails.filter(e => !e.read).length);
      }
    } catch (err) {
      console.error('Failed to load emails:', err);
    }
  }, [user?.email]);

  // Initial load - Restore saved session or fallback to default Seeker demo account
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUserStr = localStorage.getItem('auth_user');

        if (savedToken && savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            setUser(savedUser);
            setRole(savedUser.role || 'seeker');
            loadNotifications(savedUser.id);
            loadEmails(savedUser.email);
            setLoading(false);
            return;
          } catch (e) {
            console.warn('Failed parsing saved user session, reloading demo:', e);
          }
        }

        // Default to demo Sarah Jenkins (Seeker) demo account
        const savedRole = localStorage.getItem('demo_role') || 'seeker';
        const res = await api.auth.demoSwitch(savedRole);
        if (res.success && res.user) {
          setUser(res.user);
          setRole(res.user.role);
          loadNotifications(res.user.id);
          loadEmails(res.user.email);
        }
      } catch (err) {
        console.error('Failed to init auth:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [loadEmails]);

  // Login handler
  const login = async ({ email, password, remember = true }) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.user) {
        setUser(res.user);
        setRole(res.user.role);
        
        if (remember) {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
          localStorage.setItem('demo_role', res.user.role);
        }

        loadNotifications(res.user.id);
        loadEmails(res.user.email);
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.auth.register(userData);
      if (res.success && res.user) {
        setUser(res.user);
        setRole(res.user.role);
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        localStorage.setItem('demo_role', res.user.role);

        loadNotifications(res.user.id);
        loadEmails(res.user.email);
        addToast('Registration successful! Verification code sent to your email.', 'success');
        return res;
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify Email code
  const verifyEmail = async (code, emailToVerify = null) => {
    const targetEmail = emailToVerify || user?.email;
    if (!targetEmail) throw new Error('No email found to verify.');
    
    try {
      const res = await api.auth.verifyEmail({ email: targetEmail, code });
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        addToast('Email verified successfully! 🎉', 'success');
        loadEmails(targetEmail);
        return res;
      }
      throw new Error(res.message || 'Verification failed');
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Resend Verification Code
  const resendVerification = async (emailToResend = null) => {
    const targetEmail = emailToResend || user?.email;
    if (!targetEmail) throw new Error('Email address required.');
    
    try {
      const res = await api.auth.resendVerification({ email: targetEmail });
      if (res.success) {
        addToast(res.message, 'info');
        loadEmails(targetEmail);
        return res;
      }
      throw new Error(res.message || 'Failed to resend code');
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    setEmails([]);
    setUnreadEmailsCount(0);
    addToast('You have been logged out.', 'info');
  };

  // Instant switch between Seeker and Recruiter (Demo mode)
  const switchRole = async (targetRole) => {
    setLoading(true);
    try {
      const res = await api.auth.demoSwitch(targetRole);
      if (res.success && res.user) {
        setUser(res.user);
        setRole(res.user.role);
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        localStorage.setItem('demo_role', targetRole);
        loadNotifications(res.user.id);
        loadEmails(res.user.email);
        addToast(`Switched persona to ${targetRole === 'seeker' ? 'Job Seeker (Sarah Jenkins)' : 'Recruiter (Marcus Vance)'}`, 'info');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    if (!user) return;
    try {
      const res = await api.auth.updateProfile(user.id, updatedData);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        addToast('Profile updated successfully!', 'success');
        return res.user;
      }
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    try {
      await api.notifications.markAllRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      addToast('All notifications marked as read', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const openEmailInbox = (emailPreview = null) => {
    if (emailPreview) setActiveEmailPreview(emailPreview);
    loadEmails(user?.email);
    setIsEmailInboxOpen(true);
  };

  const closeEmailInbox = () => {
    setIsEmailInboxOpen(false);
    setActiveEmailPreview(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: !!user,
        isEmailVerified: Boolean(user?.email_verified),
        notifications,
        unreadCount,
        toasts,
        addToast,
        removeToast,
        login,
        register,
        verifyEmail,
        resendVerification,
        logout,
        switchRole,
        updateProfile,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshNotifications: () => loadNotifications(user?.id),
        // Email Inbox Feature
        isEmailInboxOpen,
        openEmailInbox,
        closeEmailInbox,
        emails,
        unreadEmailsCount,
        activeEmailPreview,
        setActiveEmailPreview,
        refreshEmails: () => loadEmails(user?.email)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
