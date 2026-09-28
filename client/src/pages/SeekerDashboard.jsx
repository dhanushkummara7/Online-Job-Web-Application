import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobContext.jsx';
import { api } from '../services/api.js';
import { JobCard } from '../components/seeker/JobCard.jsx';
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Edit3, 
  FileText, 
  ExternalLink, 
  Layers, 
  Bookmark, 
  AlertCircle,
  Building2,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const SeekerDashboard = ({ onOpenProfileEditor, onSelectJob, onApplyJob }) => {
  const { user } = useAuth();
  const { jobs, savedJobIds } = useJobs();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'saved'

  const fetchApplications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.applications.getAll({ applicant_id: user.id });
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
    fetchApplications();
  }, [user]);

  // Derived metrics
  const totalApplied = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'Interviewing').length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review' || a.status === 'Shortlisted').length;
  const offersCount = applications.filter(a => a.status === 'Offered').length;

  const savedJobsList = jobs.filter(j => savedJobIds.has(j.id));

  // Stepper helper
  const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interviewing', 'Offered'];

  const getStageIndex = (status) => {
    if (status === 'Rejected') return -1;
    const idx = STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Profile Summary & Overview Stats */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden border border-slate-700/80 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 p-0.5 bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Job Seeker
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{user?.headline || 'Senior Full Stack Engineer'}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {user?.location || 'Bengaluru, Karnataka, India'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Expected: ₹{(user?.preferences?.expected_salary / 100000 || 35).toFixed(0)} LPA</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenProfileEditor}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-md transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Edit Profile & Skills</span>
          </button>
        </div>

        {/* Dashboard Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-white">{totalApplied}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Applications Sent</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-amber-400">{underReviewCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">In Review / Screen</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-purple-400">{interviewingCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Interviews Scheduled</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-emerald-400">{offersCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Job Offers</div>
          </div>
        </div>
      </div>

      {/* Tabs: My Applications vs Saved Bookmarks */}
      <div className="flex items-center justify-between">
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'applications'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Track Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'saved'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Bookmarks ({savedJobsList.length})</span>
          </button>
        </div>
      </div>

      {/* Applications Pipeline View */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Applications Submitted Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore open positions and apply with your AI-tailored resume and cover letter!
              </p>
            </div>
          ) : (
            applications.map((app) => {
              const currentStageIdx = getStageIndex(app.status);
              const job = app.job || {};
              const company = job.company || {};

              return (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl glass-panel space-y-5 border border-slate-700/80 shadow-xl transition-all"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={company.logo_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100'}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 bg-slate-950 p-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">{company.name}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">{job.location}</span>
                        </div>
                        <h3 
                          onClick={() => onSelectJob(job)}
                          className="text-base font-bold text-white hover:text-indigo-300 cursor-pointer transition-colors"
                        >
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                        {app.match_score}% AI Match
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                        app.status === 'Offered' ? 'badge-offered' :
                        app.status === 'Interviewing' ? 'badge-interview' :
                        app.status === 'Shortlisted' || app.status === 'Under Review' ? 'badge-review' :
                        app.status === 'Rejected' ? 'badge-rejected' : 'badge-applied'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Status Stepper Progression */}
                  {app.status !== 'Rejected' ? (
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Application Progress
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {STAGES.map((stage, idx) => {
                          const isDone = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;

                          return (
                            <div key={stage} className="flex flex-col items-center text-center">
                              <div className={`w-full h-1.5 rounded-full mb-2 ${
                                isDone 
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                  : 'bg-slate-800'
                              }`} />
                              <span className={`text-[10px] font-semibold ${
                                isCurrent 
                                  ? 'text-indigo-300 font-bold' 
                                  : isDone 
                                  ? 'text-slate-300' 
                                  : 'text-slate-600'
                              }`}>
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>Application was not moved forward for this specific role.</span>
                    </div>
                  )}

                  {/* Scheduled Interview or Recruiter Notes Banner */}
                  {app.interview_date && (
                    <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span><strong>Interview Scheduled:</strong> {new Date(app.interview_date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-600 text-white font-bold">Upcoming</span>
                    </div>
                  )}

                  {app.recruiter_notes && (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold">Recruiter Feedback: </span>
                      <span>"{app.recruiter_notes}"</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Saved Jobs View */}
      {activeTab === 'saved' && (
        <div>
          {savedJobsList.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Saved Jobs Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bookmark interesting job openings while browsing to easily apply later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedJobsList.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={onSelectJob}
                  onApply={onApplyJob}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
