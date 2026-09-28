// Seed data for Online Job Portal - India Locations & Tech Ecosystem

export const initialProfiles = [
  {
    id: "u-seeker-1",
    email: "sarah.jenkins@example.com",
    name: "Sarah Jenkins",
    role: "seeker",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    headline: "Senior Full Stack & Cloud Architect | React, Node.js, AWS, TypeScript",
    bio: "Passionate software engineer with 6+ years of experience building high-scale distributed systems and user-centric web applications. Specializing in modern JavaScript/TypeScript ecosystems, microservices, and AI-assisted workflows in high-growth Indian tech.",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka, India (Open to Remote)",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Next.js",
      "TailwindCSS",
      "PostgreSQL",
      "MongoDB",
      "GraphQL",
      "Docker",
      "AWS",
      "CI/CD",
      "REST APIs",
      "Redis",
      "Python"
    ],
    experience: [
      {
        title: "Senior Full Stack Engineer",
        company: "Razorpay Tech Labs",
        location: "Bengaluru, Karnataka, India",
        period: "2023 - Present",
        description: "Architected real-time merchant analytics dashboard servicing 2M+ daily active payments. Reduced latency by 42% through query optimization and Redis caching. Led a squad of 5 engineers."
      },
      {
        title: "Frontend Software Engineer",
        company: "Flipkart Internet",
        location: "Bengaluru, Karnataka, India",
        period: "2020 - 2023",
        description: "Built modular component libraries in React & TypeScript. Implemented automated end-to-end testing, achieving 92% code coverage. Optimized Big Billion Day checkout speed."
      }
    ],
    education: [
      {
        degree: "B.Tech in Computer Science & Engineering",
        school: "IIT Madras / IIIT Bangalore",
        year: "2016 - 2020",
        honors: "First Class with Distinction"
      }
    ],
    resume_url: "https://example.com/resumes/sarah_resume.pdf",
    resume_text: `SARAH JENKINS
Senior Full Stack Engineer
Email: sarah.jenkins@example.com | Phone: +91 98765 43210 | Bengaluru, Karnataka, India
LinkedIn: linkedin.com/in/sarahjenkins-dev | GitHub: github.com/sarahjenkins

PROFESSIONAL SUMMARY
Dynamic and results-driven Senior Full Stack Engineer with 6+ years of expertise in architecting scalable web applications, microservices, and distributed cloud systems across India's top fintech and consumer tech ecosystems. Proven track record in React, TypeScript, Node.js, Python, PostgreSQL, and AWS.

CORE SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
- Frontend: React, Next.js, Redux Toolkit, TailwindCSS, Vue.js, Webpack, Vite
- Backend: Node.js, Express.js, NestJS, FastAPI, RESTful APIs, GraphQL
- Databases: PostgreSQL, MongoDB, Redis, Supabase
- Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD, Terraform
- Architecture: Microservices, Event-Driven Architecture, High-Concurrency Checkout, System Design

PROFESSIONAL EXPERIENCE
Senior Full Stack Engineer | Razorpay Tech Labs | Bengaluru, India | 2023 - Present
- Architected and deployed a multi-tenant real-time analytics dashboard servicing over 2M daily active merchant users.
- Decreased API response latency by 42% utilizing Redis caching and PostgreSQL query indexing.
- Spearheaded migration from legacy monolithic architecture to scalable AWS microservices using Docker & ECS.
- Mentored junior and mid-level developers, instituting code review standards and unit testing practices.

Frontend Software Engineer | Flipkart Internet | Bengaluru, India | 2020 - 2023
- Designed and maintained reusable design systems and enterprise React component libraries.
- Improved Core Web Vitals and page load performance by 35% across high-traffic checkout surfaces.
- Integrated automated CI/CD pipelines with GitHub Actions and Jest/Playwright test suites.

EDUCATION
B.Tech in Computer Science & Engineering | IIT Madras | 2016 - 2020 (CGPA 8.9 / 10)`,
    portfolio_url: "https://sarahjenkins.dev",
    github_url: "https://github.com/sarahjenkins",
    linkedin_url: "https://linkedin.com/in/sarahjenkins",
    preferences: {
      remote: true,
      job_types: ["Full-time", "Contract"],
      expected_salary: 3500000, // 35 LPA
      target_roles: ["Senior Full Stack Engineer", "Staff Engineer", "Frontend Architect"]
    },
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "u-recruiter-1",
    email: "marcus.recruiter@stripe.com",
    name: "Marcus Vance",
    role: "recruiter",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    headline: "Head of Engineering Talent Acquisition @ Stripe India",
    bio: "Connecting top engineering and product talent across India with global financial infrastructure challenges at Stripe.",
    phone: "+91 91234 56789",
    location: "Bengaluru, Karnataka, India",
    skills: ["Technical Recruiting", "Executive Search", "Talent Strategy", "Engineering Leadership"],
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "u-seeker-2",
    email: "alex.chen@example.com",
    name: "Alex Verma",
    role: "seeker",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    headline: "AI / Machine Learning Engineer & PyTorch Specialist",
    bio: "Machine learning practitioner passionate about Large Language Models, RAG pipelines, fine-tuning, and scalable model serving.",
    phone: "+91 98111 22334",
    location: "Hyderabad, Telangana, India",
    skills: ["Python", "PyTorch", "Transformers", "LangChain", "FastAPI", "Docker", "Vector Databases", "MLOps"],
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialCompanies = [
  {
    id: "c-stripe",
    user_id: "u-recruiter-1",
    name: "Stripe India",
    slug: "stripe-india",
    logo_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80",
    industry: "Financial Technology & Infrastructure",
    location: "Bengaluru, Karnataka, India",
    website: "https://stripe.com",
    size: "2,000+ in India (Global 8k+)",
    description: "Stripe is a financial infrastructure platform for the internet. Our engineering hubs in Bengaluru and Hyderabad power billions in transactions across global markets, UPI, and developer APIs.",
    benefits: [
      "Top-of-Market Compensation & US Equity (RSUs)",
      "Comprehensive Family Health & Medical Insurance",
      "Flexible Hybrid & Remote Work Culture",
      "₹2,00,000 Annual Learning & Skill Stipend",
      "6 Months Fully Paid Parental Leave",
      "Wellness & Fitness Reimbursement"
    ],
    verified: true,
    rating: 4.8,
    reviews_count: 420
  },
  {
    id: "c-razorpay",
    user_id: "u-recruiter-1",
    name: "Razorpay",
    slug: "razorpay",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
    industry: "Fintech & Payments Innovation",
    location: "Bengaluru, Karnataka, India",
    website: "https://razorpay.com",
    size: "3,500+ employees",
    description: "Razorpay is India's leading full-stack payments and business banking platform, enabling millions of businesses to accept payments, manage payroll, and access credit.",
    benefits: [
      "Competitive ESOPs & Annual Performance Bonuses",
      "Comprehensive Term & Medical Insurance",
      "Unlimited Sick Leaves & Mental Health Support",
      "Meal Cards & Work From Home Allowances"
    ],
    verified: true,
    rating: 4.7,
    reviews_count: 580
  },
  {
    id: "c-google",
    user_id: "u-recruiter-1",
    name: "Google India",
    slug: "google-india",
    logo_url: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    industry: "Cloud, AI & Consumer Technology",
    location: "Hyderabad, Telangana & Bengaluru, India",
    website: "https://google.co.in",
    size: "10,000+ in India",
    description: "Google's engineering centers across Hyderabad and Bengaluru lead global innovations in Google Cloud, Android, Payments (Google Pay), and Search AI.",
    benefits: [
      "Industry-Leading Pay & Alphabet Stock Units",
      "Free Gourmet Food & World-Class Campus Amenities",
      "Complete Family Health Coverage",
      "Hybrid Flexibility & Work From Anywhere Weeks"
    ],
    verified: true,
    rating: 4.9,
    reviews_count: 1200
  },
  {
    id: "c-cred",
    user_id: "u-recruiter-1",
    name: "CRED",
    slug: "cred",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=80",
    industry: "Fintech & High-Craft Consumer Products",
    location: "Bengaluru, Karnataka, India",
    website: "https://cred.club",
    size: "800+ employees",
    description: "CRED is a members-only club that rewards creditworthy individuals with exclusive perks, financial products, and high-design commerce experiences.",
    benefits: [
      "Top Tier CTC with Generous ESOP Grants",
      "Design-Driven Engineering Craftsmanship Culture",
      "Unlimited Leave Policy",
      "MacBook Pro & Premium Ergonomic Workstations"
    ],
    verified: true,
    rating: 4.8,
    reviews_count: 240
  },
  {
    id: "c-microsoft",
    user_id: "u-recruiter-1",
    name: "Microsoft India (IDC)",
    slug: "microsoft-india",
    logo_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    industry: "Cloud Computing, AI & Enterprise Software",
    location: "Hyderabad, Telangana & Noida, India",
    website: "https://microsoft.com",
    size: "18,000+ in India",
    description: "Microsoft India Development Center (IDC) is one of Microsoft's largest R&D centers outside Redmond, driving Azure Cloud, Office 365, and Copilot AI systems.",
    benefits: [
      "Top-tier Base Pay & Annual Stock Rewards (MSFT)",
      "Cab Facilities & Hybrid Work Options",
      "Higher Education Assistance Program",
      "Extensive Wellness & Relocation Allowances"
    ],
    verified: true,
    rating: 4.8,
    reviews_count: 940
  },
  {
    id: "c-swiggy",
    user_id: "u-recruiter-1",
    name: "Swiggy",
    slug: "swiggy",
    logo_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=120&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80",
    industry: "Quick Commerce & Hyperlocal Logistics",
    location: "Bengaluru, Karnataka & Remote (India)",
    website: "https://swiggy.com",
    size: "6,000+ employees",
    description: "Swiggy is India's leading on-demand convenience platform, fulfilling millions of daily grocery (Instamart), food delivery, and logistics orders nationwide.",
    benefits: [
      "Permanent Remote-First Policy for Tech Teams",
      "Flexible ESOP Liquidity Events",
      "Top-tier Medical Insurance with OPD Benefits",
      "Home Office Ergonomic Budget"
    ],
    verified: true,
    rating: 4.7,
    reviews_count: 610
  }
];

export const initialJobs = [
  {
    id: "job-101",
    recruiter_id: "u-recruiter-1",
    company_id: "c-stripe",
    title: "Senior Full Stack Engineer - UPI & Global Checkout",
    category: "Software Engineering",
    description: "We are looking for a Senior Full Stack Engineer at Stripe India to architect the next generation of global checkout and UPI payment flows. You will partner with product, design, and infrastructure squads across Bengaluru and San Francisco to build resilient, ultra-fast interfaces and robust backend microservices.",
    responsibilities: [
      "Design, build, and maintain mission-critical checkout web components used by millions of merchants in India and worldwide.",
      "Collaborate with backend platform teams to optimize API response times during massive flash sales and festival volumes.",
      "Champion web performance standards, accessibility (a11y), and rigorous TypeScript typing across front-end codebases.",
      "Participate in on-call rotation and contribute to preventative architectural upgrades."
    ],
    requirements: [
      "5+ years of experience with React, TypeScript, Node.js, and modern CSS architecture.",
      "Deep understanding of distributed systems, RESTful API design, and asynchronous event processing.",
      "Experience with high-scale databases such as PostgreSQL and in-memory caches like Redis.",
      "Strong track record of delivering complex web apps with exceptional UX and sub-second render speeds."
    ],
    skills_required: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Redis", "Docker", "AWS"],
    location: "Bengaluru, Karnataka, India (Remote Open)",
    workplace_type: "Remote",
    job_type: "Full-time",
    experience_level: "Senior Level",
    salary_min: 3200000, // ₹32 LPA
    salary_max: 5200000, // ₹52 LPA
    currency: "INR",
    is_featured: true,
    status: "Active",
    views_count: 1420,
    applicants_count: 28,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "job-102",
    recruiter_id: "u-recruiter-1",
    company_id: "c-google",
    title: "AI & ML Infrastructure Engineer (Search & Cloud)",
    category: "AI / Machine Learning",
    description: "Join Google India's AI & Cloud infrastructure group to build distributed compute engines, GPU cluster orchestrators, and inference pipelines powering frontier AI models and Search rankings.",
    responsibilities: [
      "Scale distributed training and inference clusters across tens of thousands of GPUs/TPUs with high reliability.",
      "Optimize model inference latencies through kernel-level optimization, batching, and caching algorithms.",
      "Collaborate with research scientists to deploy novel architectures into high-availability production environments."
    ],
    requirements: [
      "Strong proficiency in Python, C++, PyTorch, and distributed computing frameworks (Kubernetes, Ray, Slurm).",
      "Experience with high-throughput network architectures, CUDA optimization, and cloud GPU clusters.",
      "Solid foundation in data structures, concurrency, and Linux systems internals."
    ],
    skills_required: ["Python", "PyTorch", "Docker", "Kubernetes", "C++", "MLOps", "Distributed Systems"],
    location: "Hyderabad, Telangana, India",
    workplace_type: "Hybrid",
    job_type: "Full-time",
    experience_level: "Senior Level",
    salary_min: 4000000, // ₹40 LPA
    salary_max: 6500000, // ₹65 LPA
    currency: "INR",
    is_featured: true,
    status: "Active",
    views_count: 3200,
    applicants_count: 64,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "job-103",
    recruiter_id: "u-recruiter-1",
    company_id: "c-cred",
    title: "Lead Product Designer (Design Systems & Micro-Interactions)",
    category: "Design & UX",
    description: "CRED is looking for a craftsman Product Designer who obsesses over visual polish, delightful micro-interactions, dark mode ergonomics, and fluid animations for high-net-worth members.",
    responsibilities: [
      "Design intuitive, ultra-responsive UI interfaces for desktop and mobile applications.",
      "Evolve and expand our comprehensive design tokens and React component system in Figma and code.",
      "Conduct user research and translate feedback into streamlined workflows and high-fidelity prototypes."
    ],
    requirements: [
      "4+ years designing high-craft consumer tech apps or fintech platforms.",
      "Mastery of Figma, component libraries, typography, and motion design.",
      "Working knowledge of HTML, CSS, and React to collaborate directly with frontend engineers."
    ],
    skills_required: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research", "CSS"],
    location: "Bengaluru, Karnataka, India",
    workplace_type: "Hybrid",
    job_type: "Full-time",
    experience_level: "Mid Level",
    salary_min: 2400000, // ₹24 LPA
    salary_max: 3800000, // ₹38 LPA
    currency: "INR",
    is_featured: false,
    status: "Active",
    views_count: 980,
    applicants_count: 19,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "job-104",
    recruiter_id: "u-recruiter-1",
    company_id: "c-razorpay",
    title: "Staff Backend Engineer - High-Throughput Payment Gateway",
    category: "Software Engineering",
    description: "Lead the core payment routing engine at Razorpay handling 5,000+ transactions per second during peak festive flash sales with 99.999% uptime and zero payment loss.",
    responsibilities: [
      "Architect and scale microservices handling high-concurrency bank integrations and webhook dispatches.",
      "Benchmark database throughput, optimize PostgreSQL connection pools, and design event streams with Kafka.",
      "Collaborate with security and compliance teams to ensure PCI-DSS standards and ISO certification."
    ],
    requirements: [
      "6+ years experience in backend distributed systems with Node.js, Go, or Java.",
      "Deep expertise in relational databases (PostgreSQL/MySQL), Kafka, and Redis caching.",
      "Proven experience with fintech or high-volume transactional platforms in India."
    ],
    skills_required: ["Node.js", "Go", "PostgreSQL", "Kafka", "Redis", "Docker", "AWS", "Microservices"],
    location: "Bengaluru, Karnataka, India (Hybrid)",
    workplace_type: "Hybrid",
    job_type: "Full-time",
    experience_level: "Lead / Staff",
    salary_min: 4200000, // ₹42 LPA
    salary_max: 6800000, // ₹68 LPA
    currency: "INR",
    is_featured: true,
    status: "Active",
    views_count: 2150,
    applicants_count: 42,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "job-105",
    recruiter_id: "u-recruiter-1",
    company_id: "c-microsoft",
    title: "Senior DevOps & Cloud Reliability Engineer (Azure IDC)",
    category: "DevOps & Cloud",
    description: "Join Microsoft IDC to architect multi-region Kubernetes clusters, automated chaos engineering, and telemetry pipelines for enterprise Azure infrastructure.",
    responsibilities: [
      "Architect and scale multi-region Kubernetes clusters handling petabytes of cloud workloads.",
      "Build automated alerting, tracing, and distributed telemetry pipelines with Prometheus & Azure Monitor.",
      "Drive disaster recovery simulations and collaborate with squads to guarantee five-nines uptime."
    ],
    requirements: [
      "5+ years in SRE/DevOps roles with production Kubernetes, Terraform, and Azure/AWS.",
      "Proficiency in Python, Go, or Bash for robust infrastructure automation.",
      "Proven experience resolving high-severity production incidents in distributed environments."
    ],
    skills_required: ["Kubernetes", "Docker", "Terraform", "AWS", "Python", "CI/CD", "Prometheus"],
    location: "Hyderabad, Telangana & Noida, India",
    workplace_type: "Hybrid",
    job_type: "Full-time",
    experience_level: "Senior Level",
    salary_min: 3000000, // ₹30 LPA
    salary_max: 4800000, // ₹48 LPA
    currency: "INR",
    is_featured: false,
    status: "Active",
    views_count: 1120,
    applicants_count: 22,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "job-106",
    recruiter_id: "u-recruiter-1",
    company_id: "c-swiggy",
    title: "Lead Product Manager - Hyperlocal Delivery & AI Logistics",
    category: "Product Management",
    description: "Shape the future of quick-commerce delivery at Swiggy. Lead cross-functional squads across engineering, data science, and operations to optimize delivery partner batching, dynamic pricing, and warehouse fulfillment.",
    responsibilities: [
      "Define product vision, quarterly roadmap, and key success metrics (delivery speed, retention, NPS).",
      "Drive A/B experimentation at scale across 500+ Indian cities, synthesizing quantitative metrics and qualitative user interviews.",
      "Communicate progress and strategic shifts to executive leadership."
    ],
    requirements: [
      "6+ years of Product Management experience in high-growth marketplace, quick-commerce, or consumer tech in India.",
      "Analytical mindset with strong SQL fluency and experimentation rigor.",
      "Exceptional storytelling, user empathy, and cross-functional leadership skills."
    ],
    skills_required: ["Product Strategy", "A/B Testing", "SQL", "Marketplace Economics", "Agile", "User Research"],
    location: "Bengaluru, Karnataka / Pune / Remote (India)",
    workplace_type: "Remote",
    job_type: "Full-time",
    experience_level: "Lead / Staff",
    salary_min: 3500000, // ₹35 LPA
    salary_max: 5500000, // ₹55 LPA
    currency: "INR",
    is_featured: true,
    status: "Active",
    views_count: 1840,
    applicants_count: 35,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "job-107",
    recruiter_id: "u-recruiter-1",
    company_id: "c-razorpay",
    title: "Frontend Architect - React, TypeScript & Web Performance",
    category: "Software Engineering",
    description: "Elevate the frontend engineering standards across Razorpay's suite of merchant dashboards and developer portals.",
    responsibilities: [
      "Lead frontend architecture, build systems, micro-frontends, and automated bundle optimizations.",
      "Maintain our unified UI design token library and accessibility standards.",
      "Mentor senior and staff frontend engineers across multiple squads."
    ],
    requirements: [
      "7+ years experience in React, TypeScript, Next.js, Webpack/Vite, and modern web performance optimization.",
      "Deep understanding of browser rendering pipelines, Core Web Vitals, and state architecture.",
      "Strong leadership and architectural RFC writing skills."
    ],
    skills_required: ["React", "TypeScript", "Next.js", "TailwindCSS", "Web Performance", "Architecture", "CI/CD"],
    location: "Mumbai, Maharashtra / Bengaluru, India",
    workplace_type: "Hybrid",
    job_type: "Full-time",
    experience_level: "Lead / Staff",
    salary_min: 3800000, // ₹38 LPA
    salary_max: 6000000, // ₹60 LPA
    currency: "INR",
    is_featured: true,
    status: "Active",
    views_count: 1650,
    applicants_count: 31,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "job-108",
    recruiter_id: "u-recruiter-1",
    company_id: "c-google",
    title: "Senior Data Scientist - GenAI & Predictive Modeling",
    category: "Data Science",
    description: "Design machine learning and predictive ranking models to personalize merchant and user journeys across Google India platforms.",
    responsibilities: [
      "Develop and deploy advanced machine learning algorithms, causal inference, and neural ranking models.",
      "Partner with engineering teams to productionize models using BigQuery, TensorFlow, and Vertex AI.",
      "Conduct offline evaluations and live online A/B testing on billions of user queries."
    ],
    requirements: [
      "4+ years experience in applied data science, statistical modeling, and machine learning.",
      "Mastery of Python, SQL, Pandas, Scikit-Learn, and deep learning frameworks (TensorFlow / PyTorch).",
      "Degree in Computer Science, Statistics, Mathematics, or equivalent."
    ],
    skills_required: ["Python", "Machine Learning", "SQL", "Pandas", "PyTorch", "BigQuery", "A/B Testing"],
    location: "Gurgaon, Haryana / Bengaluru, India",
    workplace_type: "Hybrid",
    job_type: "Full-time",
    experience_level: "Senior Level",
    salary_min: 3200000, // ₹32 LPA
    salary_max: 5000000, // ₹50 LPA
    currency: "INR",
    is_featured: false,
    status: "Active",
    views_count: 890,
    applicants_count: 24,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialApplications = [
  {
    id: "app-1",
    job_id: "job-101",
    applicant_id: "u-seeker-1",
    resume_url: "https://example.com/resumes/sarah_resume.pdf",
    resume_text: "Senior Full Stack Engineer with 6+ years in React, TypeScript, Node.js, PostgreSQL, and AWS in Bengaluru...",
    cover_letter: "Dear Hiring Team at Stripe India,\n\nI am thrilled to apply for the Senior Full Stack Engineer position in Bengaluru. With over 6 years building high-throughput payment checkout surfaces at Razorpay and Flipkart, I have long admired Stripe's developer craftsmanship. My experience reducing latency by 42% and architecting robust TypeScript design systems directly aligns with the mission of this role.\n\nThank you for your consideration,\nSarah Jenkins",
    match_score: 94,
    ai_analysis: {
      overall_fit: "Exceptional Match",
      score: 94,
      strengths: [
        "Extensive 6+ years experience in React, TypeScript, and Node.js in Indian tech",
        "Direct experience with high-scale payments and microservice architecture",
        "Strong track record in latency optimization and performance engineering"
      ],
      missing_skills: ["GraphQL (Minor)"],
      recommendations: "Highlight specific payment gateway integration experience and UPI standards in the interview."
    },
    status: "Interviewing",
    recruiter_notes: "Strong candidate with impressive background in scaling distributed frontends in Bengaluru. Scheduled technical screen for upcoming Tuesday.",
    interview_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "app-2",
    job_id: "job-104",
    applicant_id: "u-seeker-1",
    resume_url: "https://example.com/resumes/sarah_resume.pdf",
    cover_letter: "Dear Razorpay Team,\n\nAs an experienced builder in backend systems and fintech architecture in Bengaluru, I am passionate about advancing payment reliability for millions of Indian merchants. My deep familiarity with Node.js, PostgreSQL, and Redis makes this an ideal next step in my career.\n\nBest regards,\nSarah Jenkins",
    match_score: 91,
    ai_analysis: {
      overall_fit: "High Match",
      score: 91,
      strengths: [
        "Deep familiarity with Node.js, PostgreSQL, and microservices",
        "Proven expertise in high-concurrency payment platforms"
      ],
      missing_skills: ["Go (Optional)"],
      recommendations: "Demonstrate high throughput scale and query tuning examples in technical discussions."
    },
    status: "Under Review",
    recruiter_notes: "Resume passed initial ATS screening with 91% match. Forwarded to hiring manager.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialSavedJobs = [
  {
    id: "saved-1",
    user_id: "u-seeker-1",
    job_id: "job-102",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "saved-2",
    user_id: "u-seeker-1",
    job_id: "job-104",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    user_id: "u-seeker-1",
    title: "Interview Scheduled! 🎉",
    message: "Stripe India (Bengaluru) has scheduled your Technical Interview for Senior Full Stack Engineer on Tuesday at 2:00 PM IST.",
    type: "success",
    read: false,
    link: "/applications",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif-2",
    user_id: "u-seeker-1",
    title: "Application Received",
    message: "Your application for Staff Backend Engineer at Razorpay (Bengaluru) is currently Under Review.",
    type: "info",
    read: true,
    link: "/applications",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif-3",
    user_id: "u-recruiter-1",
    title: "New Application Received",
    message: "Sarah Jenkins applied for Senior Full Stack Engineer - UPI & Global Checkout with 94% AI Match Score.",
    type: "info",
    read: false,
    link: "/recruiter/jobs/job-101",
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];
