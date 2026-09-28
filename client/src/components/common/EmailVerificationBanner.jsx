import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { EmailVerificationModal } from '../auth/EmailVerificationModal.jsx';
import { Mail, ShieldAlert, ArrowRight, RefreshCw, X } from 'lucide-react';

export const EmailVerificationBanner = () => {
  const { user, resendVerification, openEmailInbox, addToast } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Only show if user is logged in, unverified, and banner not manually dismissed
  if (!user || user.email_verified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(user.email);
    } catch (err) {
      // Toast handled in context
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border-b border-amber-500/30 text-slate-200 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
            <span>
              Your email <strong className="text-white">{user.email}</strong> is not yet verified. Please verify your account to unlock AI matching notifications.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openEmailInbox()}
              className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 font-medium transition-colors flex items-center gap-1"
            >
              <Mail className="w-3 h-3 text-indigo-400" />
              <span>Inbox</span>
            </button>
            <button
              onClick={handleResend}
              disabled={resending}
              className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-medium transition-colors flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending...' : 'Resend Code'}</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Verify Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              title="Dismiss for this session"
              className="p-1 rounded text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        email={user.email}
        onSuccess={() => setModalOpen(false)}
      />
    </>
  );
};
