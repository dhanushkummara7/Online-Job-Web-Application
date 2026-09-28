import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { EmailVerificationModal } from '../components/auth/EmailVerificationModal.jsx';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Next.js', 'Docker', 'PostgreSQL', 'AI/ML', 'GraphQL'
];

export const Signup = ({ setCurrentTab, onSignupSuccess }) => {
  const { register, addToast } = useAuth();

  const [role, setRole] = useState('seeker'); // 'seeker' or 'recruiter'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js']);
  const [customSkill, setCustomSkill] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email Verification modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Password Strength Calculation
  const calculateStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };
  const strengthScore = calculateStrength();

  const handleAddSkill = (skillToAdd) => {
    const s = skillToAdd.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    if (role === 'recruiter' && !companyName.trim()) {
      setError('Company Name is required for Recruiter accounts.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        headline: headline.trim() || (role === 'recruiter' ? 'Talent Acquisition Partner' : 'Software Professional'),
        skills: role === 'seeker' ? skills : [],
        companyName: role === 'recruiter' ? companyName.trim() : null,
        companyWebsite: role === 'recruiter' ? companyWebsite.trim() : null
      };

      const res = await register(payload);
      setRegisteredEmail(email.trim().toLowerCase());
      setShowVerificationModal(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    if (onSignupSuccess) {
      onSignupSuccess();
    } else {
      setCurrentTab(role === 'recruiter' ? 'recruiter-dashboard' : 'jobs');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10 my-4">
        
        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/30 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your CareerPulse Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join next-generation tech opportunities with AI resume matching and verified hiring.
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* Persona Role Selection Cards */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center sm:text-left">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  role === 'seeker'
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'seeker' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Job Seeker
                    {role === 'seeker' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Explore jobs, test ATS resume scores & apply
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  role === 'recruiter'
                    ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-500/10 ring-1 ring-purple-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'recruiter' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Hiring Recruiter
                    {role === 'recruiter' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Post tech jobs & screen pre-ranked candidates
                  </div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhanush V"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Password strength:</span>
                  <span className={`font-semibold ${
                    strengthScore <= 25 ? 'text-rose-400' : strengthScore <= 50 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {strengthScore <= 25 ? 'Weak' : strengthScore <= 50 ? 'Medium' : strengthScore <= 75 ? 'Good' : 'Strong'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      strengthScore <= 25 ? 'bg-rose-500' : strengthScore <= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(10, strengthScore)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {role === 'recruiter' ? 'Professional Title' : 'Headline / Target Role'}
              </label>
              <input
                type="text"
                placeholder={role === 'recruiter' ? 'e.g. Senior Tech Recruiter @ InnoTech' : 'e.g. Senior Full Stack Engineer (React, Node.js)'}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Role-Specific Fields */}
            {role === 'seeker' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Core Skills & Technologies
                </label>
                
                {/* Active Skill Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-500/30"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type skill (e.g. MongoDB, Docker) and click Add"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customSkill) {
                          handleAddSkill(customSkill);
                          setCustomSkill('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs outline-none focus:border-indigo-500 placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customSkill) {
                        handleAddSkill(customSkill);
                        setCustomSkill('');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Suggested Skill Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500">Quick add:</span>
                  {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 5).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-800 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 rounded-xl bg-slate-950/60 border border-purple-900/30">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay, Swiggy, InnoCorp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                    Company Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20"
                />
                <span className="text-xs text-slate-400 leading-relaxed">
                  I agree to the <span className="text-indigo-400 hover:underline">Terms of Service</span>, <span className="text-indigo-400 hover:underline">Privacy Policy</span>, and consent to receiving email notifications for account verification and matching alerts.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Send Verification Email</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Switch to Login */}
        <div className="mt-5 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentTab('login')}
            className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors ml-1"
          >
            Sign In here
          </button>
        </div>

      </div>

      {/* Email Verification Modal on Successful Registration */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        email={registeredEmail}
        onClose={() => setShowVerificationModal(false)}
        onSuccess={handleVerificationSuccess}
      />

    </div>
  );
};
