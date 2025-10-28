// app/api/interview/route.js - COMPLETE Enhanced Version

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Live Interview Actions
    if (action === 'generate_live_questions') {
      return await generateLiveQuestions(body);
    } else if (action === 'evaluate_live_answer') {
      return await evaluateLiveAnswer(body);
    } else if (action === 'final_live_evaluation') {
      return await finalLiveEvaluation(body);
    }
    
    // Text Interview Actions (existing)
    else if (action === 'generate_questions') {
      return await generateQuestions(body.targetRole);
    } else if (action === 'evaluate_answer') {
      return await evaluateAnswer(body.targetRole, body.questionNumber, body.userAnswer, body.currentQuestion);
    } else if (action === 'final_evaluation') {
      return await finalEvaluation(body.targetRole, body.allAnswers);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Interview API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ==================== LIVE INTERVIEW FUNCTIONS ====================

async function generateLiveQuestions({
  targetRole,
  yearsExperience,
  salaryExpectation,
  educationLevel,
  projectExperience,
  strengths,
  weaknesses
}) {
  const prompt = `You are an expert HR interviewer conducting a live video interview for a ${targetRole} position.

**CANDIDATE PROFILE:**
- Target Role: ${targetRole}
- Experience: ${yearsExperience}
- Education: ${educationLevel}
- Salary Expectation: ${salaryExpectation || 'Not specified'}
- Project Experience: ${projectExperience || 'Not specified'}
- Key Strengths: ${strengths}
- Areas to Improve: ${weaknesses || 'Not specified'}

Generate 5 highly personalized interview questions that:
1. Match the seniority level (${yearsExperience})
2. Probe relevant experience for ${targetRole}
3. Address the specific strengths mentioned
4. Are realistic for a live video interview (not too long)
5. Mix behavioral (STAR), technical, and situational questions
6. Progressive difficulty (start easier, end harder)

Return in JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "Behavioral",
      "question": "Tell me about your experience as a ${targetRole}. What drew you to this field?",
      "category": "Background & Experience",
      "difficulty": "Easy",
      "focusAreas": ["Experience", "Motivation"],
      "timeLimit": 120,
      "thinkingTime": 30,
      "optimalAnswerLength": "90-120 seconds",
      "evaluationCriteria": [
        "Clear communication",
        "Relevant experience mentioned",
        "Genuine enthusiasm",
        "Specific examples"
      ]
    },
    {
      "id": 2,
      "type": "Strengths-Based",
      "question": "You mentioned that ${strengths.split(',')[0]} is one of your strengths. Can you give me a specific example of how you've used this skill in your work?",
      "category": "Strengths & Skills",
      "difficulty": "Medium",
      "focusAreas": ["Strengths", "Examples"],
      "timeLimit": 120,
      "thinkingTime": 30,
      "optimalAnswerLength": "90-120 seconds",
      "evaluationCriteria": [
        "Uses STAR method",
        "Provides specific metrics",
        "Demonstrates claimed strength",
        "Shows impact/results"
      ]
    },
    {
      "id": 3,
      "type": "Problem-Solving",
      "question": "Describe a challenging situation you faced in a ${targetRole} project. How did you approach it and what was the outcome?",
      "category": "Problem Solving",
      "difficulty": "Medium",
      "focusAreas": ["Problem-solving", "Technical skills"],
      "timeLimit": 120,
      "thinkingTime": 30,
      "optimalAnswerLength": "90-120 seconds",
      "evaluationCriteria": [
        "Clear problem definition",
        "Systematic approach",
        "Technical competence",
        "Measurable results"
      ]
    },
    {
      "id": 4,
      "type": "Situational",
      "question": "If you were hired for this ${targetRole} position, what would be your priorities in the first 90 days?",
      "category": "Strategic Thinking",
      "difficulty": "Hard",
      "focusAreas": ["Planning", "Initiative"],
      "timeLimit": 120,
      "thinkingTime": 30,
      "optimalAnswerLength": "90-120 seconds",
      "evaluationCriteria": [
        "Realistic plan",
        "Understands role",
        "Proactive mindset",
        "Strategic thinking"
      ]
    },
    {
      "id": 5,
      "type": "Career Goals",
      "question": "Where do you see yourself in 3-5 years as a ${targetRole}? What skills do you want to develop?",
      "category": "Career Aspirations",
      "difficulty": "Medium",
      "focusAreas": ["Ambition", "Growth mindset"],
      "timeLimit": 120,
      "thinkingTime": 30,
      "optimalAnswerLength": "60-90 seconds",
      "evaluationCriteria": [
        "Realistic goals",
        "Commitment to growth",
        "Alignment with role",
        "Long-term thinking"
      ]
    }
  ]
}

IMPORTANT: Questions must be conversational, not too long, and suitable for video interview.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an experienced HR professional conducting live video interviews. Create personalized, conversational questions that match the candidate's experience level and profile." 
      },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: "json_object" }
  });

  const data = JSON.parse(completion.choices[0].message.content);
  return Response.json({ success: true, ...data });
}

async function evaluateLiveAnswer({
  targetRole,
  yearsExperience,
  educationLevel,
  questionNumber,
  userAnswer,
  currentQuestion,
  strengths
}) {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  
  const prompt = `You are an expert interview evaluator analyzing a LIVE VIDEO INTERVIEW answer for a ${targetRole} position.

**CANDIDATE PROFILE:**
- Role: ${targetRole}
- Experience: ${yearsExperience}
- Education: ${educationLevel}
- Stated Strengths: ${strengths}

**QUESTION ASKED:**
Type: ${currentQuestion?.type || 'General'}
Question: ${currentQuestion?.question || 'Interview question'}
Category: ${currentQuestion?.category || 'General'}

**CANDIDATE'S ANSWER (Transcribed):**
${userAnswer}
(Word count: ${wordCount} words)

**EVALUATION CRITERIA FOR LIVE INTERVIEW:**
Score out of 10 based on:

1. **Content Quality (0-3 points):**
   - Directly answers the question
   - Provides relevant examples/evidence
   - Demonstrates knowledge for ${targetRole}
   - Appropriate for ${yearsExperience} level

2. **Structure & Clarity (0-2 points):**
   - Logical flow (STAR method for behavioral)
   - Easy to follow
   - Well-organized response

3. **Depth & Specificity (0-2 points):**
   - Provides specific examples
   - Mentions metrics/outcomes (if applicable)
   - Shows technical/role knowledge
   - Sufficient detail without rambling

4. **Communication Quality (0-2 points):**
   - Professional language
   - Confident delivery (inferred from response quality)
   - Appropriate length (90-120 seconds)
   - Clear and concise

5. **Role Fit (0-1 point):**
   - Demonstrates fit for ${targetRole}
   - Shows understanding of role requirements

**BODY LANGUAGE ASSESSMENT (Simulated based on answer quality):**
- High-quality answers suggest: good eye contact, confident posture, engaged
- Vague answers suggest: nervous, unprepared, disengaged
- Specific details suggest: enthusiasm, preparation, genuine interest

Return VALID JSON (no extra text):
{
  "score": 7.5,
  "contentScore": 2.5,
  "structureScore": 1.5,
  "depthScore": 1.5,
  "communicationScore": 1.5,
  "roleFitScore": 0.5,
  "strengths": [
    "Provided clear example with measurable outcome",
    "Demonstrated strong ${targetRole} knowledge",
    "Used structured approach (STAR method)"
  ],
  "improvements": [
    "Could add more specific technical details",
    "Should quantify the impact more clearly",
    "Consider mentioning lessons learned"
  ],
  "detailedFeedback": "Your answer demonstrates good understanding of the ${targetRole} role. The example you provided was relevant and showed your ${strengths.split(',')[0]} strength. To improve further, consider adding more specific metrics about the outcome and explaining what you learned from the experience.",
  "bodyLanguageNotes": [
    "Confidence: High (based on clear, specific response)",
    "Engagement: Good - showed genuine interest in the topic",
    "Professionalism: Maintained throughout"
  ],
  "rating": "Good",
  "wordCount": ${wordCount},
  "optimalLength": "90-120 seconds (approximately 135-180 words)",
  "lengthFeedback": "${wordCount < 80 ? 'Answer is too brief - aim for more detail' : wordCount > 200 ? 'Answer is slightly long - be more concise' : 'Good length'}",
  "suggestedAnswer": "A stronger answer would: [1] Start with brief context, [2] Explain the specific situation/challenge, [3] Detail your action steps with technical specifics, [4] Share measurable results, [5] Mention key takeaway or learning."
}

GRADING RULES:
- Be realistic: Most good answers score 6-8
- Score 9-10: Exceptional, detailed, perfect structure
- Score 7-8: Good, relevant, some improvements possible
- Score 5-6: Adequate but lacking depth/examples
- Score below 5: Poor, vague, or off-topic

Consider the experience level: ${yearsExperience} candidates should have different expectations than senior candidates.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are a senior HR interviewer evaluating live video interview responses. Provide constructive, specific feedback that helps candidates improve. Consider both verbal content and implied body language from response quality." 
      },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: "json_object" }
  });

  const evaluation = JSON.parse(completion.choices[0].message.content);
  
  if (typeof evaluation.score === 'string') {
    evaluation.score = parseFloat(evaluation.score);
  }
  
  return Response.json({ success: true, evaluation });
}

