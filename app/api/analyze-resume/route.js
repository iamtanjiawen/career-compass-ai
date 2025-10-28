// app/api/analyze-resume/route.js - AI Resume Analysis API

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { resumeText, targetRole } = await request.json();

    if (!resumeText || !targetRole) {
      return Response.json(
        { success: false, error: 'Missing resume text or target role' },
        { status: 400 }
      );
    }

    console.log(`📄 Analyzing resume for ${targetRole}...`);

    const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer. Analyze this resume for a ${targetRole} position.

**RESUME TEXT:**
${resumeText}

**TARGET ROLE:** ${targetRole}

Extract and analyze the following in JSON format:

{
  "extractedData": {
    "name": "candidate name if found",
    "email": "email if found",
    "phone": "phone if found",
    "education": ["degree 1", "degree 2"],
    "experience": [
      {
        "title": "job title",
        "company": "company name",
        "duration": "dates",
        "description": "brief summary"
      }
    ],
    "technicalSkills": ["skill1", "skill2", "skill3"],
    "softSkills": ["skill1", "skill2"],
    "projects": ["project1", "project2"],
    "certifications": ["cert1", "cert2"]
  },
  "atsScore": 75,
  "atsScoreBreakdown": {
    "skillsMatch": 80,
    "experience": 70,
    "education": 75,
    "keywords": 65,
    "formatting": 85
  },
  "strengths": [
    "Strong technical skills in X, Y, Z",
    "Relevant experience at ABC Company",
    "Clear project demonstrations"
  ],
  "weaknesses": [
    "Missing key skill: Docker",
    "No cloud platform experience mentioned",
    "Project descriptions too vague"
  ],
  "missingSkills": [
    "Docker",
    "AWS",
    "Kubernetes",
    "CI/CD"
  ],
  "recommendations": [
    "Add specific metrics to project descriptions (e.g., 'Improved performance by 40%')",
    "Include Docker and containerization experience",
    "Add AWS certifications if you have them",
    "Use more action verbs: Led, Developed, Implemented",
    "Quantify achievements with numbers"
  ],
  "atsOptimization": {
    "keywordsToAdd": ["keyword1", "keyword2", "keyword3"],
    "sectionsToImprove": ["Projects", "Technical Skills"],
    "formattingIssues": ["Use bullet points for better ATS parsing"]
  },
  "matchPercentage": 65,
  "summary": "This resume shows strong foundational skills for ${targetRole}, but lacks several key technical requirements. Adding cloud platform experience and quantifying achievements would significantly improve ATS match score."
}

Return ONLY valid JSON. Be specific and actionable in recommendations.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert ATS analyzer and career coach. Provide detailed, actionable resume feedback in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    console.log('✅ Resume analysis complete');

    return Response.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to analyze resume',
        details: error.message 
      },
      { status: 500 }
    );
  }
}