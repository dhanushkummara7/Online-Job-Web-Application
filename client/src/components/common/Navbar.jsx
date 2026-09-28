import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Briefcase, 
  Sparkles, 
  FileText, 
  Building2, 
  Layers, 
  Bell, 
  UserCheck, 
  CheckCircle2, 
  ChevronDown, 
  PlusCircle, 
  Database,
  ExternalLink,
  Menu,
  X,
  Clock,
  Mail,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab, onOpenPostJob, onOpenSupabaseModal }) => {
  const { 
    user, 
    role, 
    isAuthenticated,
    isEmailVerified,
    logout,
    switchRole, 
    notifications, 
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    openEmailInbox,
    unreadEmailsCount
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = role === 'seeker' ? [
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'resume-studio', label: 'AI Resume Studio', icon: Sparkles, badge: 'AI ATS' },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'applications', label: 'My Applications', icon: Layers }
  ] : [
    { id: 'recruiter-dashboard', label: 'Recruiter Hub', icon: Layers },
    { id: 'jobs', label: 'Job Board', icon: Briefcase },
    { id: 'companies', label: 'Companies', icon: Building2 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                CareerPulse <span className="text-indigo-400 text-xs font-semibold px-1.5 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/30">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Next-Gen Job Portal</div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Persona Switcher, Actions & Notifications */}
        <div className="flex items-center gap-3">
          
          {/* Dual Persona Switcher */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
            <span className="px-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Persona:</span>
            <button
              onClick={() => switchRole('seeker')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                role === 'seeker'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Job Seeker</span>
            </button>
            <button
              onClick={() => switchRole('recruiter')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                role === 'recruiter'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>
          </div>

          {/* Recruiter Post Job Button */}
          {role === 'recruiter' && (
            <button
              onClick={onOpenPostJob}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          )}

          {/* Email Inbox Button */}
          <button
            onClick={() => openEmailInbox()}
            title="Interactive Email Center"
            className="relative p-2 rounded-xl text-slate-300 hover:text-indigo-300 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <Mail className="w-4 h-4 text-indigo-400" />
            {unreadEmailsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadEmailsCount}
              </span>
            )}
          </button>

          {/* Supabase & Architecture Info Button */}
          <button
            onClick={onOpenSupabaseModal}
            title="Database & Architecture Info"
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 border border-slate-800 transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown shadow-2xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.link === '/applications') setCurrentTab('applications');
                          else if (n.link?.includes('recruiter')) setCurrentTab('recruiter-dashboard');
                          setShowNotifications(false);
                        }}
                        className={`p-3 rounded-xl cursor-pointer text-left transition-all border ${
                          n.read
                            ? 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/40'
                            : 'bg-indigo-950/40 border-indigo-500/30 hover:bg-indigo-900/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-semibold text-slate-200">{n.title}</div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-2">
                          <Clock className="w-3 h-3" />
                          <span>Just now</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill or Auth Action Buttons */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-left"
              >
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/30"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-200 leading-none">{user?.name?.split(' ')[0] || 'User'}</div>
                  <div className="text-[10px] text-indigo-400 font-medium capitalize mt-0.5">{role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl glass-dropdown shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="p-2.5 border-b border-slate-800">
                    <div className="text-xs font-bold text-white">{user?.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold">
                        {role === 'recruiter' ? 'Verified Recruiter' : 'Job Seeker'}
                      </span>
                      {user?.email_verified ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-0.5 font-medium">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5 mt-1">
                    {role === 'seeker' ? (
                      <>
                        <button
                          onClick={() => { setCurrentTab('applications'); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 text-left transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5 text-indigo-400" /> My Applications
                        </button>
                        <button
                          onClick={() => { setCurrentTab('resume-studio'); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 text-left transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Resume Studio
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setCurrentTab('recruiter-dashboard'); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 text-left transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5 text-purple-400" /> Recruiter Pipeline
                        </button>
                        <button
                          onClick={() => { onOpenPostJob(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 text-left transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> Post New Job
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => { openEmailInbox(); setShowProfileMenu(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Email & OTP Inbox</span>
                      </div>
                      {unreadEmailsCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500 text-white font-bold">
                          {unreadEmailsCount}
                        </span>
                      )}
                    </button>

                    <div className="pt-1 border-t border-slate-800/60 mt-1">
                      <button
                        onClick={() => {
                          switchRole(role === 'seeker' ? 'recruiter' : 'seeker');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-indigo-300 hover:bg-indigo-950/40 text-left transition-colors"
                      >
                        <span>Switch to {role === 'seeker' ? 'Recruiter' : 'Seeker'}</span>
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                          setCurrentTab('login');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 text-left transition-colors mt-0.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setCurrentTab('signup')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <button
            onClick={() => { openEmailInbox(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Email Inbox & Alerts</span>
            </div>
            {unreadEmailsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold">
                {unreadEmailsCount}
              </span>
            )}
          </button>

          {!user ? (
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => { setCurrentTab('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => { setCurrentTab('signup'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold text-center"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  setCurrentTab('login');
                }}
                className="text-xs text-rose-400 font-semibold"
              >
                Sign Out ({user.name.split(' ')[0]})
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => { switchRole('seeker'); setMobileMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${role === 'seeker' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  Seeker
                </button>
                <button
                  onClick={() => { switchRole('recruiter'); setMobileMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${role === 'recruiter' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  Recruiter
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
