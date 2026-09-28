import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { 
  X, 
  Sparkles, 
  FileText, 
  Send, 
  CheckCircle, 
  Building2, 
  Wand2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user, addToast } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeText, setResumeText] = useState(user?.resume_text || '');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !job) return null;

  // AI Cover Letter Generator
  const handleGenerateCoverLetter = async () => {
    setGeneratingAI(true);
    setError('');
    try {
      const res = await api.ai.generateCoverLetter({
        candidateName: user?.name || 'Applicant',
        candidateSkills: user?.skills || [],
        candidateBio: user?.bio || '',
        jobTitle: job.title,
        companyName: job.company?.name || 'Company',
        jobRequirements: job.requirements || []
      });

      if (res.success && res.coverLetter) {
        setCoverLetter(res.coverLetter);
        addToast('AI Cover Letter generated successfully!', 'success');
      }
    } catch (err) {
      setError('Failed to generate cover letter: ' + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        job_id: job.id,
        applicant_id: user?.id || 'u-seeker-1',
        resume_url: user?.resume_url || 'https://example.com/resumes/resume.pdf',
        resume_text: resumeText || user?.resume_text || '',
        cover_letter: coverLetter
      };

      const res = await api.applications.apply(payload);
      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        addToast(`Successfully applied to ${job.title} at ${job.company?.name}! 🎉`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={job.company?.logo_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100'}
              alt={job.company?.name}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 p-1 bg-slate-950"
            />
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Apply for {job.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{job.company?.name} • {job.location} ({job.workplace_type})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          
          {/* Candidate Info Summary */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                alt={user?.name}
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-indigo-500/30"
              />
              <div>
                <div className="font-semibold text-white">{user?.name || 'Applicant'}</div>
                <div className="text-slate-400">{user?.email} • {user?.headline?.slice(0, 45)}...</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
              Profile Active
            </span>
          </div>

          {/* Resume Snapshot */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Resume Text / Qualifications</span>
              </span>
              <span className="text-[11px] text-slate-500">Auto-extracted from your profile</span>
            </label>
            <textarea
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste or edit your resume text..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono transition-colors"
            />
          </div>

          {/* AI Cover Letter Generator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Cover Letter</span>
              </label>

              <button
                type="button"
                onClick={handleGenerateCoverLetter}
                disabled={generatingAI}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 transition-all hover:scale-105"
              >
                {generatingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Drafting...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Generate Cover Letter</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a personalized cover letter or click 'AI Generate Cover Letter' above to create one automatically..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
