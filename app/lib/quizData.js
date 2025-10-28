// app/lib/quizData.js - Holland Code (RIASEC) Career Assessment Data

/**
 * Holland Code (RIASEC) Questions
 * Based on Dr. John L. Holland's Career Theory
 */
export const hollandQuestions = [
  {
    id: 1,
    category: "Work Activities",
    question: "Which type of work activity appeals to you most?",
    options: [
      { text: "Building, fixing, or working with machines", code: "R" },
      { text: "Conducting research or analyzing data", code: "I" },
      { text: "Creating art, music, or writing", code: "A" },
      { text: "Teaching, counseling, or helping others", code: "S" },
      { text: "Leading teams or managing projects", code: "E" },
      { text: "Organizing data or maintaining records", code: "C" }
    ]
  },
  {
    id: 2,
    category: "Problem Solving",
    question: "When facing a complex problem, you prefer to:",
    options: [
      { text: "Work with your hands to find a practical solution", code: "R" },
      { text: "Research and analyze different approaches", code: "I" },
      { text: "Think creatively and imagine new possibilities", code: "A" },
      { text: "Collaborate with others and consider everyone's input", code: "S" },
      { text: "Take charge and make executive decisions", code: "E" },
      { text: "Follow established procedures and guidelines", code: "C" }
    ]
  },
  {
    id: 3,
    category: "Skills & Interests",
    question: "Which skills do you enjoy using most?",
    options: [
      { text: "Technical skills and physical coordination", code: "R" },
      { text: "Mathematical and scientific abilities", code: "I" },
      { text: "Artistic and creative talents", code: "A" },
      { text: "Interpersonal and communication skills", code: "S" },
      { text: "Leadership and persuasion abilities", code: "E" },
      { text: "Attention to detail and organizational skills", code: "C" }
    ]
  },
  {
    id: 4,
    category: "Work Environment",
    question: "What type of work environment excites you?",
    options: [
      { text: "Outdoors or hands-on workshop setting", code: "R" },
      { text: "Laboratory or research facility", code: "I" },
      { text: "Creative studio or performance space", code: "A" },
      { text: "Community center or healthcare facility", code: "S" },
      { text: "Corporate office or business setting", code: "E" },
      { text: "Organized office with clear systems", code: "C" }
    ]
  },
  {
    id: 5,
    category: "Values",
    question: "What matters most to you in a career?",
    options: [
      { text: "Working with tangible, real-world objects", code: "R" },
      { text: "Pursuing knowledge and intellectual challenges", code: "I" },
      { text: "Expressing creativity and originality", code: "A" },
      { text: "Making a positive impact on people's lives", code: "S" },
      { text: "Achieving influence and recognition", code: "E" },
      { text: "Maintaining accuracy and order", code: "C" }
    ]
  },
  {
    id: 6,
    category: "Working Style",
    question: "How do you prefer to approach tasks?",
    options: [
      { text: "Independently with physical tools", code: "R" },
      { text: "Methodically through research and analysis", code: "I" },
      { text: "With artistic freedom and self-expression", code: "A" },
      { text: "Collaboratively with people", code: "S" },
      { text: "Competitively with clear goals", code: "E" },
      { text: "Systematically following procedures", code: "C" }
    ]
  },
  {
    id: 7,
    category: "Personality Traits",
    question: "Which description fits you best?",
    options: [
      { text: "Practical, hands-on, and physically active", code: "R" },
      { text: "Analytical, curious, and intellectual", code: "I" },
      { text: "Imaginative, intuitive, and expressive", code: "A" },
      { text: "Empathetic, helpful, and understanding", code: "S" },
      { text: "Ambitious, confident, and persuasive", code: "E" },
      { text: "Detail-oriented, organized, and precise", code: "C" }
    ]
  },
  {
    id: 8,
    category: "Ideal Projects",
    question: "Which project would you find most satisfying?",
    options: [
      { text: "Building something functional", code: "R" },
      { text: "Solving a scientific mystery", code: "I" },
      { text: "Creating an artistic masterpiece", code: "A" },
      { text: "Helping someone overcome a challenge", code: "S" },
      { text: "Leading a successful business venture", code: "E" },
      { text: "Organizing a complex database", code: "C" }
    ]
  },
  {
    id: 9,
    category: "Learning Preference",
    question: "How do you prefer to learn new things?",
    options: [
      { text: "Through hands-on practice and experimentation", code: "R" },
      { text: "By studying theories and conducting research", code: "I" },
      { text: "Through creative exploration and trial", code: "A" },
      { text: "By discussing with others and teaching", code: "S" },
      { text: "Through competitive challenges", code: "E" },
      { text: "By following structured courses", code: "C" }
    ]
  },
  {
    id: 10,
    category: "Career Motivations",
    question: "What drives you most in your career?",
    options: [
      { text: "Working with physical objects and machinery", code: "R" },
      { text: "Discovering new knowledge and understanding", code: "I" },
      { text: "Creating beauty and expressing yourself", code: "A" },
      { text: "Helping others and building relationships", code: "S" },
      { text: "Achieving status and financial success", code: "E" },
      { text: "Maintaining order and accuracy", code: "C" }
    ]
  }
];

