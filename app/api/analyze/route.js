// app/api/analyze/route.js - UPDATED to handle comprehensive assessment

import Groq from "groq-sdk";
import { 
  fetchAllJobs, 
  getJobBoardsByCountry, 
  generateJobSearchLinks, 
  getCompanyJobListings 
} from '../../lib/jobAPIs';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Extract all fields (supports both old and new form)
    const {
      // Basic
      country,
      university,
      educationLevel,
      course,
      graduationDate,
      gpa,
      
      // Skills
      currentSkills,
      technicalSkills,
      softSkills,
      certifications,
      
      // Experience
      projects,
      internships,
      experience,
      currentlyEmployed,
      
      // Career Goals
      targetRole,
      alternativeRoles,
      careerMotivation,
      timeline,
      jobSearchStatus,
      
      // Preferences
      careerPriorities,
      industryPreferences,
      workEnvironment,
      workStyle,
      companySize,
      willingToRelocate
    } = formData;

    console.log('✅ Form data received:', { country, university, targetRole, timeline });

    // Fetch real job listings
    let liveJobs = [];
    try {
      liveJobs = await fetchAllJobs(targetRole, '', country);
      console.log(`✅ Fetched ${liveJobs.length} live jobs`);
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
    }

    const jobBoards = getJobBoardsByCountry(country);
    const platformSearchLinks = generateJobSearchLinks(targetRole, country);
    const companyJobListings = getCompanyJobListings(targetRole, country);

    if (!process.env.GROQ_API_KEY) {
      console.error('❌ No Groq API key found!');
      return Response.json(
        { success: false, error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // BUILD COMPREHENSIVE PROMPT
    const prompt = `You are an elite career advisor with deep expertise in global job markets, hiring trends, and personalized career development.

**COMPREHENSIVE USER PROFILE:**

Education Background:
- Location: ${country}
- University: ${university}
- Education Level: ${educationLevel}
- Field of Study: ${course}
${graduationDate ? `- Expected Graduation: ${graduationDate}` : ''}
${gpa ? `- Academic Standing: ${gpa}` : ''}

Skills & Experience:
- Technical Skills: ${technicalSkills || currentSkills || 'Not specified'}
- Soft Skills: ${softSkills || 'Not specified'}
- Certifications: ${certifications || 'None yet'}
- Notable Projects: ${projects || 'None yet - recommend beginner projects'}
- Work Experience: ${experience}
${currentlyEmployed ? `- Current Status: ${currentlyEmployed}` : ''}

Career Goals:
- Primary Target Role: ${targetRole}
${alternativeRoles ? `- Alternative Roles: ${alternativeRoles}` : ''}
${careerMotivation ? `- Motivation: "${careerMotivation}"` : ''}
- Timeline: ${timeline} months
${jobSearchStatus ? `- Job Search Status: ${jobSearchStatus}` : ''}

Work Preferences:
${careerPriorities ? `- Priorities: ${careerPriorities}` : ''}
${industryPreferences ? `- Industries: ${industryPreferences}` : ''}
${workEnvironment ? `- Work Environment: ${workEnvironment}` : ''}
${companySize ? `- Company Size Preference: ${companySize}` : ''}
${willingToRelocate ? `- Relocation: ${willingToRelocate}` : ''}
${workStyle ? `- Work Style: ${workStyle}` : ''}

Create a HIGHLY PERSONALIZED career roadmap in JSON format. Use ALL the information above to tailor recommendations.

**PERSONALIZATION REQUIREMENTS:**
1. If GPA is high (3.5+), target competitive companies (FAANG, top consulting)
2. If GPA is lower, focus on portfolio/skills and mid-tier companies
3. If they have projects, build upon them in portfolio recommendations
4. If career motivation mentions specific interests, align company recommendations
5. If they prefer startups, recommend fast-paced learning and startup-relevant skills
6. If they prefer work-life balance, avoid recommending startups with "grind culture"
7. If remote preference, prioritize remote-friendly companies
8. If alternative roles provided, include transition paths
9. Adjust timeline intensity based on job search status (active = more urgent)
10. Match learning resources to their stated work style

**CRITICAL: Return ONLY valid JSON with this EXACT structure:**

{
  "skillsGap": {
    "hasAlready": ["skill from their input", "another skill", "another skill"],
    "needToLearn": ["SPECIFIC skill for ${targetRole}", "critical skill", "important skill", "useful skill", "trending skill"],
    "optional": ["advanced skill", "emerging technology", "nice-to-have"]
  },
  "learningPath": [
    {
      "month": 1,
      "focus": "Specific focus area aligned with their experience level",
      "skills": ["Skill 1", "Skill 2"],
      "timeCommitment": "Adjusted based on current employment status",
      "resources": ["FREE course (e.g., 'freeCodeCamp: Learn X')", "YouTube: Channel Name", "Documentation link"],
      "milestone": "By end of month 1: [SPECIFIC measurable goal considering their current projects]"
    }
    // ... exactly ${timeline} months
  ],
  "portfolioProjects": [
    {
      "title": "Project name relevant to ${targetRole} and their interests",
      "description": "Build on existing projects if mentioned, otherwise start fresh. List 3-5 key features.",
      "skills": ["skill1", "skill2", "skill3", "skill4"],
      "difficulty": "Match to their experience level",
      "estimatedTime": "X-Y weeks",
      "impact": "Why this impresses employers, specific to their target companies"
    }
    // 4-5 projects
  ],
  "marketInsights": {
    "demandLevel": "High|Medium|Growing - specific to ${country}",
    "avgSalary": "REALISTIC range in local currency for ${country}",
    "trendingSkills": ["trending 1", "trending 2", "trending 3", "trending 4", "trending 5"],
    "industryGrowth": "2-3 sentences about ${targetRole} in ${country}, growth rate, demand factors"
  },
  "interviewPrep": {
    "technicalTopics": ["specific topic 1", "topic 2", "topic 3", "topic 4", "topic 5"],
    "behavioralQuestions": ["Question for ${targetRole}", "Question 2", "Question 3", "Question 4"],
    "practiceResources": ["Resource 1", "Resource 2", "Resource 3", "Resource 4"]
  },
  "jobOpportunities": {
    "topCompanies": ["Match to GPA level and preferences - if high GPA: FAANG; if startup pref: unicorns", "Company 2", "Company 3", "Company 4", "Company 5"],
    "jobBoards": ["Platforms in ${country}", "Platform 2", "Platform 3"],
    "networking": ["Groups for ${targetRole} in ${country}", "Association", "Meetup"],
    "applicationTips": ["Specific to their experience level and preferences", "Tip 2", "Tip 3"]
  }
}

**CRITICAL PERSONALIZATION EXAMPLES:**
- If "career motivation" mentions innovation → Recommend innovative companies
- If prefers "remote" → Include remote-first companies (GitLab, Automattic)
- If "high salary" priority → Focus on high-paying roles and companies
- If "work-life balance" priority → Recommend companies with good culture (not banking/consulting)
- If has certifications → Leverage in recommendations
- If alternative roles provided → Add note about transition paths

Return ONLY the JSON object. No markdown, no explanations.`;

    console.log('📤 Sending comprehensive profile to Groq AI...');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor who provides highly personalized, data-driven career guidance. You analyze comprehensive user profiles to create tailored roadmaps that account for academic standing, experience level, career preferences, and personal motivations. Always return perfectly formatted JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" }
    });

    console.log('📥 Received response from Groq');

    const responseText = completion.choices[0].message.content;
    const analysis = JSON.parse(responseText);
    
    console.log('✅ Successfully parsed JSON!');

    return Response.json({
      success: true,
      data: analysis,
      liveJobs: liveJobs,
      jobBoards: jobBoards,
      platformSearchLinks: platformSearchLinks,
      companyJobListings: companyJobListings,
      metadata: {
        // Basic
        country,
        university,
        educationLevel,
        course,
        graduationDate,
        gpa,
        
        // Goals
        targetRole,
        alternativeRoles,
        timeline,
        experience,
        
        // Preferences
        careerPriorities,
        workEnvironment,
        companySize,
        
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API ERROR');
    console.error('Error message:', error.message);
    
    let errorMessage = 'Analysis failed';
    if (error.message.includes('API key')) {
      errorMessage = 'Invalid API key. Please check environment variables.';
    } else if (error.message.includes('rate_limit')) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Failed to parse AI response. Please try again.';
    }
    
    return Response.json(
      { success: false, error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}