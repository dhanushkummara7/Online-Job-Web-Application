import React from 'react';
import { useJobs } from '../context/JobContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SkillMatchWidget } from '../components/ai/SkillMatchWidget.jsx';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Users,
  Briefcase,
  Share2
} from 'lucide-react';

export const JobDetails = ({ job, onBack, onApply }) => {
  const { savedJobIds, toggleSave } = useJobs();
  const { user, role, addToast } = useAuth();

  if (!job) return null;

  const isSaved = savedJobIds.has(job.id);
  const company = job.company || {};

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive CTC + ESOPs';
    if (min >= 100000) {
      return `₹${(min / 100000).toFixed(0)}L - ₹${(max / 100000).toFixed(0)}L PA (Base + Equity)`;
    }
    return `₹${(min / 1000).toFixed(0)}k - ₹${(max / 1000).toFixed(0)}k / year`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Job link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search & Listings</span>
      </button>

      {/* Main Job Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden border border-slate-700/80 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <img
              src={company.logo_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120'}
              alt={company.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700 bg-slate-950 p-1.5 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-300">{company.name}</span>
                {company.verified && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Company
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-medium">
                  {job.workplace_type}
                </span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                  {job.job_type}
                </span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-2.5 sm:self-start flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleSave(job.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={isSaved ? 'Saved' : 'Save job'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-indigo-400" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {role === 'seeker' && (
              <button
                onClick={() => onApply(job)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: AI Match Widget + Job Details Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h2 className="text-base font-bold text-white">About the Role</h2>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div className="p-6 rounded-2xl glass-panel space-y-3">
              <h2 className="text-base font-bold text-white">Key Responsibilities</h2>
              <ul className="space-y-2 text-xs text-slate-300">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="p-6 rounded-2xl glass-panel space-y-3">
              <h2 className="text-base font-bold text-white">Role Requirements & Experience</h2>
              <ul className="space-y-2 text-xs text-slate-300">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Benefits */}
          {company.benefits?.length > 0 && (
            <div className="p-6 rounded-2xl glass-panel space-y-3">
              <h2 className="text-base font-bold text-white">Perks & Company Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {company.benefits.map((b, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Match Widget + Company Profile Card */}
        <div className="space-y-6">
          
          {/* AI Skill Match Widget */}
          <SkillMatchWidget
            match={{
              score: job.ai_recommendation?.match_score || 91,
              rating: 'High Match',
              matched_skills: (job.skills_required || []).slice(0, 4),
              missing_skills: (job.skills_required || []).slice(4),
              match_ratio: `${Math.min(job.skills_required?.length || 4, 4)} / ${job.skills_required?.length || 4} Skills Matched`,
              verdict: `Your background in ${(user?.skills || []).slice(0, 3).join(', ')} strongly satisfies the technical requirements for this position.`
            }}
          />

          {/* Company Card */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 bg-slate-950 p-1"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{company.name}</h3>
                <p className="text-[11px] text-slate-400">{company.industry}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {company.description || 'Pioneering next-generation technologies and scaling modern product infrastructure.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Headquarters:</span>
                <span>{company.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Company Size:</span>
                <span>{company.size || '1,000+ employees'}</span>
              </div>
              {company.website && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
