// app/api/chat/route.js - ADVANCED VERSION with RAG (Retrieval-Augmented Generation)

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Search for relevant career information using Brave Search API
 * This ensures AI responses are accurate and up-to-date
 */
async function searchCareerInfo(query) {
  const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY;
  
  if (!BRAVE_API_KEY) {
    console.warn('Brave Search API not configured - using AI knowledge only');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=3`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    
    // Extract relevant snippets
    const snippets = data.web?.results?.slice(0, 3).map(result => ({
      title: result.title,
      description: result.description,
      url: result.url
    })) || [];

    return snippets;
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

/**
 * Detect if query needs real-time information
 */
function needsSearch(query) {
  const searchKeywords = [
    'latest', 'current', 'trending', 'salary', 'demand', 'hiring',
    'job market', 'companies hiring', 'how much', 'average pay',
    'job openings', 'certifications', 'best courses', 'top skills'
  ];
  
  return searchKeywords.some(keyword => 
    query.toLowerCase().includes(keyword)
  );
}

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

    // Check if we need to search for current information
    let searchResults = null;
    if (needsSearch(userMessage)) {
      console.log('🔍 Query needs real-time data, searching...');
      searchResults = await searchCareerInfo(userMessage);
    }

    // Build enhanced system prompt
    let systemPrompt = `You are an expert AI career counselor assistant for CareerCompass AI.

${context ? `USER'S ROADMAP CONTEXT:\n${context}` : ''}

${searchResults ? `
CURRENT INFORMATION FROM WEB SEARCH:
${searchResults.map((r, i) => `
Source ${i + 1}: ${r.title}
${r.description}
URL: ${r.url}
`).join('\n')}

IMPORTANT: Use this current information in your response. Cite sources when providing statistics or specific data.
` : ''}

Your responsibilities:
- Answer career-related questions with specific, actionable advice
- Reference the user's personalized roadmap when relevant
- Provide learning resources, interview tips, and job search strategies
- Be encouraging and motivating
- Keep responses concise (2-4 sentences) unless detailed explanation is requested
- If you used web search data, mention "Based on current data" or "According to recent trends"

Style:
- Friendly but professional
- Use emojis sparingly (1-2 per response)
- Use bullet points for lists
- Be specific and actionable

Keep responses under 150 words unless user asks for detailed explanations.`;

    // Build conversation
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;

    console.log('✅ Chat response generated');

    return Response.json({
      message: aiResponse,
      success: true,
      usedSearch: searchResults !== null,
      sources: searchResults
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    
    let errorMessage = "I'm having trouble right now. Please try asking your question again.";
    
    if (error.message?.includes('rate_limit')) {
      errorMessage = "I'm getting too many requests. Please wait a moment and try again.";
    }
    
    return Response.json(
      { 
        error: 'Failed to generate response',
        message: errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}