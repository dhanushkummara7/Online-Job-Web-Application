import React, { useState } from 'react';
import { useJobs } from '../context/JobContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { JobCard } from '../components/seeker/JobCard.jsx';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  SlidersHorizontal,
  DollarSign,
  Grid,
  List
} from 'lucide-react';

export const Jobs = ({ onSelectJob, onApplyJob }) => {
  const { 
    jobs, 
    recommendedJobs, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    locationQuery,
    setLocationQuery,
    popularLocations,
    selectedCategory, 
    setSelectedCategory, 
    selectedWorkplace, 
    setSelectedWorkplace, 
    selectedJobType, 
    setSelectedJobType, 
    selectedExperience, 
    setSelectedExperience, 
    minSalary, 
    setMinSalary, 
    resetFilters 
  } = useJobs();

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'ai-recommended'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const displayedJobs = activeTab === 'ai-recommended' ? recommendedJobs : jobs;

  const categories = ['All', 'Software Engineering', 'AI / Machine Learning', 'Design & UX', 'DevOps & Cloud', 'Product Management', 'Data Science'];
  const workplaces = ['All', 'Remote', 'Hybrid', 'Onsite'];
  const jobTypes = ['All', 'Full-time', 'Contract', 'Part-time', 'Internship'];
  const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead / Staff', 'Executive'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Find Your Next Big Opportunity in India</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time location search across Bengaluru, Hyderabad, Pune, Mumbai, NCR & Remote</p>
        </div>

        {/* AI Recommendations Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>All Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-recommended')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'ai-recommended'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Matches ({recommendedJobs.length})</span>
          </button>
        </div>
      </div>

      {/* Dual Search Bar: Keywords + Real-Time Location Search */}
      <div className="p-3 rounded-2xl glass-panel flex flex-col md:flex-row items-center gap-3 border border-slate-700/80 shadow-xl">
        {/* Keywords Input */}
        <div className="flex-1 flex items-center gap-3 px-3 w-full">
          <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Role, skills (e.g. React, Node.js, Python), or company..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-300 p-1"
            >
              ✕
            </button>
          )}
        </div>

        <div className="h-6 w-px bg-slate-700 hidden md:block" />

        {/* Real-time Dedicated Location Search */}
        <div className="flex items-center gap-3 px-3 w-full md:w-80">
          <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search by city (e.g. Bengaluru, Pune)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {locationQuery && (
            <button
              onClick={() => setLocationQuery('')}
              className="text-xs text-slate-500 hover:text-slate-300 p-1"
              title="Clear location filter"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden w-full md:w-auto p-2.5 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-semibold"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Quick Real-Time Indian City Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick City Filter:</span>
        </span>
        {popularLocations?.map((city) => {
          const isSelected = (city === 'All India' && !locationQuery) || (locationQuery && city.toLowerCase().includes(locationQuery.toLowerCase()));

          return (
            <button
              key={city}
              onClick={() => setLocationQuery(city === 'All India' ? '' : city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Sidebar Filters + Jobs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-6`}>
          <div className="p-5 rounded-2xl glass-panel space-y-5 border border-slate-800">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Filter Criteria
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Location Filter Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>Location / City</span>
                </span>
                {locationQuery && (
                  <button
                    onClick={() => setLocationQuery('')}
                    className="text-[10px] text-purple-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </label>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Filter by city name..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 mb-2"
              />
              <div className="flex flex-wrap gap-1">
                {['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Remote'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocationQuery(locationQuery === loc ? '' : loc)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                      locationQuery.toLowerCase().includes(loc.toLowerCase())
                        ? 'bg-purple-950/60 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Workplace Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Workplace Type</label>
              <div className="grid grid-cols-2 gap-1.5">
                {workplaces.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWorkplace(w)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedWorkplace === w
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Employment Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {jobTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Experience Level</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {experienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Minimum Salary Range Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                <span>Minimum Salary (LPA)</span>
                <span className="text-emerald-400">{minSalary > 0 ? `₹${(minSalary / 100000).toFixed(0)} LPA` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="8000000"
                step="200000"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </aside>

        {/* Right Jobs List / Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Showing <strong className="text-white">{displayedJobs.length}</strong> positions</span>
              {locationQuery && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-purple-400" />
                  <span>{locationQuery}</span>
                  <button onClick={() => setLocationQuery('')} className="hover:text-white ml-1 text-slate-400" title="Clear location">✕</button>
                </span>
              )}
            </div>
            {activeTab === 'ai-recommended' && (
              <span className="text-purple-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Ranked by Candidate Skill Alignment
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-slate-400 animate-pulse">
              Loading jobs matching your criteria...
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No job openings found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your search terms or reset the filters to see all available roles.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={onSelectJob}
                  onApply={onApplyJob}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
