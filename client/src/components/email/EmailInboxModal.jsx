import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { 
  Mail, 
  X, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Key, 
  Sparkles, 
  Send, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Inbox
} from 'lucide-react';

export const EmailInboxModal = ({ isOpen, onClose, initialEmail = null, onSelectCode = null }) => {
  const { user, emails, refreshEmails, openEmailInbox, addToast } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState(initialEmail);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleRefresh();
    }
  }, [isOpen]);

  useEffect(() => {
    if (emails && emails.length > 0 && !selectedEmail) {
      setSelectedEmail(emails[0]);
    }
  }, [emails]);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshEmails();
    setIsRefreshing(false);
  };

  const handleSendTestEmail = async () => {
    const targetEmail = user?.email || 'demo.user@example.com';
    const targetName = user?.name || 'Explorer';
    setTestEmailLoading(true);
    try {
      const res = await api.email.sendTest(targetEmail, targetName);
      if (res.success) {
        addToast('Test email sent to inbox!', 'success');
        await refreshEmails();
        if (res.email) setSelectedEmail(res.email);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    addToast(`Code ${code} copied to clipboard!`, 'info');
    if (onSelectCode) {
      onSelectCode(code);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[85vh] max-h-[800px] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Email Inbox & Notification Viewer</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Mailbox
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect verification codes, welcome newsletters, and platform security dispatches in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendTestEmail}
              disabled={testEmailLoading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Send className={`w-3.5 h-3.5 ${testEmailLoading ? 'animate-spin' : ''}`} />
              <span>{testEmailLoading ? 'Sending...' : 'Send Test Mail'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Inbox"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two-Pane Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Pane: Email List */}
          <div className="w-full sm:w-80 md:w-96 border-r border-slate-800 flex flex-col bg-slate-950/40">
            <div className="p-3 border-b border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                Messages ({emails.length})
              </span>
              <span className="text-[11px] text-slate-500">
                {user?.email ? `Filtering: ${user.email}` : 'All system mail'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs">No emails received yet.</p>
                  <button
                    onClick={handleSendTestEmail}
                    className="mt-3 text-xs text-indigo-400 hover:underline"
                  >
                    Send a test email
                  </button>
                </div>
              ) : (
                emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-3.5 cursor-pointer transition-all text-left relative ${
                        isSelected 
                          ? 'bg-indigo-950/40 border-l-4 border-indigo-500' 
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          email.type === 'verification' 
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : email.type === 'password_reset'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {email.type}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-200 truncate mt-1">
                        {email.subject}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {email.preview || 'No preview available'}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/30 text-[10px] text-slate-500">
                        <span className="truncate max-w-[170px]">To: {email.to}</span>
                        {email.code && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-200 font-mono font-bold">
                            OTP: {email.code}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Selected Email Viewer */}
          <div className="hidden sm:flex flex-1 flex-col bg-slate-900 overflow-y-auto">
            {selectedEmail ? (
              <div className="flex flex-col h-full">
                {/* Email Header */}
                <div className="p-5 border-b border-slate-800 bg-slate-900/80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {selectedEmail.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                        <span><strong>From:</strong> {selectedEmail.from}</span>
                        <span>•</span>
                        <span><strong>To:</strong> {selectedEmail.to}</span>
                        <span>•</span>
                        <span>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {selectedEmail.code && (
                      <div className="bg-indigo-950/80 border border-indigo-500/40 rounded-xl p-3 flex flex-col items-center flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                          Verification Code
                        </span>
                        <span className="text-xl font-mono font-extrabold text-white tracking-widest mt-0.5">
                          {selectedEmail.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(selectedEmail.code)}
                          className="mt-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                        >
                          {onSelectCode ? 'Apply Code' : 'Copy Code'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Body Rendering */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-950/30 flex justify-center">
                  <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg p-1">
                    <iframe
                      title="Email HTML Preview"
                      srcDoc={selectedEmail.html}
                      className="w-full min-h-[500px] border-0 rounded-lg bg-slate-950"
                      sandbox="allow-same-origin allow-popups"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Mail className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-base font-semibold text-slate-300">Select an email to read</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Choose a message from the list on the left to preview the formatted HTML email and extract verification codes.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Interactive Email Sandbox • Nodemailer Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
