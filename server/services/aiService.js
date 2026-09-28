// AI Service for Resume ATS Analysis, Job Matching, AI Job Description & Cover Letter Generation

const TECH_SKILLS_TAXONOMY = {
  frontend: ["React", "TypeScript", "JavaScript", "Vue.js", "Angular", "Next.js", "HTML5", "CSS3", "TailwindCSS", "Redux", "GraphQL", "Vite", "Webpack", "Sass"],
  backend: ["Node.js", "Express.js", "NestJS", "Python", "Django", "FastAPI", "Go", "Java", "Spring Boot", "C#", ".NET", "Ruby on Rails", "Rust", "PHP"],
  database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Supabase", "DynamoDB", "Prisma", "Elasticsearch", "Cassandra", "SQL Server"],
  cloud_devops: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Google Cloud", "Azure", "GitHub Actions", "Prometheus", "Datadog", "Linux", "Nginx"],
  ai_data: ["Machine Learning", "PyTorch", "TensorFlow", "LangChain", "OpenAI", "Pandas", "NumPy", "Scikit-Learn", "Computer Vision", "NLP", "LLMs", "Vector Databases", "MLOps", "RAG"],
  design_product: ["Figma", "UI/UX Design", "Prototyping", "Design Systems", "User Research", "Wireframing", "Product Strategy", "A/B Testing", "Agile", "Scrum"]
};

const ACTION_VERBS = [
  "architected", "developed", "spearheaded", "engineered", "optimized",
  "deployed", "designed", "implemented", "scaled", "decreased",
  "increased", "mentored", "orchestrated", "transformed", "streamlined"
];

