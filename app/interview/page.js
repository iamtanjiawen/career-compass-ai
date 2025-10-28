'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, MicOff, Send, Trophy, AlertCircle, CheckCircle, TrendingUp, Brain } from 'lucide-react';

export default function MockInterviewPage() {
  const [targetRole, setTargetRole] = useState('');
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes = 300 seconds
  const [timerActive, setTimerActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Word count
  const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
  const optimalRange = questions[currentQuestion]?.optimalWordCount || "150-250";
  const [minWords, maxWords] = optimalRange.split('-').map(n => parseInt(n.trim()));

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0 && !currentEvaluation) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isTimeUp) {
      setIsTimeUp(true);
      setTimerActive(false);
      // Auto-submit when time is up
      if (answer.trim()) {
        submitAnswer();
      } else {
        alert("Time's up! Please provide an answer.");
      }
    }
  }, [timerActive, timeRemaining, currentEvaluation, isTimeUp]);

  // Start timer when question loads
  useEffect(() => {
    if (started && questions.length > 0 && !currentEvaluation) {
      const timeLimit = questions[currentQuestion]?.timeLimit || 5;
      setTimeRemaining(timeLimit * 60); // Convert minutes to seconds
      setTimerActive(true);
      setIsTimeUp(false);
    }
  }, [currentQuestion, started, questions, currentEvaluation]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setAnswer(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startInterview = async () => {
    if (!targetRole.trim()) {
      alert('Please enter a target role');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_questions',
          targetRole
        })
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
        setStarted(true);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Voice input not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setTimerActive(false); // Stop timer
    setEvaluating(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          targetRole,
          questionNumber: currentQuestion + 1,
          userAnswer: answer,
          currentQuestion: questions[currentQuestion]
        })
      });

      const data = await response.json();
      if (data.success) {
        const newAnswer = {
          question: questions[currentQuestion].question,
          answer: answer,
          score: data.evaluation.score,
          evaluation: data.evaluation
        };

        setAnswers([...answers, newAnswer]);
        setCurrentEvaluation(data.evaluation);
        
        // Stop voice recognition if active
        if (isListening) {
          recognition.stop();
          setIsListening(false);
        }
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setCurrentEvaluation(null);
    setAnswer('');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'final_evaluation',
          targetRole,
          allAnswers: answers
        })
      });

      const data = await response.json();
      if (data.success) {
        setFinalResults(data);
      }
    } catch (error) {
      console.error('Error finishing interview:', error);
      alert('Failed to generate final results.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-green-50 border-green-500';
    if (score >= 6) return 'bg-yellow-50 border-yellow-500';
    return 'bg-red-50 border-red-500';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 120) return 'text-green-600';
    if (timeRemaining > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWordCountColor = () => {
    if (wordCount < minWords) return 'text-red-600';
    if (wordCount > maxWords) return 'text-orange-600';
    return 'text-green-600';
  };

  // Start Screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-700 hover:text-blue-800 font-medium mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                AI Mock Interview Simulator
              </h1>
              <p className="text-lg text-gray-600">
                Practice with AI-powered interview questions and get instant feedback
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">How it works:</h3>
              <ol className="space-y-2 list-decimal list-inside text-gray-700">
                <li>Enter your target role (e.g., Software Developer)</li>
                <li>AI generates 5 realistic interview questions</li>
                <li>Answer via typing or voice input</li>
                <li>Get instant AI feedback on each answer</li>
                <li>Receive overall performance report</li>
              </ol>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Role *
              </label>
              <input
                type="text"
                placeholder="e.g., Software Developer, Data Scientist, Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && startInterview()}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Questions...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Start Mock Interview
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final Results Screen
  if (finalResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Interview Complete! 🎉
              </h1>
              <p className="text-lg text-gray-600">Here's your performance summary</p>
            </div>

            {/* Overall Score */}
            <div className={`${getScoreBg(finalResults.overallScore)} rounded-xl p-8 mb-6 border-2`}>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 mb-2">Overall Score</p>
                <p className={`text-7xl font-bold ${getScoreColor(finalResults.overallScore)}`}>
                  {finalResults.overallScore}
                </p>
                <p className="text-xl text-gray-600 mt-2">/ 10</p>
                <p className="text-lg font-semibold text-gray-800 mt-4">
                  {finalResults.performanceLevel}
                </p>
              </div>
            </div>

            {/* Readiness Level */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
              <p className="text-center text-lg">
                <span className="font-bold text-blue-900">Interview Readiness:</span>{' '}
                <span className="text-blue-700">{finalResults.readinessLevel}</span>
              </p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-green-900 text-lg">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {finalResults.strengths?.map((strength, idx) => (
                    <li key={idx} className="text-gray-700">✓ {strength}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-orange-900 text-lg">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {finalResults.areasForImprovement?.map((area, idx) => (
                    <li key={idx} className="text-gray-700">→ {area}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Individual Question Scores */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Question-by-Question Breakdown</h3>
              <div className="space-y-3">
                {answers.map((ans, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                    <span className="text-sm text-gray-700">Question {idx + 1}</span>
                    <span className={`font-bold ${getScoreColor(ans.score)}`}>
                      {ans.score}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-purple-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-4">📋 Next Steps</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {finalResults.nextSteps?.map((step, idx) => (
                  <li key={idx} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>

            {/* Interview Tips */}
            {finalResults.interviewTips?.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4">💡 Pro Tips</h3>
                <ul className="space-y-2">
                  {finalResults.interviewTips.map((tip, idx) => (
                    <li key={idx} className="text-gray-700">• {tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStarted(false);
                  setQuestions([]);
                  setCurrentQuestion(0);
                  setAnswers([]);
                  setFinalResults(null);
                  setTargetRole('');
                }}
                className="flex-1 py-3 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-purple-700"
              >
                Practice Again
              </button>
              <Link
                href="/analyze"
                className="flex-1 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-center font-semibold"
              >
                Get Career Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Questions Screen
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className={`flex items-center gap-2 font-bold ${getTimerColor()}`}>
                  <span className="text-2xl">⏱️</span>
                  <span className="text-xl">{formatTime(timeRemaining)}</span>
                </div>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentQ?.type}
              </span>
              <span className="text-sm text-gray-600">{currentQ?.category}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQ?.question}
            </h2>
            <p className="text-sm text-gray-600">
              Difficulty: <span className="font-semibold">{currentQ?.difficulty}</span>
            </p>
          </div>

          {/* Answer Input */}
          {!currentEvaluation ? (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-900">Your Answer</label>
                  {/* Word Counter */}
                  <div className={`flex items-center gap-2 ${getWordCountColor()} font-semibold`}>
                    <span className="text-sm">📝 {wordCount} words</span>
                    <span className="text-xs text-gray-500">({optimalRange} optimal)</span>
                  </div>
                </div>
                {recognition && (
                  <button
                    onClick={toggleVoiceInput}
                    disabled={evaluating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isListening 
                        ? 'bg-red-100 text-red-700 border-2 border-red-500' 
                        : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? 'Stop Recording' : 'Voice Input'}
                  </button>
                )}
              </div>
              
              {/* Word Count Warning */}
              {wordCount > 0 && (
                <div className="mb-2">
                  {wordCount < minWords && (
                    <p className="text-xs text-red-600">⚠️ Too short - aim for at least {minWords} words</p>
                  )}
                  {wordCount > maxWords && (
                    <p className="text-xs text-orange-600">⚠️ Getting long - keep under {maxWords} words</p>
                  )}
                  {wordCount >= minWords && wordCount <= maxWords && (
                    <p className="text-xs text-green-600">✓ Good length!</p>
                  )}
                </div>
              )}
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... (or use voice input)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
                disabled={evaluating || isTimeUp}
              />

              <button
                onClick={submitAnswer}
                disabled={evaluating || !answer.trim() || isTimeUp}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {evaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    AI is Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          ) : (
            // Evaluation Results
            <div className="space-y-4 mb-6">
              {/* Score */}
              <div className={`${getScoreBg(currentEvaluation.score)} rounded-lg p-6 border-2`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Your Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(currentEvaluation.score)}`}>
                      {currentEvaluation.score}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">/ 10</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{currentEvaluation.rating}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {currentEvaluation.wordCount} words<br/>
                      <span className="text-xs">({currentEvaluation.optimalWordRange || '100-250'} optimal)</span>
                    </p>
                  </div>
                </div>

                {/* Score Breakdown */}
                {currentEvaluation.contentScore && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Score Breakdown:</p>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-600">Content</p>
                        <p className="font-bold text-sm">{currentEvaluation.contentScore}/3</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Structure</p>
                        <p className="font-bold text-sm">{currentEvaluation.structureScore}/2</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Depth</p>
                        <p className="font-bold text-sm">{currentEvaluation.depthScore}/2</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Complete</p>
                        <p className="font-bold text-sm">{currentEvaluation.completenessScore}/2</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Comm.</p>
                        <p className="font-bold text-sm">{currentEvaluation.communicationScore}/1</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              <div className="bg-gray-50 rounded-lg p-6 border">
                <h4 className="font-bold text-gray-900 mb-3">AI Feedback</h4>
                <p className="text-gray-700 mb-4">{currentEvaluation.detailedFeedback}</p>
              </div>

              {/* Strengths */}
              {currentEvaluation.strengths?.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h5 className="font-bold text-green-900 mb-2">✓ Strengths</h5>
                  <ul className="space-y-1">
                    {currentEvaluation.strengths.map((s, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {currentEvaluation.improvements?.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h5 className="font-bold text-orange-900 mb-2">→ Can Improve</h5>
                  <ul className="space-y-1">
                    {currentEvaluation.improvements.map((i, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {i}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Answer */}
              {currentEvaluation.suggestedAnswer && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5 className="font-bold text-blue-900 mb-2">💡 Suggested Approach</h5>
                  <p className="text-sm text-gray-700">{currentEvaluation.suggestedAnswer}</p>
                </div>
              )}

              <button
                onClick={nextQuestion}
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Interview'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}