async function finalLiveEvaluation({
  targetRole,
  yearsExperience,
  educationLevel,
  salaryExpectation,
  allAnswers,
  strengths,
  weaknesses
}) {
  const answersText = allAnswers.map((a, i) => 
    `Q${i+1} [${a.question}]\nScore: ${a.evaluation?.score || a.score}/10\nKey Points: ${a.evaluation?.strengths?.join(', ') || 'N/A'}`
  ).join('\n\n');

  const avgScore = allAnswers.reduce((sum, a) => sum + (a.evaluation?.score || a.score || 0), 0) / allAnswers.length;

  const prompt = `Provide a comprehensive LIVE VIDEO INTERVIEW performance summary and hiring recommendation.

**CANDIDATE PROFILE:**
- Target Role: ${targetRole}
- Experience Level: ${yearsExperience}
- Education: ${educationLevel}
- Salary Expectation: ${salaryExpectation || 'Not specified'}
- Stated Strengths: ${strengths}
- Areas to Improve: ${weaknesses || 'Not specified'}

**INTERVIEW PERFORMANCE:**
Average Score: ${avgScore.toFixed(1)}/10

${answersText}

**YOUR TASK:**
Provide a complete interview assessment as if you're reporting to the hiring manager.

Return JSON:
{
  "overallScore": ${avgScore.toFixed(1)},
  "performanceLevel": "Strong Candidate | Good Candidate | Average Candidate | Needs Improvement",
  "hiringRecommendation": "Strongly Recommend | Recommend | Consider | Do Not Recommend",
  "confidenceLevel": "High | Medium | Low",
  "strengths": [
    "Excellent communication - clear and structured responses",
    "Strong technical knowledge relevant to ${targetRole}",
    "Good examples with measurable outcomes",
    "Professional demeanor throughout interview",
    "Demonstrated genuine interest in the role"
  ],
  "areasForImprovement": [
    "Could provide more specific technical details",
    "Should quantify achievements more clearly",
    "Would benefit from more diverse project examples",
    "Could show more enthusiasm/energy"
  ],
  "technicalCompetence": "Strong | Adequate | Needs Development",
  "communicationSkills": "Excellent | Good | Fair | Poor",
  "culturalFit": "High | Medium | Low",
  "readinessLevel": "Ready for ${targetRole} interviews at top companies | Ready with minor improvements | Needs significant preparation",
  "salaryAlignment": "${salaryExpectation ? `Expectation of ${salaryExpectation} is ${avgScore >= 7.5 ? 'aligned with' : avgScore >= 6 ? 'slightly above' : 'above'} demonstrated skill level` : 'Not specified'}",
  "nextSteps": [
    "Practice answering with more specific metrics and outcomes",
    "Prepare 5-6 STAR stories covering different competencies",
    "Research target companies and tailor answers",
    "Work on [specific weakness identified]",
    "Consider mock interviews for technical deep-dives"
  ],
  "interviewTips": [
    "Maintain steady eye contact with the camera (not the screen)",
    "Show more energy and enthusiasm in your delivery",
    "Use hand gestures naturally to emphasize points",
    "Smile genuinely when discussing achievements",
    "Take brief pauses to collect thoughts before answering"
  ],
  "comparisonToBenchmark": "Compared to typical ${yearsExperience} ${targetRole} candidates, this performance is ${avgScore >= 7.5 ? 'above average' : avgScore >= 6 ? 'average' : 'below average'}.",
  "detailedAssessment": "Overall, the candidate demonstrated [summarize performance]. Their strongest areas were [list]. They would benefit from [improvements]. ${avgScore >= 7 ? 'I believe they have the foundation for success in a ${targetRole} role' : 'With additional preparation in [areas], they could be ready for ${targetRole} positions'}. The candidate's experience level (${yearsExperience}) and education (${educationLevel}) ${avgScore >= 7 ? 'align well with' : 'partially support'} their target role.",
  "specificFeedbackByQuestion": [
    {
      "questionNumber": 1,
      "performance": "Strong | Good | Adequate | Weak",
      "note": "Brief feedback on this specific answer"
    }
  ]
}

Be professional but honest. This assessment will help the candidate improve.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are a senior HR director providing a final interview assessment and hiring recommendation. Be thorough, fair, and constructive. Your assessment will influence hiring decisions and help candidates improve." 
      },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 3000,
    response_format: { type: "json_object" }
  });

  const finalEval = JSON.parse(completion.choices[0].message.content);
  return Response.json({ success: true, ...finalEval });
}

// ==================== TEXT INTERVIEW FUNCTIONS (Existing) ====================

async function generateQuestions(targetRole) {
  const prompt = `Generate 5 realistic interview questions for a ${targetRole} position. Include a mix of:
  - 2 technical questions (specific to the role)
  - 2 behavioral questions (STAR method applicable)
  - 1 situational question (problem-solving scenario)

Return in JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "technical",
      "question": "Explain the difference between...",
      "category": "Technical Knowledge",
      "difficulty": "Medium",
      "timeLimit": 5,
      "optimalWordCount": "150-250",
      "idealAnswerPoints": [
        "Should mention X",
        "Should explain Y",
        "Should give example Z"
      ]
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an experienced technical interviewer." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" }
  });

  const data = JSON.parse(completion.choices[0].message.content);
  return Response.json({ success: true, ...data });
}

