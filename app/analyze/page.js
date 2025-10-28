'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { fetchUniversitiesByCountry, countryNameMap } from '../lib/universities';
import { skillsList } from '../lib/skills';
import { getJobRolesForField } from '../lib/jobRoles';
import { countries } from '../lib/countries';
import ResumeUpload from '../components/ResumeUpload';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function AnalyzePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    // Basic Info
    country: null,
    university: null,
    manualUniversity: '',
    educationLevel: '',
    course: '',
    graduationDate: '',
    gpa: '',
    
    // Skills & Experience
    skills: [],
    technicalSkills: [],
    softSkills: [],
    certifications: '',
    projects: '',
    internships: '',
    
    // Career Goals
    targetRole: null,
    alternativeRoles: [],
    careerMotivation: '',
    workPreference: '',
    timeline: '6',
    
    // Work Preferences (NEW - Professional additions)
    workEnvironment: '',
    workStyle: '',
    careerPriority: [],
    industryPreference: [],
    companySize: '',
    willingToRelocate: '',
    
    // Current Status
    experience: '',
    currentlyEmployed: '',
    jobSearchStatus: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [availableUniversities, setAvailableUniversities] = useState([]);
  const [availableJobRoles, setAvailableJobRoles] = useState([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // ... (keep all your existing useEffects and functions) ...

  useEffect(() => {
    if (formData.country) {
      loadUniversities(formData.country.value);
      setFormData(prev => ({ 
        ...prev, 
        university: null,
        manualUniversity: ''
      }));
      setUseManualEntry(false);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.course) {
      const roles = getJobRolesForField(formData.course);
      setAvailableJobRoles(roles);
    }
  }, [formData.course]);

  const loadUniversities = async (countryCode) => {
    setLoadingUniversities(true);
    try {
      const countryName = countryNameMap[countryCode];
      if (!countryName) {
        console.error('Country name not found for code:', countryCode);
        setAvailableUniversities([]);
        return;
      }

      const universities = await fetchUniversitiesByCountry(countryName);
      setAvailableUniversities(universities);
      
      if (universities.length === 0) {
        console.warn('No universities found, switching to manual entry');
        setUseManualEntry(true);
      }
    } catch (error) {
      console.error('Error loading universities:', error);
      setAvailableUniversities([]);
      setUseManualEntry(true);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const universityName = useManualEntry 
        ? formData.manualUniversity 
        : formData.university?.label;

      if (!universityName) {
        alert('Please select or enter your university');
        setLoading(false);
        return;
      }

      const payload = {
        // Basic info
        country: formData.country?.label,
        university: universityName,
        educationLevel: formData.educationLevel,
        course: formData.course,
        graduationDate: formData.graduationDate,
        gpa: formData.gpa,
        
        // Skills
        currentSkills: formData.skills.map(s => s.label).join(', '),
        technicalSkills: formData.technicalSkills.map(s => s.label).join(', '),
        softSkills: formData.softSkills.map(s => s.label).join(', '),
        certifications: formData.certifications,
        
        // Experience
        projects: formData.projects,
        internships: formData.internships,
        experience: formData.experience,
        currentlyEmployed: formData.currentlyEmployed,
        
        // Career goals
        targetRole: formData.targetRole?.label,
        alternativeRoles: formData.alternativeRoles.map(r => r.label).join(', '),
        careerMotivation: formData.careerMotivation,
        timeline: formData.timeline,
        
        // Preferences
        workEnvironment: formData.workEnvironment,
        workStyle: formData.workStyle,
        careerPriorities: formData.careerPriority.map(p => p.label).join(', '),
        industryPreferences: formData.industryPreference.map(i => i.label).join(', '),
        companySize: formData.companySize,
        willingToRelocate: formData.willingToRelocate,
        jobSearchStatus: formData.jobSearchStatus
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      sessionStorage.setItem('careerAnalysis', JSON.stringify(data));
      router.push('/results');
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      padding: '8px',
      borderColor: '#d1d5db',
      '&:hover': { borderColor: '#2563eb' },
    }),
  };

  // Career priority options
  const careerPriorities = [
    { value: 'high-salary', label: 'High Salary' },
    { value: 'work-life-balance', label: 'Work-Life Balance' },
    { value: 'career-growth', label: 'Career Growth Opportunities' },
    { value: 'job-security', label: 'Job Security' },
    { value: 'meaningful-work', label: 'Meaningful Impact' },
    { value: 'innovation', label: 'Innovation & Creativity' },
    { value: 'leadership', label: 'Leadership Opportunities' },
    { value: 'flexibility', label: 'Flexible Work Arrangements' }
  ];

  // Industry preferences
  const industries = [
    { value: 'tech', label: 'Technology/Software' },
    { value: 'finance', label: 'Finance/Banking' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'retail', label: 'E-commerce/Retail' },
    { value: 'media', label: 'Media/Entertainment' },
    { value: 'government', label: 'Government/Non-profit' },
    { value: 'manufacturing', label: 'Manufacturing/Engineering' }
  ];

  // Soft skills options
  const softSkillsList = [
    { value: 'communication', label: 'Communication' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'teamwork', label: 'Teamwork' },
    { value: 'problem-solving', label: 'Problem Solving' },
    { value: 'time-management', label: 'Time Management' },
    { value: 'adaptability', label: 'Adaptability' },
    { value: 'critical-thinking', label: 'Critical Thinking' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'emotional-intelligence', label: 'Emotional Intelligence' },
    { value: 'presentation', label: 'Presentation Skills' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mb-4">
        <Link href="/" className="text-blue-700 hover:text-blue-800 font-medium">
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Career Assessment
          </h1>
          <p className="text-gray-600 mb-6">
            Complete all sections for the most accurate career roadmap
          </p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step <= currentStep 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-700' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span className={currentStep === 1 ? 'font-semibold text-blue-700' : ''}>Education</span>
            <span className={currentStep === 2 ? 'font-semibold text-blue-700' : ''}>Skills & Experience</span>
            <span className={currentStep === 3 ? 'font-semibold text-blue-700' : ''}>Career Goals</span>
            <span className={currentStep === 4 ? 'font-semibold text-blue-700' : ''}>Preferences</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* STEP 1: EDUCATION BACKGROUND */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Education Background</h2>
              
              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country *
                </label>
                <Select
                  instanceId="country-select"
                  options={countries}
                  value={formData.country}
                  onChange={(selected) => setFormData({...formData, country: selected})}
                  styles={customSelectStyles}
                  placeholder="Select your country..."
                  formatOptionLabel={(option) => (
                    <div className="flex items-center">
                      <span className="mr-2">{option.flag}</span>
                      {option.label}
                    </div>
                  )}
                  required
                />
              </div>

              {/* University */}
              {formData.country && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    University *
                  </label>
                  
                  {loadingUniversities ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                      <span className="ml-3 text-gray-600">Loading universities...</span>
                    </div>
                  ) : (
                    <>
                      {!useManualEntry ? (
                        <>
                          <Select
                            instanceId="university-select"
                            options={availableUniversities}
                            value={formData.university}
                            onChange={(selected) => setFormData({...formData, university: selected})}
                            styles={customSelectStyles}
                            placeholder={availableUniversities.length === 0 ? "No universities found" : `Search from ${availableUniversities.length} universities...`}
                            isSearchable
                            isDisabled={availableUniversities.length === 0}
                          />
                          <button
                            type="button"
                            onClick={() => setUseManualEntry(true)}
                            className="mt-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
                          >
                            Can't find your university? Enter manually →
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder="Type your university name..."
                            value={formData.manualUniversity}
                            onChange={(e) => setFormData({...formData, manualUniversity: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required={useManualEntry}
                          />
                          {availableUniversities.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setUseManualEntry(false);
                                setFormData({...formData, manualUniversity: ''});
                              }}
                              className="mt-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
                            >
                              ← Back to search
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Education Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Education Level *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Foundation', 'Bachelor', 'Master'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, educationLevel: level})}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                        formData.educationLevel === level
                          ? 'border-blue-700 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field of Study */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Computer Science, Business Administration, Psychology"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* NEW: Expected Graduation */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Graduation Date
                  </label>
                  <input
                    type="month"
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({...formData, graduationDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Helps calculate realistic timelines</p>
                </div>

                {/* NEW: GPA */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GPA / Academic Standing (Optional)
                  </label>
                  <select
                    value={formData.gpa}
                    onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="3.5+">3.5+ / First Class</option>
                    <option value="3.0-3.5">3.0-3.5 / Upper Second Class</option>
                    <option value="2.5-3.0">2.5-3.0 / Lower Second Class</option>
                    <option value="2.0-2.5">2.0-2.5 / Third Class</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Affects company targeting strategy</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS & EXPERIENCE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💼 Skills & Experience</h2>

            
              <div className="mb-8">
                <ResumeUpload 
                targetRole={formData.targetRole?.label || formData.course}
                onAnalysisComplete={(analysis) => {
                    console.log('Resume analysis:', analysis);
                    // Optionally auto-fill skills from resume
                    if (analysis.extractedData?.technicalSkills) {
                    // You can pre-populate skills here
                    }
                }}
                />
            </div>
            
              {/* Technical Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technical Skills *
                </label>
                <Select
                  instanceId="tech-skills-select"
                  isMulti
                  options={skillsList.filter(s => 
                    ['Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Tools', 'Data'].includes(s.category)
                  )}
                  value={formData.technicalSkills}
                  onChange={(selected) => setFormData({...formData, technicalSkills: selected})}
                  styles={customSelectStyles}
                  placeholder="Select your technical skills..."
                />
                <p className="text-xs text-gray-500 mt-1">Programming languages, tools, frameworks</p>
              </div>

              {/* Soft Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Soft Skills (Select top 3-5) *
                </label>
                <Select
                  instanceId="soft-skills-select"
                  isMulti
                  options={softSkillsList}
                  value={formData.softSkills}
                  onChange={(selected) => setFormData({...formData, softSkills: selected.slice(0, 5)})}
                  styles={customSelectStyles}
                  placeholder="Leadership, Communication, Problem-Solving..."
                />
                <p className="text-xs text-gray-500 mt-1">Maximum 5 skills</p>
              </div>

              {/* NEW: Certifications */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certifications (Optional)
                </label>
                <textarea
                  placeholder="e.g., AWS Certified, Google Analytics Certified, PMP..."
                  value={formData.certifications}
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
                <p className="text-xs text-gray-500 mt-1">List any professional certifications</p>
              </div>

              {/* NEW: Projects */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notable Projects (Optional but Recommended)
                </label>
                <textarea
                  placeholder="Briefly describe 1-3 significant projects you've built..."
                  value={formData.projects}
                  onChange={(e) => setFormData({...formData, projects: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <p className="text-xs text-gray-500 mt-1">Helps AI recommend relevant portfolio projects</p>
              </div>

              {/* NEW: Internships/Work Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Internships / Work Experience *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="none">No experience</option>
                  <option value="1-intern">1 internship (2-3 months)</option>
                  <option value="2-intern">2+ internships (6+ months total)</option>
                  <option value="part-time">Part-time work (6+ months)</option>
                  <option value="1-year">1 year full-time</option>
                  <option value="2-year">2+ years full-time</option>
                </select>
              </div>

              {/* NEW: Currently Employed */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Employment Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'student', label: 'Full-time Student' },
                    { value: 'student-working', label: 'Student + Part-time Job' },
                    { value: 'employed', label: 'Currently Employed' },
                    { value: 'unemployed', label: 'Seeking Opportunities' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, currentlyEmployed: option.value})}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                        formData.currentlyEmployed === option.value
                          ? 'border-blue-700 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CAREER GOALS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Career Goals</h2>

              {/* Target Role */}
              {formData.course && availableJobRoles.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Target Role *
                  </label>
                  <Select
                    instanceId="target-role-select"
                    options={availableJobRoles}
                    value={formData.targetRole}
                    onChange={(selected) => setFormData({...formData, targetRole: selected})}
                    styles={customSelectStyles}
                    placeholder="What's your dream job?"
                    required
                  />
                </div>
              )}

              {/* NEW: Alternative Roles */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alternative Roles (Optional)
                </label>
                <Select
                  instanceId="alt-roles-select"
                  isMulti
                  options={availableJobRoles.filter(r => r.value !== formData.targetRole?.value)}
                  value={formData.alternativeRoles}
                  onChange={(selected) => setFormData({...formData, alternativeRoles: selected.slice(0, 3)})}
                  styles={customSelectStyles}
                  placeholder="Select 1-3 backup options..."
                />
                <p className="text-xs text-gray-500 mt-1">Helps create a broader career strategy</p>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timeline to Job-Ready *
                </label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {[3, 6, 9, 12].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setFormData({...formData, timeline: months.toString()})}
                      className={`py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                        formData.timeline === months.toString()
                          ? 'border-blue-700 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {months}mo
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Custom:</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={formData.timeline}
                    onChange={(e) => {
                      const value = Math.min(24, Math.max(1, parseInt(e.target.value) || 3));
                      setFormData({...formData, timeline: value.toString()});
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">months</span>
                </div>
              </div>

              {/* NEW: Career Motivation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What motivates you most in your career? *
                </label>
                <textarea
                  placeholder="e.g., 'I want to build products that help people' or 'I'm passionate about solving complex problems with data'"
                  value={formData.careerMotivation}
                  onChange={(e) => setFormData({...formData, careerMotivation: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This helps personalize your learning path</p>
              </div>

              {/* NEW: Job Search Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Job Search Status *
                </label>
                <select
                  value={formData.jobSearchStatus}
                  onChange={(e) => setFormData({...formData, jobSearchStatus: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="exploring">Just exploring options</option>
                  <option value="preparing">Preparing to apply (3-6 months)</option>
                  <option value="active">Actively applying now</option>
                  <option value="interviews">Currently interviewing</option>
                  <option value="employed">Employed, planning transition</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: WORK PREFERENCES */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Work Preferences</h2>

              {/* NEW: Career Priorities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What matters most to you? (Select top 3) *
                </label>
                <Select
                  instanceId="priorities-select"
                  isMulti
                  options={careerPriorities}
                  value={formData.careerPriority}
                  onChange={(selected) => setFormData({...formData, careerPriority: selected.slice(0, 3)})}
                  styles={customSelectStyles}
                  placeholder="High salary, Work-life balance, Growth..."
                />
                <p className="text-xs text-gray-500 mt-1">Choose up to 3 priorities</p>
              </div>

              {/* NEW: Industry Preference */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Industries (Select 1-3)
                </label>
                <Select
                  instanceId="industry-select"
                  isMulti
                  options={industries}
                  value={formData.industryPreference}
                  onChange={(selected) => setFormData({...formData, industryPreference: selected.slice(0, 3)})}
                  styles={customSelectStyles}
                  placeholder="Tech, Finance, Healthcare..."
                />
              </div>

              {/* NEW: Work Environment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Work Environment *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'office', label: '🏢 Office/Corporate' },
                    { value: 'remote', label: '🏠 Remote/Work from Home' },
                    { value: 'hybrid', label: '🔄 Hybrid (Mix of both)' },
                    { value: 'flexible', label: '✨ No preference/Flexible' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, workEnvironment: option.value})}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                        formData.workEnvironment === option.value
                          ? 'border-blue-700 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* NEW: Company Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Company Size *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'startup', label: '🚀 Startup (1-50 employees)' },
                    { value: 'scaleup', label: '📈 Scale-up (51-500)' },
                    { value: 'enterprise', label: '🏢 Enterprise (500+)' },
                    { value: 'any', label: '✨ Any size' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, companySize: option.value})}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                        formData.companySize === option.value
                          ? 'border-blue-700 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* NEW: Willing to Relocate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Willing to relocate for the right opportunity? *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'yes', label: 'Yes, anywhere' },
                    { value: 'maybe', label: 'Within my country' },
                    { value: 'no', label: 'Prefer to stay local' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, willingToRelocate: option.value})}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                        formData.willingToRelocate === option.value
                          ? 'border-blue-700 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Affects job targeting and salary expectations</p>
              </div>

              {/* NEW: Work Style */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How do you prefer to work? *
                </label>
                <select
                  value={formData.workStyle}
                  onChange={(e) => setFormData({...formData, workStyle: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="independent">Independently with autonomy</option>
                  <option value="collaborative">Collaboratively in teams</option>
                  <option value="leadership">Leading and managing others</option>
                  <option value="hybrid">Mix of independent and team work</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Analyzing with AI...' : 'Generate My Roadmap →'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-900">AI is analyzing your comprehensive profile...</p>
            <p className="text-gray-600 mt-2">This may take 15-20 seconds</p>
            <p className="text-sm text-gray-500 mt-4">Generating personalized roadmap based on your preferences</p>
          </div>
        </div>
      )}
    </div>
  );
}