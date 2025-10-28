// lib/jobRoles.js - COMPREHENSIVE VERSION

export const jobRolesByField = {
  // TECHNOLOGY & ENGINEERING
  'Computer Science': [
    { value: 'software-developer', label: 'Software Developer' },
    { value: 'full-stack-developer', label: 'Full Stack Developer' },
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'mobile-developer', label: 'Mobile App Developer' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'ml-engineer', label: 'Machine Learning Engineer' },
    { value: 'ai-engineer', label: 'AI Engineer' },
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'cloud-architect', label: 'Cloud Architect' },
    { value: 'security-engineer', label: 'Cybersecurity Engineer' },
    { value: 'qa-engineer', label: 'QA/Test Engineer' },
    { value: 'game-developer', label: 'Game Developer' },
  ],
  
  'Mechanical Engineering': [
    { value: 'mechanical-engineer', label: 'Mechanical Engineer' },
    { value: 'automotive-engineer', label: 'Automotive Engineer' },
    { value: 'aerospace-engineer', label: 'Aerospace Engineer' },
    { value: 'hvac-engineer', label: 'HVAC Engineer' },
    { value: 'robotics-engineer', label: 'Robotics Engineer' },
    { value: 'manufacturing-engineer', label: 'Manufacturing Engineer' },
  ],
  
  'Civil Engineering': [
    { value: 'civil-engineer', label: 'Civil Engineer' },
    { value: 'structural-engineer', label: 'Structural Engineer' },
    { value: 'construction-manager', label: 'Construction Manager' },
    { value: 'urban-planner', label: 'Urban Planner' },
    { value: 'environmental-engineer', label: 'Environmental Engineer' },
  ],
  
  'Electrical Engineering': [
    { value: 'electrical-engineer', label: 'Electrical Engineer' },
    { value: 'electronics-engineer', label: 'Electronics Engineer' },
    { value: 'power-systems-engineer', label: 'Power Systems Engineer' },
    { value: 'control-systems-engineer', label: 'Control Systems Engineer' },
  ],

  // BUSINESS & MANAGEMENT
  'Business Administration': [
    { value: 'business-analyst', label: 'Business Analyst' },
    { value: 'management-consultant', label: 'Management Consultant' },
    { value: 'operations-manager', label: 'Operations Manager' },
    { value: 'project-manager', label: 'Project Manager' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'business-development', label: 'Business Development Manager' },
    { value: 'strategy-consultant', label: 'Strategy Consultant' },
    { value: 'entrepreneur', label: 'Entrepreneur/Startup Founder' },
  ],
  
  'Marketing': [
    { value: 'marketing-manager', label: 'Marketing Manager' },
    { value: 'digital-marketer', label: 'Digital Marketing Specialist' },
    { value: 'brand-manager', label: 'Brand Manager' },
    { value: 'social-media-manager', label: 'Social Media Manager' },
    { value: 'content-marketer', label: 'Content Marketing Manager' },
    { value: 'seo-specialist', label: 'SEO Specialist' },
    { value: 'growth-marketer', label: 'Growth Marketing Manager' },
  ],
  
  'Finance': [
    { value: 'financial-analyst', label: 'Financial Analyst' },
    { value: 'investment-banker', label: 'Investment Banker' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'financial-advisor', label: 'Financial Advisor' },
    { value: 'portfolio-manager', label: 'Portfolio Manager' },
    { value: 'risk-analyst', label: 'Risk Analyst' },
    { value: 'auditor', label: 'Auditor' },
  ],
  
  'Human Resources': [
    { value: 'hr-manager', label: 'HR Manager' },
    { value: 'talent-acquisition', label: 'Talent Acquisition Specialist' },
    { value: 'hr-analyst', label: 'HR Analyst' },
    { value: 'training-development', label: 'Training & Development Manager' },
    { value: 'compensation-analyst', label: 'Compensation & Benefits Analyst' },
  ],

  // HEALTHCARE & LIFE SCIENCES
  'Medicine': [
    { value: 'doctor', label: 'Medical Doctor' },
    { value: 'surgeon', label: 'Surgeon' },
    { value: 'psychiatrist', label: 'Psychiatrist' },
    { value: 'radiologist', label: 'Radiologist' },
    { value: 'emergency-physician', label: 'Emergency Physician' },
  ],
  
  'Nursing': [
    { value: 'registered-nurse', label: 'Registered Nurse' },
    { value: 'nurse-practitioner', label: 'Nurse Practitioner' },
    { value: 'clinical-nurse', label: 'Clinical Nurse Specialist' },
  ],
  
  'Pharmacy': [
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'clinical-pharmacist', label: 'Clinical Pharmacist' },
    { value: 'pharmaceutical-researcher', label: 'Pharmaceutical Researcher' },
  ],
  
  'Biotechnology': [
    { value: 'biotech-researcher', label: 'Biotechnology Researcher' },
    { value: 'bioinformatics', label: 'Bioinformatics Specialist' },
    { value: 'lab-technician', label: 'Laboratory Technician' },
  ],

  // CREATIVE & MEDIA
  'Graphic Design': [
    { value: 'graphic-designer', label: 'Graphic Designer' },
    { value: 'ui-designer', label: 'UI Designer' },
    { value: 'ux-designer', label: 'UX Designer' },
    { value: 'brand-designer', label: 'Brand Designer' },
    { value: 'motion-designer', label: 'Motion Graphics Designer' },
  ],
  
  'Journalism': [
    { value: 'journalist', label: 'Journalist' },
    { value: 'editor', label: 'Editor' },
    { value: 'content-writer', label: 'Content Writer' },
    { value: 'copywriter', label: 'Copywriter' },
    { value: 'technical-writer', label: 'Technical Writer' },
  ],
  
  'Film & Media': [
    { value: 'video-editor', label: 'Video Editor' },
    { value: 'film-director', label: 'Film Director' },
    { value: 'producer', label: 'Producer' },
    { value: 'cinematographer', label: 'Cinematographer' },
  ],

  // SCIENCE & RESEARCH
  'Physics': [
    { value: 'physicist', label: 'Physicist' },
    { value: 'research-scientist', label: 'Research Scientist' },
    { value: 'data-analyst', label: 'Data Analyst' },
  ],
  
  'Chemistry': [
    { value: 'chemist', label: 'Chemist' },
    { value: 'analytical-chemist', label: 'Analytical Chemist' },
    { value: 'chemical-engineer', label: 'Chemical Engineer' },
  ],
  
  'Environmental Science': [
    { value: 'environmental-scientist', label: 'Environmental Scientist' },
    { value: 'conservation-scientist', label: 'Conservation Scientist' },
    { value: 'sustainability-consultant', label: 'Sustainability Consultant' },
  ],

  // LAW & PUBLIC POLICY
  'Law': [
    { value: 'lawyer', label: 'Lawyer' },
    { value: 'corporate-lawyer', label: 'Corporate Lawyer' },
    { value: 'legal-advisor', label: 'Legal Advisor' },
    { value: 'paralegal', label: 'Paralegal' },
  ],
  
  'Public Policy': [
    { value: 'policy-analyst', label: 'Policy Analyst' },
    { value: 'public-affairs', label: 'Public Affairs Specialist' },
    { value: 'government-relations', label: 'Government Relations Manager' },
  ],

  // EDUCATION
  'Education': [
    { value: 'teacher', label: 'Teacher' },
    { value: 'professor', label: 'Professor/Lecturer' },
    { value: 'education-consultant', label: 'Education Consultant' },
    { value: 'curriculum-designer', label: 'Curriculum Designer' },
  ],

  // HOSPITALITY & TOURISM
  'Hospitality Management': [
    { value: 'hotel-manager', label: 'Hotel Manager' },
    { value: 'event-planner', label: 'Event Planner' },
    { value: 'restaurant-manager', label: 'Restaurant Manager' },
  ],

  // ARTS & ARCHITECTURE
  'Architecture': [
    { value: 'architect', label: 'Architect' },
    { value: 'interior-designer', label: 'Interior Designer' },
    { value: 'landscape-architect', label: 'Landscape Architect' },
  ],

  // DEFAULT (if field not found)
  'Other': [
    { value: 'general-analyst', label: 'Analyst' },
    { value: 'general-manager', label: 'Manager' },
    { value: 'general-consultant', label: 'Consultant' },
  ]
};

