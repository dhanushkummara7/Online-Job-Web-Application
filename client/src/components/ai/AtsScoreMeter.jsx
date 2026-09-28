import React from 'react';
import { Sparkles, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export const AtsScoreMeter = ({ score = 85, rating = 'Strong Match', breakdown = {} }) => {
  // SVG circle calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-indigo-500';
  let strokeColor = '#6366f1';
  let bgGradient = 'from-indigo-500/20 to-purple-500/10';

  if (score >= 88) {
    colorClass = 'text-emerald-400';
    strokeColor = '#34d399';
    bgGradient = 'from-emerald-500/20 to-teal-500/10';
  } else if (score < 70) {
    colorClass = 'text-amber-400';
    strokeColor = '#fbbf24';
    bgGradient = 'from-amber-500/20 to-orange-500/10';
  }

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${bgGradient} border border-slate-700/60 flex flex-col md:flex-row items-center gap-6`}>
      
      {/* Radial Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#1e293b"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">{score}%</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">ATS Score</span>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="flex-1 w-full space-y-3.5 text-left">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-white">AI ATS Compatibility Rating</span>
            </div>
            <span className={`text-xs font-semibold ${colorClass}`}>{rating}</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 font-medium text-slate-300">
            Automated Screening
          </span>
        </div>

        {/* Sub metrics */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>Skill Diversity & Keywords</span>
              <span className="font-semibold text-white">{breakdown.skills_diversity || 92}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${breakdown.skills_diversity || 92}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>Quantifiable Business Impact</span>
              <span className="font-semibold text-white">{breakdown.quantifiable_impact || 85}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${breakdown.quantifiable_impact || 85}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>Formatting & ATS Parsability</span>
              <span className="font-semibold text-white">{breakdown.ats_formatting || 95}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${breakdown.ats_formatting || 95}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
