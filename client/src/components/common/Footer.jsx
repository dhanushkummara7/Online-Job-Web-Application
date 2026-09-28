import React from 'react';
import { Sparkles, Heart, Shield, Cpu, Database, ArrowUpRight } from 'lucide-react';

export const Footer = ({ setCurrentTab }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base">CareerPulse <span className="text-indigo-400">AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-world, intelligent job marketplace connecting top engineering, product, and design talent with world-class tech organizations.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (MERN + Supabase)</span>
            </div>
          </div>

          {/* Job Seekers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">For Job Seekers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('jobs')} className="hover:text-indigo-300 transition-colors">
                  Explore High-Growth Jobs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('resume-studio')} className="hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <span>AI Resume ATS Analyzer</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">PRO</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('applications')} className="hover:text-indigo-300 transition-colors">
                  Live Application Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('companies')} className="hover:text-indigo-300 transition-colors">
                  Verified Tech Companies
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('signup')} className="hover:text-indigo-300 text-indigo-400 font-medium transition-colors">
                  Join CareerPulse (Sign Up)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('login')} className="hover:text-indigo-300 transition-colors">
                  Account Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Employers & Recruiters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">For Employers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('recruiter-dashboard')} className="hover:text-indigo-300 transition-colors">
                  Recruiter Candidate Pipeline
                </button>
              </li>
              <li>
                <span className="hover:text-indigo-300 transition-colors cursor-pointer">
                  AI Job Description Generator
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-300 transition-colors cursor-pointer">
                  Candidate Fit & ATS Scoring
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-300 transition-colors cursor-pointer">
                  Direct Interview Scheduler
                </span>
              </li>
            </ul>
          </div>

          {/* Stack & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Architecture</h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase PostgreSQL & Cloud Auth</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Node.js / Express REST Engine</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>AI NLP ATS & Skill Gap Matching</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CareerPulse AI Portal. Built with MERN Stack + Supabase + AI.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for high-performance job matching</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
