import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobContext.jsx';
import { api } from '../services/api.js';
import { AtsScoreMeter } from '../components/ai/AtsScoreMeter.jsx';
import { JobCard } from '../components/seeker/JobCard.jsx';
import { 
  Sparkles, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Loader2, 
  ArrowRight, 
  Zap, 
  Cpu, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export const ResumeStudio = ({ onSelectJob, onApplyJob }) => {
  const { user, addToast } = useAuth();
  const { jobs } = useJobs();

  const [resumeText, setResumeText] = useState(user?.resume_text || '');
  const [targetCategory, setTargetCategory] = useState('Software Engineering');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Pre-load sample resume
  const handleLoadSample = () => {
    const sample = `SARAH JENKINS
Senior Full Stack Engineer
Email: sarah.jenkins@example.com | Bengaluru, Karnataka, India | GitHub: github.com/sarahjenkins

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 6+ years of expertise architecting high-throughput distributed web systems, React/TypeScript frontends, and scalable Node.js/PostgreSQL microservices on AWS across high-growth Indian tech platforms.

CORE SKILLS
- Frontend: React, TypeScript, Next.js, Redux, TailwindCSS, Vite
- Backend: Node.js, Express, Python, FastAPI, GraphQL, REST APIs
- Cloud & Data: PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS (EC2, S3, ECS, Lambda), CI/CD

EXPERIENCE
Senior Full Stack Engineer | Razorpay Tech Labs | Bengaluru, India | 2023 - Present
- Architected real-time merchant analytics dashboard servicing 2M+ daily active payments across UPI and cards.
- Decreased query response latency by 42% through PostgreSQL index tuning and Redis caching.
- Spearheaded containerized microservice migration using Docker and AWS ECS.

Frontend Engineer | Flipkart Internet | Bengaluru, India | 2020 - 2023
- Built modular enterprise component library in React & TypeScript with 92% test coverage.
- Improved Core Web Vitals and checkout load performance by 35%.

EDUCATION
B.Tech in Computer Science | IIT Madras / IIIT Bangalore (CGPA 8.9 / 10)`;

    setResumeText(sample);
    addToast('Loaded sample Senior Full Stack resume (Bengaluru, India)!', 'info');
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 40) {
      addToast('Please enter a detailed resume before running the analysis.', 'warning');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await api.ai.analyzeResume(resumeText, targetCategory);
      if (res.success && res.analysis) {
        setAnalysisResult(res.analysis);
        addToast(`ATS Analysis Complete: ${res.analysis.ats_score}% Score! 🎉`, 'success');
      }
    } catch (err) {
      addToast('Analysis failed: ' + err.message, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!analysisResult) return;
    const text = `ATS Score: ${analysisResult.ats_score}%\nRating: ${analysisResult.rating}\nDetected Skills: ${analysisResult.detected_skills.join(', ')}\nRecommendations:\n• ${analysisResult.recommendations.join('\n• ')}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    addToast('ATS Report copied to clipboard!', 'info');
  };

  // Matched jobs based on analysis
  const matchedJobs = analysisResult
    ? jobs.filter(j => (j.skills_required || []).some(s => analysisResult.detected_skills.includes(s))).slice(0, 4)
    : jobs.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI-Powered ATS Resume Scanner & Keyword Matcher</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          AI Resume ATS & Skill Studio
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Screen your resume against modern Applicant Tracking System (ATS) parsers, identify keyword gaps, and maximize interview conversion rates.
        </p>
      </div>

      {/* Input Section: Resume Text & Target Domain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" /> Resume Input
              </span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Load Sample Resume
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Role Domain</label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Software Engineering">Software Engineering (Full Stack / Backend / Frontend)</option>
                <option value="AI / Machine Learning">AI & Machine Learning / MLOps</option>
                <option value="DevOps & Cloud">DevOps / Cloud Architecture / SRE</option>
                <option value="Design & UX">UI/UX Design & Product Design</option>
                <option value="Product Management">Product Management</option>
                <option value="Data Science">Data Science & Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resume / CV Text</label>
              <textarea
                rows={12}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your plain text resume or work history here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-102 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning ATS Metrics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: AI ATS Analysis Results */}
        <div className="lg:col-span-2 space-y-6">
          {!analysisResult ? (
            <div className="p-12 rounded-3xl glass-panel text-center space-y-4 border border-dashed border-slate-700">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">No Analysis Run Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Click <strong>"Analyze Resume with AI"</strong> to scan your experience against modern ATS parser algorithms and receive an in-depth score breakdown.
              </p>
              <button
                onClick={handleAnalyze}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                Run Quick Scan
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              
              {/* ATS Score Gauge Component */}
              <AtsScoreMeter
                score={analysisResult.ats_score}
                rating={analysisResult.rating}
                breakdown={analysisResult.breakdown}
              />

              {/* Detected Skills Cloud */}
              <div className="p-5 rounded-2xl glass-panel space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Extracted Core Skills ({analysisResult.detected_skills.length})</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Parsed by NLP engine</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.detected_skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Recommended Keywords */}
              {analysisResult.missing_skills.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Missing High-Demand Keywords for {targetCategory}</span>
                  </span>
                  <p className="text-xs text-slate-300">
                    Recruiters frequently screen for these terms. If you have relevant experience with them, consider weaving them into your summary:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missing_skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/50 text-amber-300 border border-amber-500/30 font-medium"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl glass-panel space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Profile Strengths
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl glass-panel space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4" /> Actionable Improvements
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Copy Report Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCopyAnalysis}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Full ATS Report'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Matched Open Roles Based on Scan */}
      {analysisResult && matchedJobs.length > 0 && (
        <section className="pt-8 border-t border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Matching Open Roles for Your Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Positions aligned with your detected skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={onSelectJob}
                onApply={onApplyJob}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
