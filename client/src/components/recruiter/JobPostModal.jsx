import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useJobs } from '../../context/JobContext.jsx';
import { api } from '../../services/api.js';
import { 
  X, 
  Briefcase, 
  Sparkles, 
  Wand2, 
  Plus, 
  Building2, 
  DollarSign, 
  MapPin, 
  Loader2, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

export const JobPostModal = ({ isOpen, onClose, onJobCreated }) => {
  const { user, addToast } = useAuth();
  const { companies, fetchJobs } = useJobs();

  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState(companies[0]?.id || 'c-stripe');
  const [category, setCategory] = useState('Software Engineering');
  const [experienceLevel, setExperienceLevel] = useState('Senior Level');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [jobType, setJobType] = useState('Full-time');
  const [location, setLocation] = useState('Bengaluru, Karnataka, India (Remote Open)');
  const [salaryMin, setSalaryMin] = useState(2500000);
  const [salaryMax, setSalaryMax] = useState(4500000);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [newSkill, setNewSkill] = useState('');

  const [generatingAI, setGeneratingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // AI Auto-Generate Description
  const handleAiAutoFill = async () => {
    if (!title.trim()) {
      addToast('Please enter a Job Title first so AI can generate the content.', 'warning');
      return;
    }

    setGeneratingAI(true);
    try {
      const res = await api.ai.generateJobDescription({
        title,
        category,
        experienceLevel,
        workplaceType,
        keyBullets: skills
      });

      if (res.success && res.data) {
        setDescription(res.data.description);
        setResponsibilities(res.data.responsibilities.join('\n• '));
        setRequirements(res.data.requirements.join('\n• '));
        if (res.data.skills_required && res.data.skills_required.length) {
          setSkills(res.data.skills_required);
        }
        addToast('AI structured job description generated successfully!', 'success');
      }
    } catch (err) {
      addToast('AI Generation failed: ' + err.message, 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('Job title and description are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const resResp = responsibilities.split('\n').map(s => s.replace(/^•\s*/, '').trim()).filter(Boolean);
      const reqResp = requirements.split('\n').map(s => s.replace(/^•\s*/, '').trim()).filter(Boolean);

      const jobData = {
        recruiter_id: user?.id || 'u-recruiter-1',
        company_id: companyId,
        title,
        category,
        description,
        responsibilities: resResp.length ? resResp : ["Lead engineering initiatives and design robust software architectures."],
        requirements: reqResp.length ? reqResp : ["3+ years of relevant industry experience."],
        skills_required: skills,
        location,
        workplace_type: workplaceType,
        job_type: jobType,
        experience_level: experienceLevel,
        salary_min: Number(salaryMin),
        salary_max: Number(salaryMax)
      };

      const res = await api.jobs.create(jobData);
      if (res.success) {
        addToast(`Job opening "${title}" published successfully!`, 'success');
        fetchJobs();
        if (onJobCreated) onJobCreated();
        onClose();
      }
    } catch (err) {
      addToast('Failed to create job: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Job Opening</h3>
              <p className="text-xs text-slate-400">Publish to thousands of qualified active candidates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Assistant Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-purple-200">AI Job Description Assistant</div>
              <div className="text-[11px] text-slate-400">Fill in the Job Title below and let AI craft responsibilities, requirements, and tags in 1 click!</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAiAutoFill}
            disabled={generatingAI}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all hover:scale-105 disabled:opacity-50 flex-shrink-0"
          >
            {generatingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            <span>AI Auto-Fill</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead Backend Engineer (Distributed Systems)"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hiring Company</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category, Experience, Workplace Type, Job Type */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="Design & UX">Design & UX</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Product Management">Product Management</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Experience</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Staff">Lead / Staff</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Workplace</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Location & Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA / Remote"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Min (₹ INR / PA)</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                step="100000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Max (₹ INR / PA)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                step="100000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description Overview *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of the position, team mission, and impact..."
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          {/* Responsibilities & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Key Responsibilities (One per line)</label>
              <textarea
                rows={4}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="• Architect and deploy high throughput services&#10;• Collaborate with cross-functional squads..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Requirements (One per line)</label>
              <textarea
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="• 4+ years experience with React / TypeScript&#10;• Experience with high-scale PostgreSQL..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Skills Required Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Required Skills / Tags ({skills.length})</span>
              <span className="text-[11px] text-purple-400">Used for candidate ATS matching</span>
            </label>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a required skill (e.g. Docker, Redis, Kubernetes)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/30 flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-purple-400 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Job...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Job Opening</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