// Helper function to get job roles for a field with smart matching
export function getJobRolesForField(fieldOfStudy) {
  if (!fieldOfStudy) return jobRolesByField['Other'];
  
  const normalizedField = fieldOfStudy.toLowerCase().trim();
  
  // Try exact match first
  const exactMatch = Object.keys(jobRolesByField).find(
    key => key.toLowerCase() === normalizedField
  );
  if (exactMatch) {
    return jobRolesByField[exactMatch];
  }
  
  // Try partial match (e.g., "Computer" matches "Computer Science")
  const partialMatch = Object.keys(jobRolesByField).find(key => 
    key.toLowerCase().includes(normalizedField) ||
    normalizedField.includes(key.toLowerCase())
  );
  
  if (partialMatch) {
    return jobRolesByField[partialMatch];
  }
  
  // Try keyword matching for common abbreviations
  const keywordMap = {
    'cs': 'Computer Science',
    'it': 'Computer Science',
    'software eng': 'Software Engineering',
    'mech eng': 'Mechanical Engineering',
    'civil eng': 'Civil Engineering',
    'elec eng': 'Electrical Engineering',
    'ba': 'Business Administration',
    'biz': 'Business Administration',
    'hr': 'Human Resources',
    'comms': 'Journalism',
    'media': 'Film & Media',
  };
  
  for (const [abbr, fullName] of Object.entries(keywordMap)) {
    if (normalizedField.includes(abbr)) {
      return jobRolesByField[fullName] || jobRolesByField['Other'];
    }
  }
  
  // Return "Other" as fallback
  return jobRolesByField['Other'];
}