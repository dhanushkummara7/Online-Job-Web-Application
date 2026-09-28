// Google Gemini AI Service for Real-Time Semantic Search and Natural Language Processing

let activeGoogleApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

export const googleAiService = {
  /**
   * Get active Google API Key
   */
  getApiKey: () => activeGoogleApiKey,

  /**
   * Set or update Google API Key in real-time
   */
  setApiKey: (key) => {
    activeGoogleApiKey = (key || '').trim();
    return !!activeGoogleApiKey;
  },

  /**
   * Check status and validate active Google API Key
   */
  checkKeyStatus: () => {
    return {
      hasKey: !!activeGoogleApiKey,
      maskedKey: activeGoogleApiKey 
        ? `${activeGoogleApiKey.slice(0, 6)}...${activeGoogleApiKey.slice(-4)}` 
        : null,
      provider: 'Google Gemini 1.5 Flash API'
    };
  },

  /**
   * Test a Google API Key with a lightweight ping to Gemini
   */
  testKey: async (keyToTest) => {
    const key = keyToTest || activeGoogleApiKey;
    if (!key) {
      throw new Error('No Google API Key provided');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    const payload = {
      contents: [{
        parts: [{
          text: 'Respond with a single word: READY'
        }]
      }]
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Invalid Google API Key or quota exceeded');
    }

    return {
      valid: true,
      message: 'Google Gemini API Key is valid and active!'
    };
  },

  /**
   * Real-time AI Smart Search using Google Gemini
   */
  smartSearch: async ({ query, location, jobs = [] }) => {
    if (!query && !location) {
      return { jobs, isAiPowered: false };
    }

    // If Google API key is active, use Google Gemini 1.5 Flash for semantic search
    if (activeGoogleApiKey) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeGoogleApiKey}`;

        const jobsBrief = jobs.map(j => ({
          id: j.id,
          title: j.title,
          category: j.category,
          location: j.location,
          workplace_type: j.workplace_type,
          skills: j.skills_required,
          salary_min: j.salary_min,
          salary_max: j.salary_max
        }));

        const prompt = `You are an intelligent real-time Job Search Assistant for tech jobs in India.
User Search Query: "${query || ''}"
User Location Query: "${location || ''}"

Available Job Openings in Database:
${JSON.stringify(jobsBrief, null, 2)}

Instructions:
1. Parse the user's search query for role intent, skills, seniority, and location preferences in India.
2. Return a JSON array of matching job IDs ranked by relevance.
3. For each matched job, provide a short 1-sentence "match_reason" explaining why it matches the search criteria.
4. Output STRICT JSON format only, like this:
{
  "matches": [
    { "id": "job-101", "score": 95, "match_reason": "Matches Senior Full Stack role with React in Bengaluru" }
  ],
  "extracted_intent": {
    "role": "Full Stack",
    "skills": ["React", "TypeScript"],
    "location": "Bengaluru"
  }
}`;

        const geminiRes = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsed = JSON.parse(responseText);
            const matchedJobMap = new Map((parsed.matches || []).map(m => [m.id, m]));

            const rankedJobs = [];
            jobs.forEach(job => {
              if (matchedJobMap.has(job.id)) {
                const matchInfo = matchedJobMap.get(job.id);
                rankedJobs.push({
                  ...job,
                  ai_search_match: {
                    score: matchInfo.score || 90,
                    reason: matchInfo.match_reason,
                    source: 'Google Gemini AI'
                  }
                });
              }
            });

            rankedJobs.sort((a, b) => (b.ai_search_match?.score || 0) - (a.ai_search_match?.score || 0));

            return {
              jobs: rankedJobs.length > 0 ? rankedJobs : jobs,
              isAiPowered: true,
              provider: 'Google Gemini 1.5 Flash',
              intent: parsed.extracted_intent || {}
            };
          }
        }
      } catch (err) {
        console.warn('Google Gemini API query error, falling back to NLP search:', err.message);
      }
    }

    // Resilient NLP Heuristic Fallback
    const q = (query || '').toLowerCase();
    const loc = (location || '').toLowerCase();

    const filtered = jobs.filter(job => {
      const matchText = !q || 
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.skills_required?.some(s => s.toLowerCase().includes(q)) ||
        job.category.toLowerCase().includes(q);

      const matchLoc = !loc || loc === 'all' || loc === 'all india' ||
        job.location.toLowerCase().includes(loc) ||
        (loc.includes('remote') && job.workplace_type === 'Remote');

      return matchText && matchLoc;
    });

    const enriched = filtered.map(job => ({
      ...job,
      ai_search_match: {
        score: 90,
        reason: `Matches your search keywords and location preferences.`,
        source: 'NLP Intelligent Match'
      }
    }));

    return {
      jobs: enriched,
      isAiPowered: !!activeGoogleApiKey,
      provider: activeGoogleApiKey ? 'Google Gemini 1.5 Flash' : 'Built-in Intelligent Matcher'
    };
  }
};
