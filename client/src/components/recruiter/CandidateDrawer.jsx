import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Save, 
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { SkillMatchWidget } from '../ai/SkillMatchWidget.jsx';

export const CandidateDrawer = ({ application, isOpen, onClose, onUpdate }) => {
  const { addToast } = useAuth();
  const [status, setStatus] = useState(application?.status || 'Applied');
  const [recruiterNotes, setRecruiterNotes] = useState(application?.recruiter_notes || '');
  const [interviewDate, setInterviewDate] = useState(
    application?.interview_date ? application.interview_date.slice(0, 16) : ''
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen || !application) return null;

  const applicant = application.applicant;
  const job = application.job;
  const aiAnalysis = application.ai_analysis || {};

  const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'];

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      const res = await api.applications.updateStatus(application.id, {
        status,
        recruiter_notes: recruiterNotes,
        interview_date: interviewDate ? new Date(interviewDate).toISOString() : null
      });

      if (res.success) {
        addToast(`Candidate application status updated to "${status}"`, 'success');
        if (onUpdate) onUpdate(res.application);
      }
    } catch (err) {
      addToast('Failed to update: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={applicant?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'}
              alt={applicant?.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40 p-0.5 bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{applicant?.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {application.match_score}% AI Match
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{applicant?.headline || 'Software Professional'}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {applicant?.email}</span>
                {applicant?.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {applicant.phone}</span>}
                {applicant?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {applicant.location}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Application Stage Stepper */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Application Pipeline Stage
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {STAGES.map((s) => {
              const isCurrent = status === s;
              let style = 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800';
              if (isCurrent) {
                if (s === 'Offered') style = 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-md';
                else if (s === 'Rejected') style = 'bg-rose-600 text-white font-bold border-rose-500 shadow-md';
                else if (s === 'Interviewing') style = 'bg-purple-600 text-white font-bold border-purple-500 shadow-md';
                else style = 'bg-indigo-600 text-white font-bold border-indigo-500 shadow-md';
              }

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${style}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Skill Match Breakdown */}
        <div className="mt-4">
          <SkillMatchWidget
            match={{
              score: application.match_score,
              rating: aiAnalysis.overall_fit || 'Exceptional Match',
              matched_skills: aiAnalysis.matched_skills || applicant?.skills?.slice(0, 6) || [],
              missing_skills: aiAnalysis.missing_skills || [],
              match_ratio: `Applied for: ${job?.title}`,
              verdict: aiAnalysis.verdict || `Strong background in ${applicant?.skills?.slice(0, 3).join(', ')} with high relevance to this open role.`
            }}
          />
        </div>

        {/* Submitted Cover Letter */}
        {application.cover_letter && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Candidate Cover Letter</span>
            </div>
            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
              {application.cover_letter}
            </p>
          </div>
        )}

        {/* Candidate Resume Text */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Candidate Resume / CV Transcript</span>
          </div>
          <div className="max-h-48 overflow-y-auto p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
            {applicant?.resume_text || application.resume_text || 'No resume text available.'}
          </div>
        </div>

        {/* Interview Date & Recruiter Notes */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Schedule Interview Date & Time</span>
            </label>
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Recruiter Internal Feedback & Notes
            </label>
            <input
              type="text"
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              placeholder="e.g. Cleared tech screen, great system design intuition..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSaveStatus}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Candidate Stage & Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