export const aiService = {
  /**
   * Analyze a resume against ATS standards and extract skills, score, strengths, and improvements
   */
  analyzeResume: async (resumeText, targetCategory = 'Software Engineering') => {
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error('Resume text is too short. Please provide a detailed resume or CV.');
    }

    const lower = resumeText.toLowerCase();

    // 1. Extract matched skills
    const detectedSkills = [];
    Object.values(TECH_SKILLS_TAXONOMY).flat().forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(resumeText)) {
        if (!detectedSkills.includes(skill)) {
          detectedSkills.push(skill);
        }
      }
    });

    // 2. Action verbs & metrics analysis
    const verbHits = ACTION_VERBS.filter(verb => lower.includes(verb));
    const metricHits = (resumeText.match(/(\d+[%kM$+]|\d+\+?\s*(years|users|revenue|reduction|increase|faster|queries))/gi) || []).length;
    const hasEducation = /(bachelor|master|b\.s\.|m\.s\.|phd|degree|university|college|gpa)/i.test(resumeText);
    const hasExperience = /(experience|employment|work history|career|present|20\d\d)/i.test(resumeText);
    const hasContact = /(@|\+?\d{3}[-.]?\d{3}[-.]?\d{4}|linkedin\.com|github\.com)/i.test(resumeText);

    // 3. Compute ATS breakdown scores
    let skillScore = Math.min(100, Math.round((detectedSkills.length / 10) * 100));
    let impactScore = Math.min(100, Math.round((verbHits.length * 8) + (metricHits * 12)));
    let formatScore = (hasEducation ? 25 : 10) + (hasExperience ? 35 : 15) + (hasContact ? 25 : 10) + (resumeText.length > 500 ? 15 : 5);
    
    // Aggregate overall ATS Score (0 - 100)
    let overallAtsScore = Math.min(98, Math.max(45, Math.round((skillScore * 0.4) + (impactScore * 0.35) + (formatScore * 0.25))));

    // 4. Missing recommended keywords based on category
    let categoryKey = 'frontend';
    if (targetCategory.includes('AI') || targetCategory.includes('Machine')) categoryKey = 'ai_data';
    else if (targetCategory.includes('DevOps') || targetCategory.includes('Cloud')) categoryKey = 'cloud_devops';
    else if (targetCategory.includes('Design') || targetCategory.includes('Product')) categoryKey = 'design_product';
    else if (targetCategory.includes('Full') || targetCategory.includes('Backend')) categoryKey = 'backend';

    const categoryKeywords = TECH_SKILLS_TAXONOMY[categoryKey] || TECH_SKILLS_TAXONOMY.frontend;
    const missingKeywords = categoryKeywords.filter(k => !detectedSkills.includes(k)).slice(0, 5);

    // 5. Strengths
    const strengths = [];
    if (detectedSkills.length >= 8) strengths.push(`Strong technical breadth with ${detectedSkills.length} verified modern skills.`);
    if (metricHits >= 3) strengths.push("Excellent use of quantifiable metrics, KPIs, and business impact results.");
    if (verbHits.length >= 4) strengths.push("Strong active leadership verbs indicating proactive ownership.");
    if (hasContact) strengths.push("Clear contact credentials including portfolio / LinkedIn links.");
    if (strengths.length === 0) strengths.push("Good foundation with clear chronological work progression.");

    // 6. Actionable recommendations
    const recommendations = [];
    if (metricHits < 3) {
      recommendations.push("Quantify your achievements: Add specific % reductions in latency, user growth numbers, or revenue impact.");
    }
    if (missingKeywords.length > 0) {
      recommendations.push(`Target industry keywords: Consider adding relevant skills such as ${missingKeywords.join(', ')} if experienced.`);
    }
    if (verbHits.length < 3) {
      recommendations.push("Begin bullet points with strong action verbs (e.g., 'Architected', 'Spearheaded', 'Optimized').");
    }
    if (!lower.includes("github") && !lower.includes("portfolio")) {
      recommendations.push("Include a link to your GitHub or live portfolio to demonstrate code craft.");
    }
    recommendations.push("Ensure your section headings (Experience, Skills, Education) follow standard ATS-friendly naming.");

    return {
      ats_score: overallAtsScore,
      rating: overallAtsScore >= 88 ? 'Excellent' : overallAtsScore >= 75 ? 'Good' : 'Needs Optimization',
      summary: `Your resume demonstrates a ${overallAtsScore >= 80 ? 'strong' : 'promising'} profile for ${targetCategory} roles with ${detectedSkills.length} detected core proficiencies.`,
      detected_skills: detectedSkills,
      missing_skills: missingKeywords,
      strengths,
      recommendations,
      breakdown: {
        skills_diversity: skillScore,
        quantifiable_impact: impactScore,
        ats_formatting: formatScore
      }
    };
  },

  /**
   * Compare candidate resume/skills against a specific job posting
   */
  scoreJobMatch: (candidateSkills = [], resumeText = '', job) => {
    if (!job) return { score: 70, rating: 'Moderate Match', matched_skills: [], missing_skills: [] };

    const requiredSkills = job.skills_required || [];
    const lowerResume = (resumeText || '').toLowerCase();
    
    // Normalize candidate skills
    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());

    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(req => {
      const reqLower = req.toLowerCase();
      const inSkills = candidateSkillsLower.some(s => s === reqLower || s.includes(reqLower) || reqLower.includes(s));
      const inText = lowerResume.includes(reqLower);

      if (inSkills || inText) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    const skillRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0.8;
    
    // Base match score calculation
    let calculatedScore = Math.round(skillRatio * 80 + 15);
    calculatedScore = Math.min(98, Math.max(45, calculatedScore));

    let rating = 'Moderate Match';
    if (calculatedScore >= 88) rating = 'Exceptional Match';
    else if (calculatedScore >= 75) rating = 'Strong Contender';
    else if (calculatedScore < 60) rating = 'Skill Gap Detected';

    return {
      score: calculatedScore,
      rating,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      match_ratio: `${matchedSkills.length}/${requiredSkills.length} Required Skills`,
      verdict: calculatedScore >= 80 
        ? `You match ${matchedSkills.length} out of ${requiredSkills.length} key requirements for this position at ${job.company?.name || 'the company'}.`
        : `To maximize chances, consider highlighting experience in: ${missingSkills.slice(0, 3).join(', ')}.`
    };
  },

  /**
   * Generate a professional AI Cover Letter
   */
  generateCoverLetter: async ({ candidateName, candidateSkills, candidateBio, jobTitle, companyName, jobRequirements }) => {
    const skillsList = (candidateSkills || []).slice(0, 5).join(', ');
    
    return `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${jobTitle} role at ${companyName || 'your esteemed company'}. Having closely followed ${companyName}'s innovation in the industry, I am eager to bring my expertise and dedication to your high-performing team.

Throughout my software career, I have specialized in designing robust, scalable architectures and delivering seamless digital experiences. My technical toolkit includes ${skillsList || 'modern software engineering principles, distributed systems, and clean code practices'}. ${candidateBio ? `Specifically, ${candidateBio.slice(0, 180)}...` : 'I pride myself on translating complex product requirements into reliable, maintainable codebases.'}

This position resonates strongly with my experience because of the emphasis on solving demanding engineering challenges and driving measurable user impact. I am particularly excited by the prospect of contributing to ${companyName}'s engineering culture and collaborating closely with your cross-functional squads.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my background, technical skill set, and passion for excellence will add immediate value to ${companyName}.

Warm regards,

${candidateName || 'Applicant'}`;
  },

  /**
   * Generate an AI-powered Job Description for Recruiters
   */
  generateJobDescription: async ({ title, category, experienceLevel, workplaceType, keyBullets = [] }) => {
    const bullets = Array.isArray(keyBullets) ? keyBullets : [keyBullets];

    return {
      description: `We are looking for a talented and visionary ${title} (${experienceLevel}) to join our growing team. In this role, you will play a pivotal part in shaping our core product offerings, collaborating across engineering and design, and driving technical excellence across our ${workplaceType.toLowerCase()} team.`,
      responsibilities: [
        `Architect, develop, and maintain high-performance scalable systems supporting ${title} initiatives.`,
        "Collaborate closely with product management, UX designers, and stakeholders to deliver delightful customer experiences.",
        "Ensure code quality, test coverage, and reliability through rigorous code reviews and modern CI/CD practices.",
        "Identify system bottlenecks and implement preventative performance and security enhancements."
      ],
      requirements: [
        `${experienceLevel === 'Entry Level' ? '1-2 years' : experienceLevel === 'Mid Level' ? '3-5 years' : '5+ years'} of proven track record in relevant software and technology domains.`,
        "Demonstrated ability to write clean, modular, and maintainable code with modern frameworks and tooling.",
        "Solid understanding of database systems, API design, and asynchronous distributed architectures.",
        "Excellent communication skills and enthusiasm for working in a fast-paced, collaborative environment."
      ],
      skills_required: bullets.length > 0 && bullets[0] ? bullets : ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "AWS", "Docker"]
    };
  },

  /**
   * Recommend jobs based on candidate profile skills and preferences
   */
  recommendJobs: (profile, jobs = []) => {
    if (!profile) return jobs.slice(0, 6);

    const userSkills = (profile.skills || []).map(s => s.toLowerCase());

    const scoredJobs = jobs.map(job => {
      let score = 50; // base score
      const jobSkills = (job.skills_required || []).map(s => s.toLowerCase());
      
      // Calculate skill matches
      const matched = jobSkills.filter(s => userSkills.some(us => us === s || us.includes(s) || s.includes(us)));
      const skillMatchBonus = jobSkills.length > 0 ? (matched.length / jobSkills.length) * 40 : 20;
      score += skillMatchBonus;

      // Remote preference bonus
      if (profile.preferences?.remote && (job.workplace_type === 'Remote' || job.workplace_type === 'Hybrid')) {
        score += 8;
      }

      // Expected salary match
      if (profile.preferences?.expected_salary && job.salary_max >= profile.preferences.expected_salary) {
        score += 5;
      }

      const finalScore = Math.min(98, Math.max(50, Math.round(score)));

      return {
        ...job,
        ai_recommendation: {
          match_score: finalScore,
          matched_skills: matched,
          reason: finalScore >= 85 
            ? `Matches ${matched.length} of your skills including ${matched.slice(0, 3).join(', ')}`
            : `Aligns with your profile preferences and background.`
        }
      };
    });

    // Sort by recommendation score descending
    return scoredJobs.sort((a, b) => (b.ai_recommendation?.match_score || 0) - (a.ai_recommendation?.match_score || 0));
  }
};
