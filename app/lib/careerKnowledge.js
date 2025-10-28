// app/lib/careerKnowledge.js - CREATE THIS NEW FILE
// Comprehensive career knowledge base for accurate chatbot responses

export const careerKnowledgeBase = {
  // JOB MARKET DATA (Updated Oct 2025)
  jobMarketTrends: {
    "Software Developer": {
      demandLevel: "Very High",
      avgSalary: {
        "Singapore": "SGD 80,000 - 150,000",
        "Malaysia": "MYR 60,000 - 120,000",
        "United States": "USD 95,000 - 180,000",
        "United Kingdom": "GBP 45,000 - 85,000"
      },
      growthRate: "22% (2024-2034)",
      topSkills2025: ["TypeScript", "React", "Python", "AWS", "Docker", "Kubernetes"],
      topCompanies: ["Google", "Microsoft", "Meta", "Amazon", "Apple"],
      entryBarrier: "Medium - Need strong portfolio + technical skills"
    },
    "Data Scientist": {
      demandLevel: "Very High",
      avgSalary: {
        "Singapore": "SGD 100,000 - 180,000",
        "Malaysia": "MYR 80,000 - 150,000",
        "United States": "USD 120,000 - 200,000",
        "United Kingdom": "GBP 55,000 - 95,000"
      },
      growthRate: "36% (2024-2034)",
      topSkills2025: ["Python", "SQL", "Machine Learning", "Statistics", "Tableau", "PyTorch"],
      topCompanies: ["Google", "Meta", "Amazon", "Microsoft", "Netflix"],
      entryBarrier: "High - Need advanced degree or strong portfolio"
    },
    "UX/UI Designer": {
      demandLevel: "High",
      avgSalary: {
        "Singapore": "SGD 65,000 - 120,000",
        "Malaysia": "MYR 50,000 - 100,000",
        "United States": "USD 85,000 - 140,000",
        "United Kingdom": "GBP 40,000 - 75,000"
      },
      growthRate: "16% (2024-2034)",
      topSkills2025: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
      topCompanies: ["Apple", "Google", "Meta", "Airbnb", "Shopify"],
      entryBarrier: "Medium - Need strong portfolio"
    }
    // Add more as needed...
  },

  // LEARNING RESOURCES
  learningPaths: {
    "Software Developer": {
      month1: {
        focus: "Programming Fundamentals",
        freeResources: [
          "freeCodeCamp.org - Full JavaScript course",
          "The Odin Project - Complete web dev path",
          "CS50 by Harvard (edX) - Computer Science fundamentals",
          "JavaScript.info - Comprehensive JS guide"
        ],
        practice: ["LeetCode Easy problems", "Build a todo app", "Create a calculator"],
        timeCommitment: "15-20 hours/week"
      },
      month2: {
        focus: "Frontend Frameworks",
        freeResources: [
          "React Official Docs Tutorial",
          "Scrimba - Learn React for Free",
          "Next.js Tutorial",
          "Tailwind CSS Documentation"
        ],
        practice: ["Build portfolio website", "Create weather app", "Recipe finder app"]
      }
    }
  },

  // INTERVIEW TIPS
  interviewGuides: {
    "Software Developer": {
      technical: [
        "Master data structures: Arrays, Linked Lists, Trees, Graphs",
        "Practice 50+ LeetCode problems (focus on Easy/Medium)",
        "Understand Big O notation and algorithm complexity",
        "Know system design basics (for senior roles)",
        "Be ready to code on whiteboard or screen share"
      ],
      behavioral: [
        "Prepare STAR method stories (Situation, Task, Action, Result)",
        "Have 3-4 project examples ready to discuss in detail",
        "Research the company's tech stack and products",
        "Prepare questions to ask the interviewer",
        "Practice explaining technical concepts simply"
      ],
      commonQuestions: [
        "Tell me about a challenging bug you fixed",
        "How do you handle disagreements in code reviews?",
        "Describe your development workflow",
        "What's your favorite programming language and why?",
        "How do you stay updated with new technologies?"
      ]
    }
  },

  // COMPANY INSIGHTS
  companyInfo: {
    "Google": {
      hiringFor: ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer"],
      culture: "Innovation-focused, data-driven, collaborative",
      interviewProcess: "5-6 rounds: Phone screen → Technical (2-3) → Behavioral → Team fit",
      whatTheyLookFor: "Strong algorithms, system design, cultural fit, growth mindset",
      tips: "Focus on LeetCode Hard problems, know Google products well, emphasize impact"
    },
    "Microsoft": {
      hiringFor: ["Software Engineer", "Cloud Engineer", "PM", "Data Engineer"],
      culture: "Growth mindset, inclusive, customer-focused",
      interviewProcess: "4-5 rounds: Recruiter → Technical (2) → Behavioral → Final",
      whatTheyLookFor: "Problem-solving, collaboration, technical depth",
      tips: "Know Azure basics, prepare for coding + system design, show teamwork"
    }
  },

  // PORTFOLIO PROJECT IDEAS
  portfolioProjects: {
    beginner: [
      {
        name: "Personal Portfolio Website",
        skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
        impact: "Shows design sense and basic web skills",
        time: "1-2 weeks"
      },
      {
        name: "Todo List App",
        skills: ["React", "State Management", "CRUD Operations"],
        impact: "Demonstrates frontend framework knowledge",
        time: "1-2 weeks"
      }
    ],
    intermediate: [
      {
        name: "Full-Stack Blog Platform",
        skills: ["React", "Node.js", "MongoDB", "Authentication"],
        impact: "Shows full-stack capability end-to-end",
        time: "3-4 weeks"
      },
      {
        name: "Real-time Chat Application",
        skills: ["WebSockets", "React", "Node.js", "Database"],
        impact: "Demonstrates real-time systems knowledge",
        time: "4-6 weeks"
      }
    ],
    advanced: [
      {
        name: "E-commerce Platform",
        skills: ["Microservices", "Payment Integration", "AWS", "Security"],
        impact: "Shows production-ready development skills",
        time: "6-8 weeks"
      }
    ]
  },

  // SKILL DIFFICULTY & LEARNING TIME
  skillLearning: {
    "JavaScript": { difficulty: "Medium", timeToBasic: "2-3 months", timeToAdvanced: "12+ months" },
    "Python": { difficulty: "Easy", timeToBasic: "1-2 months", timeToAdvanced: "8-12 months" },
    "React": { difficulty: "Medium", timeToBasic: "1-2 months", timeToAdvanced: "6-8 months" },
    "AWS": { difficulty: "Hard", timeToBasic: "2-3 months", timeToAdvanced: "12+ months" },
    "Machine Learning": { difficulty: "Hard", timeToBasic: "3-4 months", timeToAdvanced: "18+ months" },
    "Docker": { difficulty: "Medium", timeToBasic: "2-4 weeks", timeToAdvanced: "3-4 months" }
  },

  // JOB SEARCH STRATEGIES
  jobSearchStrategies: {
    networking: [
      "Join LinkedIn groups for your target role",
      "Attend tech meetups and conferences",
      "Connect with alumni from your university",
      "Engage with content from companies you want to join",
      "Cold message people for informational interviews (20% response rate)"
    ],
    application: [
      "Tailor resume for each job (use exact keywords from JD)",
      "Apply within first 48 hours of posting (4x higher response)",
      "Follow up 1 week after applying",
      "Apply to 10-15 jobs per week minimum",
      "Use referrals when possible (5x higher chance)"
    ],
    preparation: [
      "Research company for 30+ minutes before interview",
      "Prepare 5-6 STAR stories",
      "Practice out loud (not just in your head)",
      "Do mock interviews with friends/platforms",
      "Prepare thoughtful questions to ask"
    ]
  }
};