/**
 * RIASEC Code Descriptions
 */
export function getRIASECDescription(code) {
  const descriptions = {
    R: { 
      name: "Realistic", 
      desc: "Prefers practical, hands-on work with tools and machines"
    },
    I: { 
      name: "Investigative", 
      desc: "Enjoys analyzing, researching, and solving complex problems"
    },
    A: { 
      name: "Artistic", 
      desc: "Values creativity, self-expression, and original thinking"
    },
    S: { 
      name: "Social", 
      desc: "Enjoys helping, teaching, and working with people"
    },
    E: { 
      name: "Enterprising", 
      desc: "Prefers leading, persuading, and business ventures"
    },
    C: { 
      name: "Conventional", 
      desc: "Values organization, detail, and systematic work"
    }
  };
  return descriptions[code] || { name: "Unknown", desc: "" };
}

/**
 * Comprehensive Career Database with Holland Codes
 * Over 100 careers mapped to RIASEC codes
 */
export const hollandCareers = [
  // REALISTIC (R) Careers
  { role: "Mechanical Engineer", code: "RIE", category: "Engineering", icon: "⚙️", description: "Design and build mechanical systems and machinery" },
  { role: "Electrician", code: "RIC", category: "Trades", icon: "⚡", description: "Install and maintain electrical systems" },
  { role: "Carpenter", code: "RIS", category: "Trades", icon: "🔨", description: "Construct and repair building frameworks" },
  { role: "Automotive Technician", code: "RIE", category: "Trades", icon: "🚗", description: "Diagnose and repair vehicle issues" },
  { role: "Civil Engineer", code: "RIC", category: "Engineering", icon: "🏗️", description: "Design infrastructure like roads and bridges" },
  { role: "Aircraft Mechanic", code: "RIE", category: "Aviation", icon: "✈️", description: "Maintain and repair aircraft systems" },
  { role: "Welder", code: "RCI", category: "Trades", icon: "🔥", description: "Join metal parts using specialized equipment" },
  { role: "HVAC Technician", code: "RIS", category: "Trades", icon: "❄️", description: "Install heating and cooling systems" },
  
  // INVESTIGATIVE (I) Careers
  { role: "Data Scientist", code: "IRC", category: "Technology", icon: "📊", description: "Analyze complex data to solve problems" },
  { role: "Research Scientist", code: "IRE", category: "Science", icon: "🔬", description: "Conduct experiments and publish findings" },
  { role: "Medical Doctor", code: "ISA", category: "Healthcare", icon: "⚕️", description: "Diagnose and treat medical conditions" },
  { role: "Software Developer", code: "IRA", category: "Technology", icon: "💻", description: "Build applications and systems" },
  { role: "Pharmacist", code: "ICS", category: "Healthcare", icon: "💊", description: "Dispense medications and provide drug information" },
  { role: "Laboratory Technician", code: "IRC", category: "Science", icon: "🧪", description: "Conduct scientific tests and experiments" },
  { role: "Mathematician", code: "IER", category: "Science", icon: "🔢", description: "Develop mathematical theories and models" },
  { role: "Environmental Scientist", code: "IRS", category: "Science", icon: "🌍", description: "Study environmental issues and solutions" },
  
  // ARTISTIC (A) Careers
  { role: "Graphic Designer", code: "AES", category: "Design", icon: "🎨", description: "Create visual concepts for communication" },
  { role: "UX/UI Designer", code: "AIE", category: "Design", icon: "📱", description: "Design user-friendly digital interfaces" },
  { role: "Writer/Author", code: "ASE", category: "Creative", icon: "✍️", description: "Create written content and stories" },
  { role: "Video Editor", code: "ARE", category: "Media", icon: "🎬", description: "Edit and produce video content" },
  { role: "Interior Designer", code: "AES", category: "Design", icon: "🏠", description: "Design functional and aesthetic spaces" },
  { role: "Musician", code: "ASE", category: "Arts", icon: "🎵", description: "Perform or compose music" },
  { role: "Photographer", code: "ARI", category: "Creative", icon: "📷", description: "Capture and edit professional images" },
  { role: "Fashion Designer", code: "AES", category: "Design", icon: "👗", description: "Create clothing and accessory designs" },
  
  // SOCIAL (S) Careers
  { role: "Teacher", code: "SAE", category: "Education", icon: "👩‍🏫", description: "Educate students in various subjects" },
  { role: "Registered Nurse", code: "SIA", category: "Healthcare", icon: "👩‍⚕️", description: "Provide patient care and support" },
  { role: "Counselor/Therapist", code: "SAI", category: "Healthcare", icon: "🧠", description: "Provide mental health support" },
  { role: "Social Worker", code: "SEC", category: "Social Services", icon: "🤝", description: "Help individuals and families cope with challenges" },
  { role: "HR Manager", code: "SEC", category: "Business", icon: "👥", description: "Manage employee relations and recruitment" },
  { role: "Physical Therapist", code: "SIR", category: "Healthcare", icon: "🏃", description: "Help patients recover physical abilities" },
  { role: "Speech Pathologist", code: "SIA", category: "Healthcare", icon: "🗣️", description: "Treat communication disorders" },
  { role: "Occupational Therapist", code: "SRI", category: "Healthcare", icon: "🧩", description: "Help patients develop daily living skills" },
  
  // ENTERPRISING (E) Careers
  { role: "Marketing Manager", code: "EAS", category: "Business", icon: "📢", description: "Develop marketing strategies and campaigns" },
  { role: "Sales Manager", code: "ECS", category: "Business", icon: "💼", description: "Lead sales teams and drive revenue" },
  { role: "Business Analyst", code: "ECI", category: "Business", icon: "📈", description: "Analyze business processes and recommend improvements" },
  { role: "Product Manager", code: "EIA", category: "Technology", icon: "🎯", description: "Guide product development and strategy" },
  { role: "Management Consultant", code: "EIC", category: "Consulting", icon: "🧭", description: "Advise organizations on business strategy" },
  { role: "Real Estate Agent", code: "ESC", category: "Sales", icon: "🏘️", description: "Help clients buy and sell properties" },
  { role: "Financial Advisor", code: "ECI", category: "Finance", icon: "💰", description: "Provide investment and financial planning advice" },
  { role: "Entrepreneur", code: "EAS", category: "Business", icon: "🚀", description: "Start and manage your own business" },
  
  // CONVENTIONAL (C) Careers
  { role: "Accountant", code: "CSE", category: "Finance", icon: "🧮", description: "Prepare financial records and tax documents" },
  { role: "Financial Analyst", code: "CIE", category: "Finance", icon: "💹", description: "Analyze financial data and trends" },
  { role: "Data Analyst", code: "CRI", category: "Technology", icon: "📉", description: "Organize and interpret data patterns" },
  { role: "Administrative Assistant", code: "CSE", category: "Office", icon: "📋", description: "Provide administrative and clerical support" },
  { role: "Auditor", code: "CEI", category: "Finance", icon: "🔍", description: "Review financial records for accuracy" },
  { role: "Paralegal", code: "CSE", category: "Legal", icon: "⚖️", description: "Assist lawyers with legal research and documentation" },
  { role: "Quality Control Inspector", code: "CRI", category: "Manufacturing", icon: "✅", description: "Ensure products meet quality standards" },
  { role: "Medical Records Technician", code: "CSI", category: "Healthcare", icon: "📁", description: "Organize and manage health information" },
  
  // COMBINATION CODES - High demand careers
  { role: "Full Stack Developer", code: "IRC", category: "Technology", icon: "🖥️", description: "Build both frontend and backend systems" },
  { role: "Cybersecurity Analyst", code: "ICR", category: "Technology", icon: "🔐", description: "Protect systems from cyber threats" },
  { role: "DevOps Engineer", code: "IRE", category: "Technology", icon: "🔧", description: "Automate software development processes" },
  { role: "Project Manager", code: "ESC", category: "Business", icon: "📊", description: "Plan and execute projects within constraints" },
  { role: "Digital Marketing Specialist", code: "EAC", category: "Marketing", icon: "📱", description: "Manage online marketing campaigns" },
  { role: "Investment Banker", code: "ECR", category: "Finance", icon: "🏦", description: "Facilitate financial transactions for corporations" },
  { role: "Operations Manager", code: "ECR", category: "Business", icon: "⚙️", description: "Oversee daily business operations" },
  { role: "Healthcare Administrator", code: "ESC", category: "Healthcare", icon: "🏥", description: "Manage healthcare facilities and services" },
  
  // Emerging Tech Careers
  { role: "Machine Learning Engineer", code: "IRE", category: "Technology", icon: "🤖", description: "Build AI and ML systems" },
  { role: "Blockchain Developer", code: "IRC", category: "Technology", icon: "⛓️", description: "Develop decentralized applications" },
  { role: "Cloud Architect", code: "IER", category: "Technology", icon: "☁️", description: "Design cloud computing infrastructure" },
  { role: "AI Research Scientist", code: "IRE", category: "Technology", icon: "🧠", description: "Advance artificial intelligence research" },
  
  // Creative Tech
  { role: "Game Developer", code: "AIR", category: "Gaming", icon: "🎮", description: "Create video games and interactive experiences" },
  { role: "3D Animator", code: "AIR", category: "Creative", icon: "🎭", description: "Create animated 3D models and scenes" },
  { role: "VR/AR Developer", code: "AIR", category: "Technology", icon: "🥽", description: "Build virtual and augmented reality experiences" },
  
  // Healthcare Specializations
  { role: "Surgeon", code: "IRA", category: "Healthcare", icon: "🔪", description: "Perform surgical operations" },
  { role: "Psychiatrist", code: "ISA", category: "Healthcare", icon: "🧠", description: "Diagnose and treat mental health disorders" },
  { role: "Dentist", code: "IRS", category: "Healthcare", icon: "🦷", description: "Diagnose and treat oral health issues" },
  { role: "Veterinarian", code: "IRS", category: "Healthcare", icon: "🐕", description: "Provide medical care for animals" },
  
  // Science & Environment
  { role: "Biotechnology Researcher", code: "IRE", category: "Science", icon: "🧬", description: "Develop biological technologies" },
  { role: "Geologist", code: "IRA", category: "Science", icon: "🪨", description: "Study Earth's physical structure" },
  { role: "Marine Biologist", code: "IRA", category: "Science", icon: "🐠", description: "Research marine life and ecosystems" },
  
  // Legal & Government
  { role: "Lawyer", code: "ESI", category: "Legal", icon: "⚖️", description: "Represent clients in legal matters" },
  { role: "Urban Planner", code: "IEC", category: "Government", icon: "🏙️", description: "Design sustainable city development plans" },
  { role: "Policy Analyst", code: "IEC", category: "Government", icon: "📜", description: "Research and evaluate public policies" },
  
  // Arts & Entertainment
  { role: "Film Director", code: "AES", category: "Entertainment", icon: "🎬", description: "Direct film and television productions" },
  { role: "Choreographer", code: "AES", category: "Arts", icon: "💃", description: "Create dance routines and performances" },
  { role: "Voice Actor", code: "AES", category: "Entertainment", icon: "🎙️", description: "Provide voices for media productions" },
  
  // Hospitality & Service
  { role: "Chef", code: "RAS", category: "Hospitality", icon: "👨‍🍳", description: "Prepare and create culinary dishes" },
  { role: "Event Planner", code: "ESA", category: "Hospitality", icon: "🎉", description: "Organize and coordinate events" },
  { role: "Hotel Manager", code: "ESC", category: "Hospitality", icon: "🏨", description: "Oversee hotel operations" },
];

