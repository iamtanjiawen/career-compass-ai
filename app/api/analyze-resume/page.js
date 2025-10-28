'use client';
import { useState } from 'react';
import Link from 'next/link';
import ResumeUpload from '../components/ResumeUpload';
import { FileText, TrendingUp, CheckCircle } from 'lucide-react';

export default function ResumeAnalyzePage() {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysisComplete = (analysis) => {
    console.log('Analysis complete:', analysis);
    setAnalysisData(analysis);
    setAnalysisComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-orange-700 hover:text-orange-800 font-medium">
            ← Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              AI Resume Analyzer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant feedback on your resume with AI-powered analysis. 
              Discover ATS compatibility, missing skills, and actionable improvements.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-green-900 mb-1">ATS Score</h3>
              <p className="text-sm text-gray-600">Check if your resume passes applicant tracking systems</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-blue-900 mb-1">Skills Gap Analysis</h3>
              <p className="text-sm text-gray-600">Identify missing skills for your target role</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-bold text-purple-900 mb-1">AI Recommendations</h3>
              <p className="text-sm text-gray-600">Get specific suggestions to improve your resume</p>
            </div>
          </div>

          {/* Resume Upload Component */}
          <ResumeUpload 
            targetRole="Software Developer" // You can make this dynamic
            onAnalysisComplete={handleAnalysisComplete}
          />

          {/* Next Steps */}
          {analysisComplete && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">What's Next?</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  href="/analyze"
                  className="bg-white border-2 border-blue-300 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-bold text-blue-900 mb-1">📋 Get Full Career Roadmap</div>
                  <p className="text-sm text-gray-600">Get a personalized learning path to land your dream job</p>
                </Link>
                <Link 
                  href="/interview"
                  className="bg-white border-2 border-green-300 rounded-lg p-4 hover:bg-green-50 transition-colors"
                >
                  <div className="font-bold text-green-900 mb-1">🎤 Practice Interview</div>
                  <p className="text-sm text-gray-600">Practice answering common interview questions with AI</p>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Instant Analysis</h3>
            <p className="text-sm text-gray-600">Get results in under 30 seconds powered by advanced AI</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">100% Private</h3>
            <p className="text-sm text-gray-600">Your resume is never stored. Analysis happens in real-time</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">🆓</div>
            <h3 className="font-bold text-gray-900 mb-2">Completely Free</h3>
            <p className="text-sm text-gray-600">No credit card, no sign-up, no hidden fees</p>
          </div>
        </div>
      </div>
    </div>
  );
}