export async function POST(request) {
  try {
    const { messages, userMessage, context } = await request.json();

    console.log('💬 Chat request:', userMessage);

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // Extract key info from context
    const targetRole = context?.match(/Target Role: ([^\n]+)/)?.[1] || 'your role';
    const location = context?.match(/Location: ([^\n]+)/)?.[1] || '';

    // Check if we have knowledge base data for this query
    let knowledgeContext = '';
    
    // Add relevant knowledge base info
    if (userMessage.toLowerCase().includes('salary') || userMessage.toLowerCase().includes('pay')) {
      const roleData = careerKnowledgeBase.jobMarketTrends[targetRole];
      if (roleData && location) {
        knowledgeContext += `\nSALARY DATA: ${targetRole} in ${location}: ${roleData.avgSalary[location] || 'Data not available for this location'}`;
      }
    }

    if (userMessage.toLowerCase().includes('skill') || userMessage.toLowerCase().includes('learn')) {
      const roleData = careerKnowledgeBase.jobMarketTrends[targetRole];
      if (roleData) {
        knowledgeContext += `\nTOP SKILLS FOR ${targetRole} (2025): ${roleData.topSkills2025.join(', ')}`;
      }
    }

    if (userMessage.toLowerCase().includes('company') || userMessage.toLowerCase().includes('where')) {
      const roleData = careerKnowledgeBase.jobMarketTrends[targetRole];
      if (roleData) {
        knowledgeContext += `\nTOP COMPANIES HIRING ${targetRole}: ${roleData.topCompanies.join(', ')}`;
      }
    }

    if (userMessage.toLowerCase().includes('interview')) {
      const interviewData = careerKnowledgeBase.interviewGuides[targetRole];
      if (interviewData) {
        knowledgeContext += `\nINTERVIEW TIPS FOR ${targetRole}:\n`;
        knowledgeContext += `Technical: ${interviewData.technical.slice(0, 3).join('; ')}\n`;
        knowledgeContext += `Behavioral: ${interviewData.behavioral.slice(0, 2).join('; ')}`;
      }
    }

    if (userMessage.toLowerCase().includes('project') || userMessage.toLowerCase().includes('portfolio')) {
      knowledgeContext += `\nPORTFOLIO PROJECT IDEAS:\n`;
      knowledgeContext += `Beginner: ${careerKnowledgeBase.portfolioProjects.beginner[0].name}\n`;
      knowledgeContext += `Intermediate: ${careerKnowledgeBase.portfolioProjects.intermediate[0].name}\n`;
      knowledgeContext += `Advanced: ${careerKnowledgeBase.portfolioProjects.advanced[0].name}`;
    }

    // Create comprehensive system prompt
    const enhancedSystemPrompt = `You are an expert AI career counselor with access to current job market data and industry insights.

${context ? `USER'S PERSONALIZED ROADMAP:\n${context}` : ''}

${knowledgeContext ? `VERIFIED CAREER DATA:\n${knowledgeContext}` : ''}

Guidelines:
- Provide specific, actionable career advice
- Reference the user's roadmap details when relevant
- Use data from the knowledge base when available
- Be encouraging and motivating
- Keep responses concise (3-5 sentences) unless detailed explanation requested
- Use bullet points for lists
- Add 1-2 relevant emojis

Response format:
- Start with direct answer
- Provide 2-3 specific tips or resources
- End with encouraging note or next step

Keep under 150 words unless user specifically asks for detailed explanation.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: enhancedSystemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;

    console.log('✅ Chat response generated with knowledge base');

    return Response.json({
      message: aiResponse,
      success: true,
      usedKnowledgeBase: knowledgeContext.length > 0
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    
    return Response.json(
      { 
        error: 'Failed to generate response',
        message: "I'm having trouble right now. Please try again in a moment."
      },
      { status: 500 }
    );
  }
}