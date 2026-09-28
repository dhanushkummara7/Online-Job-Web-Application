# 🚀 CareerPulse AI — Real-World Smart Job Portal (MERN + Supabase + AI)

> A modern, full-stack, enterprise-grade job portal connecting job seekers with leading tech companies, featuring **AI-Powered Resume ATS Scoring, Candidate-to-Job Fit Analysis, Automated Cover Letter Generation, Recruiter AI Job Description Builder, and Live Application Tracking**.

---

## 🌟 Key Highlights & Feature Matrix

### 👤 For Job Seekers
1. **Explore & Multi-Filter Search**: Search across thousands of roles with filters for Category, Workplace Type (Remote / Hybrid / Onsite), Job Type (Full-time / Contract / Internship), Experience Level, and Salary range sliders.
2. **AI Resume Studio (ATS & Skill Gap Analyzer)**:
   - Upload or paste plain-text/formatted resume.
   - Computes an instant **0–100% ATS Compatibility Score** with radial gauge visualization.
   - Extracts hard skills, soft skills, and cloud proficiencies into categorized chips.
   - Identifies **missing critical keywords** tailored to the chosen career domain.
   - Provides actionable bullet-point recommendations to optimize candidate resumes for ATS filters.
   - Automatically recommends open positions matching detected skills.
3. **1-Click AI Application Flow**:
   - Apply with profile resume.
   - **AI Cover Letter Generator**: Automatically generates tailored, high-converting cover letters matching the candidate's achievements with the company's job requirements.
   - Celebratory confetti effects upon successful application.
4. **Live Application Pipeline Tracker**:
   - Visual 5-stage progression stepper: `Applied` $\to$ `Under Review` $\to$ `Shortlisted` $\to$ `Interviewing` $\to$ `Offered`.
   - Real-time recruiter notes and scheduled interview countdown.
5. **Saved Jobs Bookmarking**: Save jobs for later review.
6. **Profile Customization**: Edit headlines, bios, skills, work history, target roles, and remote preferences.

### 🏢 For Recruiters & Employers
1. **Recruiter Hub & Dashboard**: Overview metrics on active postings, candidate pipeline size, scheduled interviews, and average candidate match %.
2. **AI Job Description Generator**:
   - Input job title, category, and skills.
   - AI auto-generates structured responsibilities, requirements, tags, and compensation benchmarks in seconds.
3. **Interactive Candidate Kanban Board**:
   - Drag/Click progression columns (`Applied`, `Under Review`, `Shortlisted`, `Interviewing`, `Offered`, `Rejected`).
   - Candidate match score badges, skills breakdown, and date applied.
4. **Candidate Drawer & Interview Scheduler**:
   - Review applicant profiles, resumes, and submitted cover letters.
   - Inspect AI Candidate-to-Job Fit rating.
   - Schedule interview dates/times with automated notification updates to the candidate.
   - Add private recruiter evaluation notes.
5. **Job Postings Management**: Create, edit, pause, and delete postings.

### ⚡ Dual Persona Switcher
- Seamless 1-click switcher in the top navigation bar to test both perspectives instantly:
  - **Job Seeker Mode**: Evaluates the portal as *Sarah Jenkins* (Senior Full Stack Engineer).
  - **Recruiter Mode**: Evaluates the portal as *Marcus Vance* (Lead Talent Acquisition @ Stripe).

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | **React 18 + Vite** | Fast rendering, modular component hierarchy |
| **Styling** | **Tailwind CSS + Glassmorphism** | Modern dark-mode UI with sleek gradients and glows |
| **Icons & Effects** | **Lucide React + Canvas Confetti** | Crisp modern iconography and micro-interactions |
| **Backend API** | **Node.js + Express** | RESTful endpoints for Auth, Jobs, Apps, AI, Companies |
| **Database** | **Supabase PostgreSQL + Resilient Fallback** | Cloud PostgreSQL schema migrations + local persistence |
| **AI Intelligence** | **NLP & Prompt Engine** | Resume ATS analyzer, skill matcher, cover letter & JD generators |

---

## 📂 Project Structure

```
Online Job Web Application/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, ToastContainer, SupabaseModal
│   │   │   ├── seeker/         # JobCard, ApplyModal, ProfileEditorModal
│   │   │   ├── recruiter/      # JobPostModal, CandidateDrawer
│   │   │   └── ai/             # AtsScoreMeter, SkillMatchWidget
│   │   ├── context/            # AuthContext, JobContext
│   │   ├── pages/              # Home, Jobs, JobDetails, ResumeStudio, SeekerDashboard, RecruiterDashboard, Companies
│   │   ├── services/           # api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend API
│   ├── controllers/            # auth, jobs, applications, ai, companies
│   ├── routes/                 # Express API routes
│   ├── services/               # aiService.js (ATS analyzer, Matcher, Generators)
│   ├── config/                 # store.js, supabase.js
│   ├── data/                   # seedData.js (Stripe, OpenAI, Linear, Spotify, etc.)
│   ├── server.js
│   └── .env
│
└── supabase/
    └── schema.sql              # Supabase PostgreSQL relational schema
```

---

## 🚀 How to Run Locally

### 1. Start the Backend API Server
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🗄️ Supabase Configuration (Optional)
The application includes a self-contained resilient store with preloaded high-caliber tech data (Stripe, OpenAI, Linear, Spotify, Vercel, Airbnb) so it **runs immediately out of the box with zero required database setup**.

To connect your custom Supabase Cloud project:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run the SQL schema from `supabase/schema.sql` in Supabase's SQL Editor.
3. Update `server/.env` with your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Restart the server.
