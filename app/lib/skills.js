// lib/skills.js - COMPREHENSIVE VERSION

export const skillsList = [
  // ===== TECHNOLOGY & SOFTWARE =====
  // Programming Languages
  { value: 'javascript', label: 'JavaScript', category: 'Programming' },
  { value: 'python', label: 'Python', category: 'Programming' },
  { value: 'java', label: 'Java', category: 'Programming' },
  { value: 'cpp', label: 'C++', category: 'Programming' },
  { value: 'csharp', label: 'C#', category: 'Programming' },
  { value: 'typescript', label: 'TypeScript', category: 'Programming' },
  { value: 'php', label: 'PHP', category: 'Programming' },
  { value: 'ruby', label: 'Ruby', category: 'Programming' },
  { value: 'go', label: 'Go', category: 'Programming' },
  { value: 'rust', label: 'Rust', category: 'Programming' },
  { value: 'swift', label: 'Swift', category: 'Programming' },
  { value: 'kotlin', label: 'Kotlin', category: 'Programming' },
  { value: 'r', label: 'R', category: 'Programming' },
  { value: 'matlab', label: 'MATLAB', category: 'Programming' },
  
  // Frontend
  { value: 'react', label: 'React', category: 'Frontend' },
  { value: 'vue', label: 'Vue.js', category: 'Frontend' },
  { value: 'angular', label: 'Angular', category: 'Frontend' },
  { value: 'html', label: 'HTML', category: 'Frontend' },
  { value: 'css', label: 'CSS', category: 'Frontend' },
  { value: 'tailwind', label: 'Tailwind CSS', category: 'Frontend' },
  { value: 'bootstrap', label: 'Bootstrap', category: 'Frontend' },
  { value: 'nextjs', label: 'Next.js', category: 'Frontend' },
  
  // Backend
  { value: 'nodejs', label: 'Node.js', category: 'Backend' },
  { value: 'express', label: 'Express.js', category: 'Backend' },
  { value: 'django', label: 'Django', category: 'Backend' },
  { value: 'flask', label: 'Flask', category: 'Backend' },
  { value: 'spring', label: 'Spring Boot', category: 'Backend' },
  { value: 'dotnet', label: '.NET', category: 'Backend' },
  
  // Database
  { value: 'sql', label: 'SQL', category: 'Database' },
  { value: 'mysql', label: 'MySQL', category: 'Database' },
  { value: 'postgresql', label: 'PostgreSQL', category: 'Database' },
  { value: 'mongodb', label: 'MongoDB', category: 'Database' },
  { value: 'redis', label: 'Redis', category: 'Database' },
  { value: 'oracle', label: 'Oracle Database', category: 'Database' },
  
  // Cloud & DevOps
  { value: 'aws', label: 'AWS', category: 'Cloud' },
  { value: 'azure', label: 'Azure', category: 'Cloud' },
  { value: 'gcp', label: 'Google Cloud', category: 'Cloud' },
  { value: 'docker', label: 'Docker', category: 'DevOps' },
  { value: 'kubernetes', label: 'Kubernetes', category: 'DevOps' },
  { value: 'ci-cd', label: 'CI/CD', category: 'DevOps' },
  { value: 'terraform', label: 'Terraform', category: 'DevOps' },
  
  // Tools
  { value: 'git', label: 'Git', category: 'Tools' },
  { value: 'github', label: 'GitHub', category: 'Tools' },
  { value: 'jira', label: 'Jira', category: 'Tools' },
  { value: 'linux', label: 'Linux', category: 'Tools' },

  // ===== DATA & ANALYTICS =====
  { value: 'data-analysis', label: 'Data Analysis', category: 'Data' },
  { value: 'excel', label: 'Microsoft Excel', category: 'Data' },
  { value: 'tableau', label: 'Tableau', category: 'Data' },
  { value: 'power-bi', label: 'Power BI', category: 'Data' },
  { value: 'pandas', label: 'Pandas', category: 'Data' },
  { value: 'numpy', label: 'NumPy', category: 'Data' },
  { value: 'statistics', label: 'Statistics', category: 'Data' },
  { value: 'data-visualization', label: 'Data Visualization', category: 'Data' },
  { value: 'machine-learning', label: 'Machine Learning', category: 'Data' },
  { value: 'deep-learning', label: 'Deep Learning', category: 'Data' },
  { value: 'tensorflow', label: 'TensorFlow', category: 'Data' },
  { value: 'pytorch', label: 'PyTorch', category: 'Data' },
  { value: 'nlp', label: 'Natural Language Processing', category: 'Data' },

  // ===== BUSINESS & MANAGEMENT =====
  { value: 'project-management', label: 'Project Management', category: 'Business' },
  { value: 'agile', label: 'Agile Methodology', category: 'Business' },
  { value: 'scrum', label: 'Scrum', category: 'Business' },
  { value: 'business-analysis', label: 'Business Analysis', category: 'Business' },
  { value: 'strategic-planning', label: 'Strategic Planning', category: 'Business' },
  { value: 'financial-analysis', label: 'Financial Analysis', category: 'Business' },
  { value: 'budgeting', label: 'Budgeting', category: 'Business' },
  { value: 'forecasting', label: 'Forecasting', category: 'Business' },
  { value: 'market-research', label: 'Market Research', category: 'Business' },
  { value: 'competitive-analysis', label: 'Competitive Analysis', category: 'Business' },
  { value: 'risk-management', label: 'Risk Management', category: 'Business' },
  { value: 'change-management', label: 'Change Management', category: 'Business' },

  // ===== FINANCE & ACCOUNTING =====
  { value: 'accounting', label: 'Accounting', category: 'Finance' },
  { value: 'financial-modeling', label: 'Financial Modeling', category: 'Finance' },
  { value: 'quickbooks', label: 'QuickBooks', category: 'Finance' },
  { value: 'sap', label: 'SAP', category: 'Finance' },
  { value: 'auditing', label: 'Auditing', category: 'Finance' },
  { value: 'tax-preparation', label: 'Tax Preparation', category: 'Finance' },
  { value: 'investment-analysis', label: 'Investment Analysis', category: 'Finance' },
  { value: 'portfolio-management', label: 'Portfolio Management', category: 'Finance' },

  // ===== MARKETING & SALES =====
  { value: 'digital-marketing', label: 'Digital Marketing', category: 'Marketing' },
  { value: 'seo', label: 'SEO', category: 'Marketing' },
  { value: 'sem', label: 'SEM/PPC', category: 'Marketing' },
  { value: 'content-marketing', label: 'Content Marketing', category: 'Marketing' },
  { value: 'social-media', label: 'Social Media Marketing', category: 'Marketing' },
  { value: 'email-marketing', label: 'Email Marketing', category: 'Marketing' },
  { value: 'google-analytics', label: 'Google Analytics', category: 'Marketing' },
  { value: 'copywriting', label: 'Copywriting', category: 'Marketing' },
  { value: 'brand-management', label: 'Brand Management', category: 'Marketing' },
  { value: 'salesforce', label: 'Salesforce', category: 'Sales' },
  { value: 'crm', label: 'CRM', category: 'Sales' },
  { value: 'sales-strategy', label: 'Sales Strategy', category: 'Sales' },
  { value: 'negotiation', label: 'Negotiation', category: 'Sales' },

  // ===== DESIGN & CREATIVE =====
  { value: 'photoshop', label: 'Adobe Photoshop', category: 'Design' },
  { value: 'illustrator', label: 'Adobe Illustrator', category: 'Design' },
  { value: 'figma', label: 'Figma', category: 'Design' },
  { value: 'sketch', label: 'Sketch', category: 'Design' },
  { value: 'indesign', label: 'Adobe InDesign', category: 'Design' },
  { value: 'ui-design', label: 'UI Design', category: 'Design' },
  { value: 'ux-design', label: 'UX Design', category: 'Design' },
  { value: 'graphic-design', label: 'Graphic Design', category: 'Design' },
  { value: 'video-editing', label: 'Video Editing', category: 'Design' },
  { value: 'premiere-pro', label: 'Adobe Premiere Pro', category: 'Design' },
  { value: 'after-effects', label: 'Adobe After Effects', category: 'Design' },
  { value: '3d-modeling', label: '3D Modeling', category: 'Design' },
  { value: 'animation', label: 'Animation', category: 'Design' },

  // ===== ENGINEERING =====
  { value: 'cad', label: 'CAD', category: 'Engineering' },
  { value: 'autocad', label: 'AutoCAD', category: 'Engineering' },
  { value: 'solidworks', label: 'SolidWorks', category: 'Engineering' },
  { value: 'mechanical-design', label: 'Mechanical Design', category: 'Engineering' },
  { value: 'electrical-engineering', label: 'Electrical Engineering', category: 'Engineering' },
  { value: 'circuit-design', label: 'Circuit Design', category: 'Engineering' },
  { value: 'plc-programming', label: 'PLC Programming', category: 'Engineering' },
  { value: 'quality-control', label: 'Quality Control', category: 'Engineering' },
  { value: 'lean-manufacturing', label: 'Lean Manufacturing', category: 'Engineering' },
  { value: 'six-sigma', label: 'Six Sigma', category: 'Engineering' },

  // ===== HEALTHCARE =====
  { value: 'patient-care', label: 'Patient Care', category: 'Healthcare' },
  { value: 'medical-terminology', label: 'Medical Terminology', category: 'Healthcare' },
  { value: 'clinical-research', label: 'Clinical Research', category: 'Healthcare' },
  { value: 'emr', label: 'Electronic Medical Records', category: 'Healthcare' },
  { value: 'pharmacology', label: 'Pharmacology', category: 'Healthcare' },
  { value: 'diagnostics', label: 'Diagnostics', category: 'Healthcare' },

  // ===== SOFT SKILLS =====
  { value: 'communication', label: 'Communication', category: 'Soft Skills' },
  { value: 'leadership', label: 'Leadership', category: 'Soft Skills' },
  { value: 'teamwork', label: 'Teamwork', category: 'Soft Skills' },
  { value: 'problem-solving', label: 'Problem Solving', category: 'Soft Skills' },
  { value: 'critical-thinking', label: 'Critical Thinking', category: 'Soft Skills' },
  { value: 'time-management', label: 'Time Management', category: 'Soft Skills' },
  { value: 'presentation', label: 'Presentation Skills', category: 'Soft Skills' },
  { value: 'public-speaking', label: 'Public Speaking', category: 'Soft Skills' },
  { value: 'writing', label: 'Writing', category: 'Soft Skills' },
  { value: 'research', label: 'Research', category: 'Soft Skills' },
  { value: 'analytical-thinking', label: 'Analytical Thinking', category: 'Soft Skills' },

  // ===== LANGUAGES =====
  { value: 'english', label: 'English', category: 'Languages' },
  { value: 'mandarin', label: 'Mandarin Chinese', category: 'Languages' },
  { value: 'spanish', label: 'Spanish', category: 'Languages' },
  { value: 'french', label: 'French', category: 'Languages' },
  { value: 'german', label: 'German', category: 'Languages' },
  { value: 'japanese', label: 'Japanese', category: 'Languages' },
  { value: 'korean', label: 'Korean', category: 'Languages' },
  { value: 'arabic', label: 'Arabic', category: 'Languages' },
  { value: 'malay', label: 'Bahasa Melayu', category: 'Languages' },

  // ===== LAW & COMPLIANCE =====
  { value: 'legal-research', label: 'Legal Research', category: 'Law' },
  { value: 'contract-law', label: 'Contract Law', category: 'Law' },
  { value: 'compliance', label: 'Compliance', category: 'Law' },
  { value: 'regulatory-affairs', label: 'Regulatory Affairs', category: 'Law' },
  { value: 'intellectual-property', label: 'Intellectual Property', category: 'Law' },

  // ===== EDUCATION =====
  { value: 'curriculum-development', label: 'Curriculum Development', category: 'Education' },
  { value: 'instructional-design', label: 'Instructional Design', category: 'Education' },
  { value: 'classroom-management', label: 'Classroom Management', category: 'Education' },
  { value: 'e-learning', label: 'E-Learning', category: 'Education' },

  // ===== OTHER =====
  { value: 'customer-service', label: 'Customer Service', category: 'Other' },
  { value: 'event-planning', label: 'Event Planning', category: 'Other' },
  { value: 'supply-chain', label: 'Supply Chain Management', category: 'Other' },
  { value: 'logistics', label: 'Logistics', category: 'Other' },
  { value: 'procurement', label: 'Procurement', category: 'Other' },
];