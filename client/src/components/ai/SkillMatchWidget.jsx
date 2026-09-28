import React from 'react';
import { CheckCircle2, XCircle, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export const SkillMatchWidget = ({ match = {} }) => {
  const { score = 85, rating = 'Strong Match', matched_skills = [], missing_skills = [], match_ratio = '', verdict = '' } = match;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Candidate-to-Job Fit</h4>
            <p className="text-[11px] text-slate-400">{match_ratio || 'Skill Alignment Check'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-lg font-extrabold text-white">{score}%</span>
            <span className="block text-[10px] font-semibold text-emerald-400 uppercase">{rating}</span>
          </div>
        </div>
      </div>

      {/* Matched Skills */}
      <div>
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Matched Skills ({matched_skills.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {matched_skills.map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {skill}
            </span>
          ))}
          {matched_skills.length === 0 && (
            <span className="text-xs text-slate-500 italic">No direct keyword overlap found</span>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      {missing_skills.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Missing / Recommended Keywords ({missing_skills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missing_skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/30 text-amber-300 border border-amber-500/20 flex items-center gap-1"
              >
                <XCircle className="w-3 h-3 text-amber-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Verdict */}
      {verdict && (
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{verdict}</p>
        </div>
      )}
    </div>
  );
};
