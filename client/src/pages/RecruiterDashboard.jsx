import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobContext.jsx';
import { api } from '../services/api.js';
import { CandidateDrawer } from '../components/recruiter/CandidateDrawer.jsx';
import { 
  Briefcase, 
  Users, 
  Sparkles, 
  PlusCircle, 
  TrendingUp, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  Trash2,
  Building2,
  Mail,
  UserCheck
} from 'lucide-react';

export const RecruiterDashboard = ({ onOpenPostJob, onSelectJob }) => {
  const { user, addToast } = useAuth();
  const { jobs, fetchJobs } = useJobs();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterJobId, setFilterJobId] = useState('All');

  const recruiterJobs = jobs.filter(j => j.recruiter_id === user?.id || j.company_id === 'c-stripe');

  const fetchRecruiterApplications = async () => {
    setLoading(true);
    try {
      const res = await api.applications.getAll({ recruiter_id: user?.id || 'u-recruiter-1' });
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterApplications();
  }, [user]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await api.jobs.delete(jobId);
      if (res.success) {
        addToast('Job posting removed successfully', 'info');
        fetchJobs();
      }
    } catch (err) {
      addToast('Failed to delete: ' + err.message, 'error');
    }
  };

  // Filtered applications by job
  const filteredApps = filterJobId === 'All'
    ? applications
    : applications.filter(a => a.job_id === filterJobId);

  const PIPELINE_COLUMNS = [
    { id: 'Applied', label: 'Applied', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { id: 'Under Review', label: 'Under Review', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'Shortlisted', label: 'Shortlisted', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
    { id: 'Interviewing', label: 'Interviewing', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
    { id: 'Offered', label: 'Offered', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' }
  ];

  // Pipeline metrics
  const totalCandidates = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'Interviewing').length;
  const offersCount = applications.filter(a => a.status === 'Offered').length;
  const avgMatchScore = applications.length > 0
    ? Math.round(applications.reduce((acc, a) => acc + (a.match_score || 0), 0) / applications.length)
    : 92;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden border border-slate-700/80 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40 p-0.5 bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  Lead Recruiter @ Stripe
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{user?.headline || 'Head of Technical Talent Acquisition'}</p>
            </div>
          </div>

          <button
            onClick={onOpenPostJob}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job (with AI)</span>
          </button>
        </div>

        {/* Recruiter Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-white">{recruiterJobs.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Active Job Postings</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-indigo-400">{totalCandidates}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Total Pipeline Applicants</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-purple-400">{interviewingCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Interviews Scheduled</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-emerald-400">{avgMatchScore}%</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Average AI Match Score</div>
          </div>
        </div>
      </div>

      {/* Candidate Kanban Pipeline */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Applicant Pipeline (Kanban Board)</span>
            </h2>
            <p className="text-xs text-slate-400">Click any candidate card to inspect ATS score, review resume & advance stage</p>
          </div>

          {/* Job Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter by Position:</span>
            <select
              value={filterJobId}
              onChange={(e) => setFilterJobId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Open Roles ({applications.length} total)</option>
              {recruiterJobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((col) => {
            const stageApps = filteredApps.filter(a => a.status === col.id);

            return (
              <div
                key={col.id}
                className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col min-h-[360px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {stageApps.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-3 flex-1">
                  {stageApps.map((app) => {
                    const applicant = app.applicant || {};
                    const job = app.job || {};

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApplication(app)}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/90 cursor-pointer shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={applicant.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80'}
                              alt={applicant.name}
                              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                            />
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                                {applicant.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                {job.title}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                            {app.match_score}%
                          </span>
                        </div>

                        {/* Skills Snapshot */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(applicant.skills || []).slice(0, 3).map((sk, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {sk}
                            </span>
                          ))}
                        </div>

                        {app.interview_date && (
                          <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center gap-1 text-[10px] text-purple-400 font-medium">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(app.interview_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {stageApps.length === 0 && (
                    <div className="py-12 text-center text-[11px] text-slate-600 italic">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Job Postings List */}
      <section className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your Managed Job Openings</h2>
            <p className="text-xs text-slate-400">Monitor active postings, view metrics and manage applicants</p>
          </div>

          <button
            onClick={onOpenPostJob}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Posting</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recruiterJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl glass-panel flex flex-col justify-between space-y-4 border border-slate-800"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold">{job.category}</span>
                    <h3
                      onClick={() => onSelectJob(job)}
                      className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer transition-colors"
                    >
                      {job.title}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <strong>{job.applicants_count || 0}</strong> Applicants
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <strong>{job.views_count || 0}</strong> Views
                  </span>
                  <span>{job.workplace_type}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectJob(job)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View Public Page →
                </button>

                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete job posting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Candidate Review Drawer */}
      {selectedApplication && (
        <CandidateDrawer
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={(updatedApp) => {
            setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
            setSelectedApplication(updatedApp);
          }}
        />
      )}
    </div>
  );
};