/**
 * Calculate Holland Code results from quiz answers
 * @param {Array} answers - Array of answer objects with 'code' property
 * @returns {Object} Results with top careers, scores, and Holland code
 */
export function calculateHollandResults(answers) {
  // Count each RIASEC code
  const riasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  answers.forEach(answer => {
    if (answer.code && riasecScores.hasOwnProperty(answer.code)) {
      riasecScores[answer.code]++;
    }
  });

  // Get top 3 codes for Holland Code
  const sortedCodes = Object.entries(riasecScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([code]) => code);
  
  const hollandCode = sortedCodes.join('');

  // Calculate match percentage for each career
  const careersWithScores = hollandCareers.map(career => {
    let matchScore = 0;
    
    // Give points for each matching letter in the Holland code
    for (let i = 0; i < career.code.length; i++) {
      const codeChar = career.code[i];
      if (riasecScores[codeChar]) {
        // Weight: first position = 3 points, second = 2, third = 1
        const weight = 3 - i;
        matchScore += riasecScores[codeChar] * weight;
      }
    }
    
    return {
      ...career,
      matchScore
    };
  });

  // Sort by match score
  careersWithScores.sort((a, b) => b.matchScore - a.matchScore);

  // Calculate percentage based on max possible score
  const maxScore = careersWithScores[0].matchScore;
  const careersWithPercentage = careersWithScores.map((career, index) => ({
    ...career,
    percentage: Math.round((career.matchScore / maxScore) * 100),
    rank: index + 1
  }));

  return {
    riasecScores,
    hollandCode,
    careers: careersWithPercentage,
    topMatch: careersWithPercentage[0]
  };
}