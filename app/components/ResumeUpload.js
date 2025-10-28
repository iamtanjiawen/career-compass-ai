'use client';
import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ResumeUpload({ targetRole, onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) {
        setError('Please upload a PDF, DOCX, or TXT file');
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setAnalysis(null);
    }
  };

  const analyzeResume = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setError('');

    try {
      // Read file as text
      const text = await readFileAsText(file);
      
      // Send to API
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: text,
          targetRole: targetRole || 'Software Developer'
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
        if (onAnalysisComplete) {
          onAnalysisComplete(data.analysis);
        }
      } else {
        throw new Error(data.error);
      }

    } catch (err) {
      console.error('Resume analysis error:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-500';
    if (score >= 60) return 'bg-yellow-100 border-yellow-500';
    return 'bg-red-100 border-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-6 h-6 text-purple-700" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">📄 Resume Analyzer (Optional)</h3>
          <p className="text-sm text-gray-600">Upload your resume to get AI-powered gap analysis & ATS optimization tips</p>
        </div>
      </div>

      {/* Upload Section */}
      {!analysis && (
        <div>
          <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors bg-white">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold mb-1">
                {file ? file.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-xs text-gray-500">PDF, DOCX, or TXT (Max 5MB)</p>
            </label>
          </div>

          {file && (
            <button
              onClick={analyzeResume}
              disabled={analyzing}
              className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing Resume with AI...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4 mt-4">
          {/* ATS Score Card */}
          <div className={`${getScoreBgColor(analysis.atsScore)} rounded-lg p-6 border-2`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">ATS Compatibility Score</h4>
                <p className="text-sm text-gray-600">How well your resume passes Applicant Tracking Systems</p>
              </div>
              <div className="text-center">
                <p className={`text-5xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                  {analysis.atsScore}
                </p>
                <p className="text-sm text-gray-600">/ 100</p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(analysis.atsScoreBreakdown || {}).map(([key, score]) => (
                <div key={key} className="text-center">
                  <p className="text-xs text-gray-600 capitalize mb-1">{key}</p>
                  <p className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Match Percentage */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900">Match for {targetRole}</p>
              <p className="text-2xl font-bold text-blue-700">{analysis.matchPercentage}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${analysis.matchPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h5 className="font-bold text-green-900">Strengths</h5>
              </div>
              <ul className="space-y-1">
                {analysis.strengths?.map((strength, idx) => (
                  <li key={idx} className="text-sm text-gray-700">✓ {strength}</li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h5 className="font-bold text-red-900">Weaknesses</h5>
              </div>
              <ul className="space-y-1">
                {analysis.weaknesses?.map((weakness, idx) => (
                  <li key={idx} className="text-sm text-gray-700">⚠️ {weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing Skills */}
          {analysis.missingSkills?.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h5 className="font-bold text-orange-900 mb-3">🎯 Missing Skills for {targetRole}</h5>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, idx) => (
                  <span key={idx} className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-bold text-blue-900 mb-3">💡 AI Recommendations</h5>
            <ol className="space-y-2 list-decimal list-inside">
              {analysis.recommendations?.map((rec, idx) => (
                <li key={idx} className="text-sm text-gray-700">{rec}</li>
              ))}
            </ol>
          </div>

          {/* ATS Keywords */}
          {analysis.atsOptimization?.keywordsToAdd?.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-bold text-purple-900 mb-3">🔑 Keywords to Add for ATS</h5>
              <div className="flex flex-wrap gap-2">
                {analysis.atsOptimization.keywordsToAdd.map((keyword, idx) => (
                  <span key={idx} className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Resume Button */}
          <button
            onClick={() => {
              setAnalysis(null);
              setFile(null);
            }}
            className="w-full py-2 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-purple-700 font-semibold"
          >
            Upload Different Resume
          </button>
        </div>
      )}
    </div>
  );
}