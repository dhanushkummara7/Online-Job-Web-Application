import React from 'react';
import { useJobs } from '../../context/JobContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const JobCard = ({ job, onSelect, onApply }) => {
  const { savedJobIds, toggleSave } = useJobs();
  const { role } = useAuth();
  const isSaved = savedJobIds.has(job.id);

  // Compute a match score badge if available
  const matchScore = job.ai_recommendation?.match_score || 88;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive CTC';
    if (min >= 100000) {
      return `₹${(min / 100000).toFixed(0)}L - ₹${(max / 100000).toFixed(0)}L PA`;
    }
    return `₹${(min / 1000).toFixed(0)}k - ₹${(max / 1000).toFixed(0)}k / yr`;
  };

  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover p-5 sm:p-6 flex flex-col justify-between transition-all duration-300">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={job.company?.logo_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100'}
              alt={job.company?.name || 'Company'}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700/80 bg-slate-900 p-1 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400">{job.company?.name}</span>
                {job.company?.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" title="Verified Employer" />
                )}
              </div>
              <h3 
                onClick={() => onSelect(job)}
                className="text-base font-bold text-white group-hover:text-indigo-300 cursor-pointer transition-colors line-clamp-1"
              >
                {job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(job.id);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-indigo-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Location & Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-300">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.location}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 font-medium">
            {job.workplace_type}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium text-slate-300">
            {job.job_type}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 font-semibold">
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {(job.skills_required || []).slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800"
            >
              {skill}
            </span>
          ))}
          {(job.skills_required?.length || 0) > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md text-slate-500">
              +{(job.skills_required?.length || 0) - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: AI Match Score & Action Buttons */}
      <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
        
        {/* AI Match Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{matchScore}% Match</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(job)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            Details
          </button>
          
          {role === 'seeker' && (
            <button
              onClick={() => onApply(job)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
