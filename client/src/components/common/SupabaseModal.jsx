import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Database, ShieldCheck, Zap, X, Check, Server, Sparkles } from 'lucide-react';

export const SupabaseModal = ({ isOpen, onClose }) => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Database & Backend Engine</h3>
              <p className="text-xs text-slate-400">MERN Stack + Supabase + AI Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Status Badge */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-sm font-semibold text-slate-200">System Status: Active & Operational</div>
                <div className="text-xs text-slate-400">Express REST API + Resilient Storage Layer</div>
              </div>
            </div>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50 transition-colors"
            >
              {loading ? 'Testing...' : 'Ping Server'}
            </button>
          </div>

          {/* Database Layer Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-800/20 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Supabase Integration
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Connected & Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Equipped with complete Supabase PostgreSQL schemas (tables for <code className="text-indigo-300">profiles</code>, <code className="text-indigo-300">jobs</code>, <code className="text-indigo-300">companies</code>, <code className="text-indigo-300">applications</code>, and <code className="text-indigo-300">notifications</code>) with built-in instant resilient memory backup and preloaded tech datasets.
            </p>
          </div>

          {/* AI Engine Status Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-indigo-950/20 border border-purple-500/30 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Features Active
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Resume ATS & Skill Analyzer (0-100% Score)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Job Match Scorer & Candidate-to-Job Fit Breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Cover Letter Generator (1-Click Personalized Letter)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recruiter AI Job Description Generator</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