async function evaluateAnswer(targetRole, questionNumber, userAnswer, currentQuestion) {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  
  const prompt = `You are an expert interview coach evaluating a ${targetRole} candidate's answer.

**QUESTION:** ${currentQuestion?.question || 'Interview question'}
**QUESTION TYPE:** ${currentQuestion?.type || 'General'}
**USER'S ANSWER:**
${userAnswer}

**ANSWER LENGTH:** ${wordCount} words

**GRADING CRITERIA (Score out of 10):**
1. **Content Quality (0-3 points):**
   - Does it directly answer the question?
   - Is the information accurate and relevant?
   - Are examples/evidence provided?

2. **Structure & Clarity (0-2 points):**
   - Is it well-organized (e.g., STAR method for behavioral)?
   - Is the explanation clear and logical?

3. **Depth & Detail (0-2 points):**
   - Are specifics provided (metrics, numbers, outcomes)?
   - Is technical knowledge demonstrated (for tech questions)?

4. **Completeness (0-2 points):**
   - Are all parts of the question addressed?
   - Is the answer thorough without being too brief?

5. **Communication (0-1 point):**
   - Professional language?
   - Good word choice?

**DEDUCTIONS:**
- Too short (<50 words): -2 points
- Too long (>400 words): -1 point
- Off-topic or vague: -2 points

Evaluate and return VALID JSON (no extra text):
{
  "score": 7.5,
  "contentScore": 2.5,
  "structureScore": 1.5,
  "depthScore": 1.5,
  "completenessScore": 1.5,
  "communicationScore": 0.5,
  "strengths": [
    "Provided specific example with metrics (increased sales by 40%)",
    "Used STAR method effectively"
  ],
  "improvements": [
    "Could add more technical details about implementation",
    "Should mention lessons learned or what you'd do differently"
  ],
  "detailedFeedback": "Your answer demonstrates solid understanding of the role. The example was relevant and well-structured. However, adding specific metrics and technical details would strengthen your response.",
  "rating": "Good",
  "wordCount": ${wordCount},
  "optimalWordRange": "100-250 words",
  "suggestedAnswer": "A stronger answer would include: [specific improvements based on the question]"
}

Be STRICT in grading. Most answers should score 5-8, not 8-10. Only exceptional answers get 9-10.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a strict but fair interview evaluator. Use the full 0-10 scale. Average answers should score 5-6, good answers 7-8, excellent 9-10. Be specific and honest in feedback." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: "json_object" }
  });

  const evaluation = JSON.parse(completion.choices[0].message.content);
  
  if (typeof evaluation.score === 'string') {
    evaluation.score = parseFloat(evaluation.score);
  }
  
  return Response.json({ success: true, evaluation });
}

async function finalEvaluation(targetRole, allAnswers) {
  const answersText = allAnswers.map((a, i) => 
    `Q${i+1}: ${a.question}\nA${i+1}: ${a.answer}\nScore: ${a.score}/10`
  ).join('\n\n');

  const prompt = `Provide a comprehensive interview performance summary for a ${targetRole} candidate.

**ALL ANSWERS:**
${answersText}

Return JSON:
{
  "overallScore": 7.8,
  "averageScore": 7.5,
  "performanceLevel": "Strong",
  "strengths": [
    "Excellent technical knowledge",
    "Clear communication"
  ],
  "areasForImprovement": [
    "Add more quantifiable results",
    "Elaborate on leadership experiences"
  ],
  "readinessLevel": "Interview Ready - Minor improvements needed",
  "nextSteps": [
    "Practice behavioral questions with STAR method",
    "Prepare 3-4 strong examples with metrics"
  ],
  "interviewTips": [
    "Tip 1",
    "Tip 2"
  ]
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a career coach providing final interview assessment." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 1500,
    response_format: { type: "json_object" }
  });

  const finalEval = JSON.parse(completion.choices[0].message.content);
  return Response.json({ success: true, ...finalEval });
}