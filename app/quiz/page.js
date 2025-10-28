'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Brain, ChevronRight, Sparkles, TrendingUp, Award, Info } from 'lucide-react';
import { hollandQuestions, hollandCareers, calculateHollandResults, getRIASECDescription } from '../lib/quizData';

// REMOVE ALL THE DUPLICATE DATA - It's now imported from quizData.js!

export default function CareerQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < hollandQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (allAnswers) => {
    const result = calculateHollandResults(allAnswers);
    setResult(result);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    const { careers, riasecScores, hollandCode, topMatch } = result;
    const topCareers = careers.slice(0, 15);
    
    // Group by category
    const groupedByCategory = topCareers.reduce((acc, career) => {
      if (!acc[career.category]) acc[career.category] = [];
      acc[career.category].push(career);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your Career Profile Results
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Based on the Holland Code (RIASEC) Career Theory
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border-2 border-blue-200">
                <Award className="w-5 h-5 text-blue-700" />
                <span className="font-bold text-blue-700">Your Holland Code: {hollandCode}</span>
              </div>
            </div>

            {/* RIASEC Profile */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Your Personality Type Breakdown</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(riasecScores)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([code, score]) => {
                    const info = getRIASECDescription(code);
                    const maxScore = Math.max(...Object.values(riasecScores));
                    const percentage = Math.round((score / maxScore) * 100);
                    
                    return (
                      <div key={code} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-2xl font-bold text-blue-700">{code}</p>
                            <p className="text-sm font-semibold text-gray-900">{info.name}</p>
                          </div>
                          <span className="text-xl font-bold text-blue-700">{percentage}%</span>
                        </div>
                        <p className="text-xs text-gray-600">{info.desc}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Top Match Highlight */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl">{topMatch.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                      🥇 BEST MATCH
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {topMatch.category}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono">
                      Code: {topMatch.code}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold">{topMatch.role}</h2>
                  <p className="text-2xl font-semibold text-blue-100">{topMatch.percentage}% Match</p>
                </div>
              </div>
              <p className="text-blue-100 text-lg">{topMatch.description}</p>
            </div>

            {/* Top 15 Results */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your Top 15 Career Matches
              </h3>
              <div className="space-y-3">
                {topCareers.map((match, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-yellow-500' :
                          idx === 1 ? 'bg-gray-400' :
                          idx === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {match.rank}
                        </div>
                        <span className="text-3xl">{match.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-gray-900">{match.role}</p>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {match.category}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-mono">
                              {match.code}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{match.description}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-blue-700">{match.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          idx === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                          idx === 1 ? 'bg-blue-500' :
                          idx === 2 ? 'bg-blue-400' : 'bg-blue-300'
                        }`}
                        style={{ width: `${match.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Careers by Category */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Explore by Field
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(groupedByCategory).map(([category, categoryCareer]) => (
                  <div key={category} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">{category}</h4>
                    <div className="space-y-1">
                      {categoryCareer.map((career) => (
                        <div key={career.role} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{career.icon} {career.role}</span>
                          <span className="text-blue-600 font-semibold">{career.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Validation Notice */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200 mb-8">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Scientifically Validated Assessment
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                This test is based on the <strong>Holland Code (RIASEC)</strong>, developed by psychologist Dr. John L. Holland. 
                It's used by the U.S. Department of Labor, O*NET, and career counselors worldwide.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-700">
                <div>✓ Used by 90% of career counselors</div>
                <div>✓ Validated across 50+ years of research</div>
                <div>✓ Covers all major career fields</div>
                <div>✓ Based on personality psychology</div>
              </div>
            </div>

            {/* Understanding Your Results */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-8">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Info className="w-6 h-6" />
                Understanding Your Results
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>100% match:</strong> Excellent alignment with your personality</li>
                <li>• <strong>75-99%:</strong> Very good fit, strong compatibility</li>
                <li>• <strong>50-74%:</strong> Good fit with room for growth</li>
                <li>• <strong>Below 50%:</strong> May not align with your natural strengths</li>
                <li>• <strong>Holland Code:</strong> Your 3-letter code (e.g., IAE) shows your top personality types</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/analyze"
                className="flex-1 bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-center flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Generate Roadmap for {topMatch.role}
              </Link>
              <button
                onClick={resetQuiz}
                className="px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / hollandQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-700 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-10 h-10 text-blue-700" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Career Personality Test</h1>
                <p className="text-gray-600">Based on Holland Code (RIASEC)</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-blue-700 hover:text-blue-800"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">About This Test</h4>
              <p className="text-sm text-gray-700 mb-2">
                This assessment is based on the <strong>Holland Code (RIASEC)</strong>, a scientifically validated 
                career theory developed by psychologist Dr. John L. Holland in 1959.
              </p>
              <p className="text-sm text-gray-700">
                Your results will show your personality type and which careers align best with it. 
                The test has been used by millions worldwide and is endorsed by the U.S. Department of Labor.
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {hollandQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              {hollandQuestions[currentQuestion].category}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-5 mb-6 border-l-4 border-blue-600">
              <h2 className="text-xl font-bold text-gray-900">
                {hollandQuestions[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-3">
              {hollandQuestions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-5 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 group-hover:text-blue-700 text-lg">
                      {option.text}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-mono">
                        {option.code}
                      </span>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-700" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {currentQuestion > 0 ? (
              <button
                onClick={() => {
                  setCurrentQuestion(currentQuestion - 1);
                  setAnswers(answers.slice(0, -1));
                }}
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                ← Previous Question
              </button>
            ) : (
              <div></div>
            )}
            
            <div className="text-sm text-gray-500">
              {currentQuestion + 1}/{hollandQuestions.length}
            </div>
          </div>

          {/* Tip */}
          <div className="mt-8 bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Tip:</span> Choose the option that describes you MOST accurately. 
              Be honest - there are no right or wrong answers!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}