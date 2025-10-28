'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, ExternalLink, Brain, TrendingUp, CheckCircle, X, Award } from 'lucide-react';
import AIChatbot from '../components/AIChatbot';
import { hollandQuestions, calculateHollandResults, getRIASECDescription } from '../lib/quizData';


export default function ResultsPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    console.log('🔍 Results page mounted, checking for data...');
    
    try {
      const storedData = sessionStorage.getItem('careerAnalysis');
      
      if (!storedData) {
        console.error('❌ No data in sessionStorage');
        setError('No analysis data found. Please complete the form first.');
        setLoading(false);
        setTimeout(() => router.push('/analyze'), 3000);
        return;
      }

      const parsed = JSON.parse(storedData);
      
      if (!parsed.success || !parsed.data) {
        throw new Error('Invalid data structure');
      }

      setAnalysisData(parsed);
      
      // Load progress from localStorage
      const savedProgress = localStorage.getItem('roadmapProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading analysis data:', err);
      setError('Failed to load analysis data. Redirecting...');
      setLoading(false);
      setTimeout(() => router.push('/analyze'), 3000);
    }
  }, [router]);

  const handleQuizAnswer = (option) => {
    const newAnswers = [...quizAnswers, option];
    setQuizAnswers(newAnswers);
    
    if (quizStep < hollandQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      calculateQuizResult(newAnswers);
    }
  };

  const calculateQuizResult = (allAnswers) => {
    const result = calculateHollandResults(allAnswers);
    setQuizResult(result);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const toggleProgress = (monthId) => {
    const newProgress = { ...progress, [monthId]: !progress[monthId] };
    setProgress(newProgress);
    localStorage.setItem('roadmapProgress', JSON.stringify(newProgress));
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-900">Loading your career roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 text-center max-w-md shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/analyze"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
          >
            Go Back to Form
          </Link>
        </div>
      </div>
    );
  }

  const { data, metadata, liveJobs, jobBoards, platformSearchLinks, companyJobListings, resumeAnalysis } = analysisData;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalMonths = data.learningPath.length;
  const progressPercentage = (completedCount / totalMonths) * 100;
  
  // Check if resume analysis exists
  const hasResumeAnalysis = resumeAnalysis && Object.keys(resumeAnalysis).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* PROFESSIONAL PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body, .bg-gray-50 { background: white !important; }
          
          @page {
            margin: 1.5cm;
            @bottom-right {
              content: "Page " counter(page);
              font-size: 10px;
              color: #666;
            }
            @top-center {
              content: "CAREER DEVELOPMENT ROADMAP - CONFIDENTIAL";
              font-size: 10px;
              color: #666;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
          }
          
          .print-cover::before {
            content: "";
            display: block;
            page-break-after: always;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            border: 3px solid #1e40af;
          }
          
          .report-header h1 {
            font-size: 32px;
            color: #1e40af;
            margin-bottom: 10px;
          }
          
          .bg-white {
            page-break-inside: avoid;
            margin-bottom: 20px !important;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
          
          h2 {
            color: #1e40af !important;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 8px;
            margin-top: 25px;
          }
          
          .bg-gradient-to-r { background: #1e40af !important; color: white !important; }
          .professional-header { background: white !important; border: 3px solid #1e40af !important; }
          .professional-header * { color: #1e40af !important; }
        }
        
        .professional-header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        }
      `}</style>

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link href="/analyze" className="text-blue-700 hover:text-blue-800 font-medium">
          ← Start New Analysis
        </Link>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            <Brain className="w-5 h-5" />
            Career Fit Test
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Save as PDF
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto print-cover">
        {/* PROFESSIONAL NAVY BLUE HEADER */}
        <div className="professional-header rounded-lg shadow-xl p-8 mb-8 text-white report-header">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Career Development Roadmap</h1>
              <p className="text-blue-100 text-lg">
                Personalized plan for {metadata.targetRole}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm opacity-90">Timeline</p>
                <p className="text-3xl font-bold">{metadata.timeline}</p>
                <p className="text-sm">months</p>
              </div>
            </div>
          </div>
          
          {/* Executive Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm opacity-90 mb-1">Target Role</p>
                <p className="text-lg font-semibold">{metadata.targetRole}</p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Location</p>
                <p className="text-lg font-semibold">{metadata.country}</p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Education</p>
                <p className="text-lg font-semibold">{metadata.educationLevel}</p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Field</p>
                <p className="text-lg font-semibold">{metadata.course}</p>
              </div>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.skillsGap.needToLearn.length}</p>
              <p className="text-sm opacity-90">Skills to Learn</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.portfolioProjects.length}</p>
              <p className="text-sm opacity-90">Portfolio Projects</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.marketInsights.demandLevel}</p>
              <p className="text-sm opacity-90">Market Demand</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-xl font-bold">{data.marketInsights.avgSalary.split(' ').slice(0, 2).join(' ')}</p>
              <p className="text-xs opacity-90">Avg Salary</p>
            </div>
          </div>
        </div>

        {/* Career Personality Quiz Modal */}
        {showQuiz && (
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8 border-2 border-purple-500 print:hidden">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                <div>
                <h3 className="text-2xl font-bold text-gray-900">Career Fit Assessment</h3>
                <p className="text-gray-600">
                    {quizResult ? 'Your Results' : `Based on Holland Code (RIASEC) - Question ${quizStep + 1}/${hollandQuestions.length}`}
                </p>
                </div>
            </div>
            <button onClick={() => setShowQuiz(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
            </button>
            </div>

            {!quizResult ? (
            <>
                {/* Progress */}
                <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {quizStep + 1} of {hollandQuestions.length}</span>
                    <span>{Math.round(((quizStep + 1) / hollandQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((quizStep + 1) / hollandQuestions.length) * 100}%` }}
                    ></div>
                </div>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {hollandQuestions[quizStep].category}
                </span>
                </div>

                {/* Question */}
                <div>
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-600">
                    <h4 className="text-xl font-bold text-gray-900">
                    {hollandQuestions[quizStep].question}
                    </h4>
                </div>

                <div className="space-y-3">
                    {hollandQuestions[quizStep].options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleQuizAnswer(option)}
                        className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 group-hover:text-purple-700">
                            {option.text}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-mono">
                            {option.code}
                        </span>
                        </div>
                    </button>
                    ))}
                </div>
                </div>

                {/* Navigation */}
                {quizStep > 0 && (
                <button
                    onClick={() => {
                    setQuizStep(quizStep - 1);
                    setQuizAnswers(quizAnswers.slice(0, -1));
                    }}
                    className="mt-6 text-purple-700 hover:text-purple-800 font-medium"
                >
                    ← Previous Question
                </button>
                )}
            </>
            ) : (
            <div>
                {/* Show Holland Code */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-blue-700" />
                    <span className="font-bold text-blue-900">Your Holland Code: {quizResult.hollandCode}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {Object.entries(quizResult.riasecScores)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([code, score]) => {
                        const info = getRIASECDescription(code);
                        const maxScore = Math.max(...Object.values(quizResult.riasecScores));
                        const percentage = Math.round((score / maxScore) * 100);
                        
                        return (
                        <div key={code} className="bg-white rounded-lg p-3 border">
                            <p className="text-lg font-bold text-blue-700">{code} - {percentage}%</p>
                            <p className="text-xs text-gray-600">{info.name}</p>
                        </div>
                        );
                    })}
                </div>
                </div>

                <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Top 10 Career Matches 🎯
                </h4>

                <div className="space-y-3 mb-6">
                {quizResult.careers.slice(0, 10).map((match, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            idx === 0 ? 'bg-yellow-500' :
                            idx === 1 ? 'bg-gray-400' :
                            idx === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                            {match.rank}
                        </div>
                        <span className="text-2xl">{match.icon}</span>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900">{match.role}</p>
                            {match.role === metadata.targetRole && (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                Your Choice ✓
                                </span>
                            )}
                            </div>
                            <p className="text-xs text-gray-600">{match.description}</p>
                        </div>
                        </div>
                        <div className="text-right ml-4">
                        <p className="text-xl font-bold text-blue-700">{match.percentage}%</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${match.percentage}%` }}
                        ></div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Match Analysis */}
                {quizResult.topMatch.role === metadata.targetRole ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center mb-4">
                    <p className="text-2xl font-bold text-green-700 mb-2">🎉 Excellent Match!</p>
                    <p className="text-gray-700">
                    {metadata.targetRole} is your top personality match. You're on the perfect path!
                    </p>
                </div>
                ) : (
                <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 mb-4">
                    <p className="text-lg font-bold text-yellow-900 mb-2">💡 Worth Considering:</p>
                    <p className="text-gray-700 mb-3">
                    Your personality best matches <strong>{quizResult.topMatch.role}</strong> ({quizResult.topMatch.percentage}%) 
                    compared to {quizResult.careers.find(c => c.role === metadata.targetRole)?.percentage || 'N/A'}% for {metadata.targetRole}.
                    </p>
                    <p className="text-sm text-gray-600">
                    Both are valid choices! Your current path can still be successful with dedication.
                    </p>
                </div>
                )}

                <div className="flex gap-3">
                <button
                    onClick={resetQuiz}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                    Retake Quiz
                </button>
                <Link
                    href="/quiz"
                    className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-center"
                >
                    View Full Report
                </Link>
                </div>
            </div>
            )}
        </div>
        )}

        {/* Progress Tracker */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 print:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Your Learning Progress
            </h3>
            <span className="text-2xl font-bold text-blue-700">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {completedCount} of {totalMonths} months completed • {totalMonths - completedCount} remaining
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 print:hidden">
          <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid md:grid-cols-4 gap-3">
            {hasResumeAnalysis && <a href="#resume-analysis" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">📄 Resume Analysis</a>}
            <a href="#skills-gap" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">📊 Skills Gap</a>
            <a href="#learning-path" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">📚 Learning Path</a>
            <a href="#projects" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">💼 Projects</a>
            <a href="#market" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">📈 Market Insights</a>
            <a href="#jobs" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">🎯 Live Jobs</a>
            <a href="#resources" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">🔍 Resources</a>
            <a href="#interview" className="text-sm text-blue-700 hover:text-blue-800 hover:underline">🎤 Interview Prep</a>
          </div>
        </div>

        {/* Resume Analysis Section */}
        {hasResumeAnalysis && (
          <div id="resume-analysis" className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📄 Resume Analysis Report</h2>
            
            {/* ATS Score Card */}
            <div className={`rounded-lg p-6 border-2 mb-6 ${
              resumeAnalysis.atsScore >= 80 ? 'bg-green-50 border-green-500' :
              resumeAnalysis.atsScore >= 60 ? 'bg-yellow-50 border-yellow-500' :
              'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">ATS Compatibility Score</h3>
                  <p className="text-sm text-gray-600">How well your resume passes Applicant Tracking Systems</p>
                </div>
                <div className="text-center">
                  <p className={`text-5xl font-bold ${
                    resumeAnalysis.atsScore >= 80 ? 'text-green-600' :
                    resumeAnalysis.atsScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {resumeAnalysis.atsScore}
                  </p>
                  <p className="text-sm text-gray-600">/ 100</p>
                </div>
              </div>

              {/* Score Breakdown */}
              {resumeAnalysis.atsScoreBreakdown && (
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(resumeAnalysis.atsScoreBreakdown).map(([key, score]) => (
                    <div key={key} className="text-center bg-white rounded-lg p-3 border">
                      <p className="text-xs text-gray-600 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className={`text-xl font-bold ${
                        score >= 80 ? 'text-green-600' :
                        score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{score}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Match Percentage */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-semibold text-gray-900">Match for {metadata.targetRole}</p>
                <p className="text-3xl font-bold text-blue-700">{resumeAnalysis.matchPercentage}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${resumeAnalysis.matchPercentage}%` }}
                ></div>
              </div>
              {resumeAnalysis.summary && (
                <p className="text-sm text-gray-700 mt-3">{resumeAnalysis.summary}</p>
              )}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-green-900">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {resumeAnalysis.strengths?.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <X className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-bold text-red-900">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {resumeAnalysis.weaknesses?.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-600 font-bold">⚠</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing Skills */}
            {resumeAnalysis.missingSkills?.length > 0 && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-orange-900 mb-4">🎯 Missing Skills for {metadata.targetRole}</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeAnalysis.missingSkills.map((skill, idx) => (
                    <span key={idx} className="bg-orange-200 text-orange-900 px-3 py-2 rounded-full text-sm font-medium border border-orange-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  💡 Focus on learning these skills in your roadmap below
                </p>
              </div>
            )}

            {/* AI Recommendations */}
            {resumeAnalysis.recommendations?.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">💡 AI Recommendations</h3>
                <ol className="space-y-3">
                  {resumeAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex gap-3">
                      <span className="font-bold text-blue-700 flex-shrink-0">{idx + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* ATS Optimization Keywords */}
            {resumeAnalysis.atsOptimization?.keywordsToAdd?.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4">🔑 Keywords to Add for Better ATS Score</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resumeAnalysis.atsOptimization.keywordsToAdd.map((keyword, idx) => (
                    <span key={idx} className="bg-purple-200 text-purple-900 px-3 py-2 rounded-full text-sm font-medium border border-purple-300">
                      {keyword}
                    </span>
                  ))}
                </div>
                {resumeAnalysis.atsOptimization.sectionsToImprove?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-sm font-semibold text-purple-900 mb-2">Sections to Improve:</p>
                    <ul className="space-y-1">
                      {resumeAnalysis.atsOptimization.sectionsToImprove.map((section, idx) => (
                        <li key={idx} className="text-sm text-gray-700">• {section}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skills Gap Analysis */}
        <div id="skills-gap" className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Skills Gap Analysis</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                You Already Have
              </h3>
              <ul className="space-y-2">
                {data.skillsGap.hasAlready.map((skill, idx) => (
                  <li key={idx} className="text-sm text-gray-700">✓ {skill}</li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
              <h3 className="font-bold text-orange-800 mb-3">🎯 Need to Learn</h3>
              <ul className="space-y-2">
                {data.skillsGap.needToLearn.map((skill, idx) => (
                  <li key={idx} className="text-sm text-gray-700">• {skill}</li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">⭐ Optional</h3>
              <ul className="space-y-2">
                {data.skillsGap.optional.map((skill, idx) => (
                  <li key={idx} className="text-sm text-gray-700">• {skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Learning Path with Progress Checkboxes */}
        <div id="learning-path" className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Month-by-Month Learning Path</h2>
          <div className="space-y-6">
            {data.learningPath.map((month, idx) => {
              const monthId = `month-${month.month}`;
              const isCompleted = progress[monthId];
              
              return (
                <div key={idx} className={`border-l-4 ${isCompleted ? 'border-green-600 bg-green-50' : 'border-blue-600 bg-gray-50'} pl-6 py-4 rounded-r-lg relative transition-all`}>
                  <button
                    onClick={() => toggleProgress(monthId)}
                    className={`absolute -left-3 top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all print:hidden ${
                      isCompleted 
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                      Month {month.month}: {month.focus}
                      {isCompleted && <span className="ml-2 text-sm">✓</span>}
                    </h3>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                      {month.timeCommitment}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-700">Skills:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {month.skills.map((skill, skillIdx) => (
                        <span key={skillIdx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-700">Resources:</span>
                    <ul className="mt-2 space-y-1">
                      {month.resources.map((resource, resIdx) => (
                        <li key={resIdx} className="text-sm text-gray-600">• {resource}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <span className="text-sm font-semibold text-green-800">🎯 Milestone: </span>
                    <span className="text-sm text-gray-700">{month.milestone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Projects */}
        <div id="projects" className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💼 Portfolio Projects to Build</h2>
          <div className="space-y-6">
            {data.portfolioProjects.map((project, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 border border-green-300' :
                    project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                    'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="mb-3">
                  <span className="text-sm font-semibold text-gray-700">Technologies:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.skills.map((skill, skillIdx) => (
                      <span key={skillIdx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  ⏱️ Estimated time: {project.estimatedTime}
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-semibold text-blue-800">💡 Impact: </span>
                  <span className="text-sm text-gray-700">{project.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div id="market" className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Market Insights</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="font-bold text-green-800 mb-2">Demand Level</h3>
              <p className="text-3xl font-bold text-green-900">{data.marketInsights.demandLevel}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">Average Salary</h3>
              <p className="text-2xl font-bold text-blue-900">{data.marketInsights.avgSalary}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">🔥 Trending Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.marketInsights.trendingSkills.map((skill, idx) => (
                <span key={idx} className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Industry Growth</h3>
            <p className="text-gray-700">{data.marketInsights.industryGrowth}</p>
          </div>
        </div>

        {/* Live Jobs */}
        <div id="jobs">
          {liveJobs && liveJobs.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Live Job Opportunities</h2>
              <p className="text-gray-600 mb-6">Real postings from LinkedIn, Indeed, and Glassdoor</p>
              
              <div className="space-y-4">
                {liveJobs.map((job, idx) => (
                  <a
                    key={idx}
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-2 border-gray-200 rounded-lg p-6 hover:shadow-xl hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {job.logo && (
                            <img src={job.logo} alt={job.company} className="w-12 h-12 rounded object-contain" onError={(e) => e.target.style.display = 'none'} />
                          )}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                            <p className="text-blue-700 font-medium">{job.company}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.salary}</span>
                          <span>⏰ {job.type}</span>
                          <span>📅 {job.posted}</span>
                          {job.isRemote && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">🏠 Remote</span>}
                        </div>

                        {job.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                        )}

                        {job.benefits && job.benefits.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.benefits.map((benefit, bidx) => (
                              <span key={bidx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">✓ {benefit}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.source === 'LinkedIn' ? 'bg-blue-100 text-blue-700' :
                          job.source === 'Indeed' ? 'bg-green-100 text-green-700' :
                          job.source === 'Glassdoor' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {job.source || 'Job Board'}
                        </span>
                        <ExternalLink className="w-5 h-5 text-blue-700" />
                      </div>
                    </div>
                    <div className="pt-3 mt-3 border-t">
                      <span className="text-sm font-semibold text-blue-700">View & Apply on {job.source} →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 mb-8 border-2 border-yellow-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Live Jobs Temporarily Unavailable</h2>
                  <p className="text-gray-700 mb-4">Check the company search links below for current opportunities.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Company Job Listings */}
        {companyJobListings && companyJobListings.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🏢 {metadata.targetRole} at Top Companies in {metadata.country}
            </h2>
            <p className="text-gray-600 mb-6">Direct search links to find openings</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {companyJobListings.map((listing, idx) => (
                <a
                  key={idx}
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                      {listing.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{listing.company}</p>
                      <p className="text-sm text-gray-600">{listing.role}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-700" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Platform Search Links */}
        {platformSearchLinks && (
          <div id="resources" className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔍 Search {metadata.targetRole} Jobs Across Platforms
            </h2>
            <p className="text-gray-600 mb-6">One-click search for {metadata.targetRole} in {metadata.country}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {Object.entries(platformSearchLinks).map(([platform, url], idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-all"
                >
                  <span className="font-semibold text-gray-900">{platform}</span>
                  <ExternalLink className="w-5 h-5 text-blue-700" />
                </a>
              ))}
            </div>

            {jobBoards && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">🏢 Top Employers</h3>
                  <ul className="space-y-2">
                    {data.jobOpportunities.topCompanies.map((company, idx) => (
                      <li key={idx} className="text-gray-700 bg-gray-50 p-2 rounded">• {company}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">🤝 Networking</h3>
                  <ul className="space-y-2">
                    {data.jobOpportunities.networking.map((network, idx) => (
                      <li key={idx} className="text-gray-700 bg-gray-50 p-2 rounded">• {network}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-3">💡 Application Tips</h3>
              <ul className="space-y-2">
                {data.jobOpportunities.applicationTips.map((tip, idx) => (
                  <li key={idx} className="text-gray-700">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Interview Prep */}
        <div id="interview" className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🎤 Interview Preparation</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Technical Topics</h3>
              <ul className="space-y-2">
                {data.interviewPrep.technicalTopics.map((topic, idx) => (
                  <li key={idx} className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">• {topic}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Behavioral Questions</h3>
              <ul className="space-y-2">
                {data.interviewPrep.behavioralQuestions.map((question, idx) => (
                  <li key={idx} className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">• {question}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3">Practice Resources</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {data.interviewPrep.practiceResources.map((resource, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg border text-gray-700">• {resource}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow p-8 text-center border-t-4 border-blue-700">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Start? 🚀</h2>
          <p className="text-xl mb-6 text-gray-700">
            Follow this roadmap and you'll be job-ready in {metadata.timeline} months!
          </p>
          <Link
            href="/analyze"
            className="inline-block bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg print:hidden"
          >
            Create Another Roadmap
          </Link>
          <div className="mt-6 pt-6 border-t text-sm text-gray-600">
            <p>Generated on {new Date(metadata.generatedAt).toLocaleDateString()}</p>
            <p className="mt-1">CareerCompass AI • LuminHacks 2025</p>
          </div>
        </div>
      </div>
      <AIChatbot roadmapData={analysisData} />
    </div>
  );
}