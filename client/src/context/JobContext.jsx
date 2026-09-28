import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { user, addToast } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [minSalary, setMinSalary] = useState(0);

  const POPULAR_LOCATIONS = [
    'All India',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Mumbai',
    'Gurgaon / NCR',
    'Noida',
    'Chennai',
    'Remote (India)'
  ];

  // Fetch Jobs with Real-time Filters
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.jobs.getAll({
        search: searchQuery,
        location: locationQuery,
        category: selectedCategory,
        workplace_type: selectedWorkplace,
        job_type: selectedJobType,
        experience_level: selectedExperience,
        min_salary: minSalary > 0 ? minSalary : undefined
      });
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI Recommendations
  const fetchRecommendations = async () => {
    try {
      const res = await api.ai.getRecommendations(user?.id);
      if (res.success) {
        setRecommendedJobs(res.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  // Fetch Saved Jobs
  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      const res = await api.jobs.getSaved(user.id);
      if (res.success) {
        const ids = new Set((res.savedJobs || []).map(s => s.job_id));
        setSavedJobIds(ids);
      }
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const res = await api.companies.getAll();
      if (res.success) {
        setCompanies(res.companies || []);
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, [searchQuery, locationQuery, selectedCategory, selectedWorkplace, selectedJobType, selectedExperience, minSalary]);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
      fetchRecommendations();
    }
  }, [user]);

  // Toggle Save Job
  const toggleSave = async (jobId) => {
    if (!user) {
      addToast('Please sign in to save jobs', 'warning');
      return;
    }
    try {
      const res = await api.jobs.toggleSave(user.id, jobId);
      if (res.success) {
        setSavedJobIds(prev => {
          const next = new Set(prev);
          if (res.saved) {
            next.add(jobId);
            addToast('Job saved to your bookmarks!', 'success');
          } else {
            next.delete(jobId);
            addToast('Job removed from bookmarks', 'info');
          }
          return next;
        });
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory('All');
    setSelectedWorkplace('All');
    setSelectedJobType('All');
    setSelectedExperience('All');
    setMinSalary(0);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        recommendedJobs,
        savedJobIds,
        companies,
        loading,
        activeJob,
        setActiveJob,
        searchQuery,
        setSearchQuery,
        locationQuery,
        setLocationQuery,
        popularLocations: POPULAR_LOCATIONS,
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
        resetFilters,
        fetchJobs,
        fetchRecommendations,
        toggleSave
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);
