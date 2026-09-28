import React, { useState } from 'react';
import { useJobs } from '../context/JobContext.jsx';
import { 
  Building2, 
  MapPin, 
  Users, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Briefcase, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const Companies = ({ onSelectCompanyJobs }) => {
  const { companies, jobs } = useJobs();
  const [search, setSearch] = useState('');

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Verified Tech Companies & Startups
        </h1>
        <p className="text-sm text-slate-300">
          Explore elite organizations hiring top engineering, design, and product talent worldwide.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto">
        <div className="p-2.5 rounded-2xl glass-panel flex items-center gap-3">
          <Search className="w-4 h-4 text-indigo-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company by name, industry, or location..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((company) => {
          const companyJobsCount = jobs.filter(j => j.company_id === company.id).length;

          return (
            <div
              key={company.id}
              className="rounded-3xl glass-panel overflow-hidden border border-slate-700/80 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1"
            >
              <div>
                {/* Banner */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                  <img
                    src={company.banner_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'}
                    alt={company.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Logo & Info */}
                <div className="px-6 -mt-8 relative z-10 space-y-3">
                  <div className="flex items-end justify-between">
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700 bg-slate-950 p-1 shadow-lg"
                    />

                    {company.rating && (
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-amber-300 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{company.rating}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-white">{company.name}</h3>
                      {company.verified && (
                        <ShieldCheck className="w-4 h-4 text-indigo-400" title="Verified Employer" />
                      )}
                    </div>
                    <p className="text-xs text-indigo-300 font-medium">{company.industry}</p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {company.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {company.location.split('&')[0]}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-500" /> {company.size}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <strong>{companyJobsCount}</strong> Open Positions
                </span>

                <button
                  onClick={() => onSelectCompanyJobs(company.id)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>View Openings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
