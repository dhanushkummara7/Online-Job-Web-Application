import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { JobProvider, useJobs } from './context/JobContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { ToastContainer } from './components/common/ToastContainer.jsx';
import { SupabaseModal } from './components/common/SupabaseModal.jsx';
import { EmailInboxModal } from './components/email/EmailInboxModal.jsx';
import { ApplyModal } from './components/seeker/ApplyModal.jsx';
import { ProfileEditorModal } from './components/seeker/ProfileEditorModal.jsx';
import { JobPostModal } from './components/recruiter/JobPostModal.jsx';

import { Home } from './pages/Home.jsx';
import { Jobs } from './pages/Jobs.jsx';
import { JobDetails } from './pages/JobDetails.jsx';
import { ResumeStudio } from './pages/ResumeStudio.jsx';
import { SeekerDashboard } from './pages/SeekerDashboard.jsx';
import { RecruiterDashboard } from './pages/RecruiterDashboard.jsx';
import { Companies } from './pages/Companies.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';

import { EmailVerificationBanner } from './components/common/EmailVerificationBanner.jsx';

const MainLayout = () => {
  const { role, isEmailInboxOpen, closeEmailInbox, activeEmailPreview } = useAuth();
  const { setSelectedCategory, fetchJobs } = useJobs();

  const [currentTab, setCurrentTab] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);

  // Modals
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setCurrentTab('job-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyJob = (job) => {
    setApplyingJob(job);
  };

  const handleSelectCompanyJobs = (companyId) => {
    setCurrentTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Unverified Email Alert Banner */}
      <EmailVerificationBanner />

      {/* Main App Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            setCurrentTab={setCurrentTab}
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
          />
        )}

        {currentTab === 'login' && (
          <Login
            setCurrentTab={setCurrentTab}
            onLoginSuccess={() => {
              setCurrentTab(role === 'recruiter' ? 'recruiter-dashboard' : 'home');
            }}
          />
        )}

        {currentTab === 'signup' && (
          <Signup
            setCurrentTab={setCurrentTab}
            onSignupSuccess={() => {
              setCurrentTab(role === 'recruiter' ? 'recruiter-dashboard' : 'jobs');
            }}
          />
        )}

        {currentTab === 'jobs' && (
          <Jobs
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
          />
        )}

        {currentTab === 'job-details' && (
          <JobDetails
            job={selectedJob}
            onBack={() => setCurrentTab('jobs')}
            onApply={handleApplyJob}
          />
        )}

        {currentTab === 'resume-studio' && (
          <ResumeStudio
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
          />
        )}

        {currentTab === 'applications' && (
          <SeekerDashboard
            onOpenProfileEditor={() => setIsProfileEditorOpen(true)}
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
          />
        )}

        {currentTab === 'recruiter-dashboard' && (
          <RecruiterDashboard
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onSelectJob={handleSelectJob}
          />
        )}

        {currentTab === 'companies' && (
          <Companies
            onSelectCompanyJobs={handleSelectCompanyJobs}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Modals & Overlays */}
      <ToastContainer />

      <EmailInboxModal
        isOpen={isEmailInboxOpen}
        onClose={closeEmailInbox}
        initialEmail={activeEmailPreview}
      />

      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          isOpen={!!applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={() => {
            fetchJobs();
          }}
        />
      )}

      {isPostJobOpen && (
        <JobPostModal
          isOpen={isPostJobOpen}
          onClose={() => setIsPostJobOpen(false)}
          onJobCreated={() => {
            fetchJobs();
            setCurrentTab('recruiter-dashboard');
          }}
        />
      )}

      {isProfileEditorOpen && (
        <ProfileEditorModal
          isOpen={isProfileEditorOpen}
          onClose={() => setIsProfileEditorOpen(false)}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <MainLayout />
      </JobProvider>
    </AuthProvider>
  );
}
