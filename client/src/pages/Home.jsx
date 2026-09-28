import React, { useState } from 'react';
import { useJobs } from '../context/JobContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { JobCard } from '../components/seeker/JobCard.jsx';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  Users, 
  Award,
  ChevronRight
} from 'lucide-react';

export const Home = ({ setCurrentTab, onSelectJob, onApplyJob }) => {
  const { jobs, companies, setSearchQuery, locationQuery, setLocationQuery, setSelectedCategory } = useJobs();
  const { role } = useAuth();
  const [localSearch, setLocalSearch] = useState('');

  const featuredJobs = jobs.slice(0, 6);

  const categories = [
    { name: 'Software Engineering', count: '1,420+ jobs', icon: Cpu, color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'AI / Machine Learning', count: '680+ jobs', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10' },
    { name: 'Design & UX', count: '410+ jobs', icon: TrendingUp, color: 'text-pink-400 bg-pink-500/10' },
    { name: 'DevOps & Cloud', count: '520+ jobs', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Product Management', count: '390+ jobs', icon: Award, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'Data Science', count: '480+ jobs', icon: Users, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  const handleHeroSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentTab('jobs');
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setCurrentTab('jobs');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        {/* Hero Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-glow-brand animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI-Powered Matching & ATS Resume Optimization</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Connect With Elite Tech Roles in India <br className="hidden sm:inline" />
          Powered by <span className="text-gradient">Intelligent AI</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Skip generic job boards. Discover top-tier opportunities across Bengaluru, Hyderabad, Pune, Mumbai, and Delhi NCR with instant ATS resume scoring.
        </p>

        {/* Hero Dual Real-Time Search Bar */}
        <form 
          onSubmit={handleHeroSearch}
          className="mt-10 max-w-4xl mx-auto p-2 sm:p-2.5 rounded-2xl glass-panel shadow-2xl flex flex-col md:flex-row items-center gap-2.5 border border-slate-700/70"
        >
          {/* Keywords / Role Input */}
          <div className="flex items-center gap-3 px-3 w-full flex-1">
            <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Job title, skills (e.g. React, Python), or company..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="h-6 w-px bg-slate-700 hidden md:block" />

          {/* Real-time Location Search Input */}
          <div className="flex items-center gap-3 px-3 w-full md:w-72">
            <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="City (e.g. Bengaluru, Pune)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Search Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Real-Time Indian Cities Filter Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Popular Hubs:</span>
          {['All India', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Gurgaon / NCR', 'Noida', 'Remote (India)'].map((city) => {
            const isSelected = (city === 'All India' && !locationQuery) || (locationQuery && city.toLowerCase().includes(locationQuery.toLowerCase()));

            return (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setLocationQuery(city === 'All India' ? '' : city);
                  setCurrentTab('jobs');
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 font-semibold shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-3 h-3 text-indigo-400" />
                <span>{city}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">5,200+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Verified Openings in India</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">850+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">High-Growth Indian Tech Co.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">96.4%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">AI Match Accuracy</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹35 LPA</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Avg Senior Tech CTC</div>
          </div>
        </div>
      </section>

      {/* AI Resume Studio Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI RESUME STUDIO
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Scan Your Resume with our AI ATS Analyzer in Seconds
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Receive an instant 0–100% ATS score, identify missing industry keywords, get tailored formatting tips, and discover jobs mapped directly to your technical skillset.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('resume-studio')}
                  className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-200 shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>Launch AI Resume Studio</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-700/60 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-300">Live AI ATS Analysis</span>
                <span className="text-emerald-400 font-bold">94% Compatibility Score</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> React & TypeScript
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Node.js & Microservices
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PostgreSQL & Redis
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                "Quantified latency reduction by 42% detected. Strong leadership verbs present."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Trending Job Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Explore specialized engineering and tech positions</p>
          </div>
          <button
            onClick={() => setCurrentTab('jobs')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className="p-5 rounded-2xl glass-panel glass-panel-hover cursor-pointer text-left transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {cat.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{cat.count}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Open Roles</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                AI Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Handpicked high-impact positions from leading tech companies</p>
          </div>

          <button
            onClick={() => setCurrentTab('jobs')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All ({jobs.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              onApply={onApplyJob}
            />
          ))}
        </div>
      </section>

      {/* Top Hiring Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Top Verified Companies Hiring Now</h2>
            <p className="text-xs text-slate-400 mt-1">Directly recruit from industry-defining platforms</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companies.map((c) => (
              <div
                key={c.id}
                onClick={() => setCurrentTab('companies')}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer flex flex-col items-center text-center transition-all hover:-translate-y-1"
              >
                <img
                  src={c.logo_url}
                  alt={c.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-900 p-1 mb-2"
                />
                <span className="text-xs font-bold text-white">{c.name}</span>
                <span className="text-[11px] text-slate-400">{c.location.split(',')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
