'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Video, Square, Briefcase, Award, Calendar, CheckCircle, AlertCircle, DollarSign, Clock, Star } from 'lucide-react';

export default function VideoInterviewPage() {
  const [formData, setFormData] = useState({
    targetRole: '',
    yearsExperience: '',
    salaryExpectation: '',
    educationLevel: '',
    projectExperience: '',
    strengths: '',
    weaknesses: '',
  });
  
  const [stage, setStage] = useState('form');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [thinkingTime, setThinkingTime] = useState(30);
  const [answeringTime, setAnsweringTime] = useState(120);
  const [loading, setLoading] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [manualAnswer, setManualAnswer] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const questionsRef = useRef([]);
  const timerRef = useRef(null);
  const thinkingTimerRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const manualAnswerRef = useRef('');
  const useManualInputRef = useRef(false);

  const interviewer = {
    name: "Dr. Sarah Chen",
    role: "Senior HR Director",
    avatar: "👩‍💼",
    color: "from-blue-500 to-purple-500",
    greeting: "Hello! I'm Dr. Sarah Chen, and I'll be conducting your interview today. I'm excited to learn more about your background and experience. Let's begin!"
  };

  useEffect(() => {
    if (streamRef.current && videoRef.current && stage === 'interview') {
      console.log('📹 Attaching stream to video element');
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.warn('Video play warning:', e));
      console.log('✅ Video stream attached!');
    }
  }, [stage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          console.log('🎤 Speech detected, processing...');
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              transcriptRef.current += transcriptPiece + ' ';
              setTranscript(transcriptRef.current);
              console.log('✅ Final transcript updated:', transcriptRef.current);
            } else {
              const interimText = transcriptRef.current + transcriptPiece;
              setTranscript(interimText);
            }
          }
        };

        recognition.onstart = () => {
          console.log('🎤 Speech recognition STARTED');
        };

        recognition.onerror = (event) => {
          console.error('❌ Speech recognition error:', event.error);
          
          if (event.error === 'no-speech') {
            console.log('⚠️ No speech detected, but continuing to listen...');
          } else if (event.error === 'audio-capture') {
            console.log('⚠️ Microphone issue, retrying...');
            setTimeout(() => {
              if (isTranscribing && recognition) {
                try {
                  recognition.start();
                } catch (e) {
                  console.warn('Could not restart:', e);
                }
              }
            }, 500);
          } else if (event.error === 'not-allowed') {
            alert('❌ Microphone permission denied! Please allow microphone access in your browser settings.');
            setIsTranscribing(false);
          }
        };

        recognition.onend = () => {
          console.log('🎤 Speech recognition ended');
          console.log('Current transcript ref:', transcriptRef.current);
          
          if (isTranscribing && isRecording) {
            console.log('🔄 Auto-restarting speech recognition');
            setTimeout(() => {
              try {
                recognition.start();
                console.log('✅ Restarted successfully');
              } catch (e) {
                console.warn('Could not restart:', e);
              }
            }, 200);
          } else {
            setIsTranscribing(false);
          }
        };

        recognitionRef.current = recognition;
        console.log('✅ Speech recognition initialized with auto-restart');
      } else {
        console.warn('⚠️ Speech recognition not supported in this browser');
        alert('⚠️ Please use Chrome or Edge browser for speech recognition to work!');
      }
    }
  }, [isTranscribing, isRecording]);

  const startCamera = async () => {
    try {
      console.log('🎥 Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, 
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      streamRef.current = mediaStream;
      console.log('✅ Camera access granted!');
      return true;
    } catch (error) {
      console.error('❌ Camera error:', error);
      alert('Please allow camera and microphone access.');
      return false;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const validateForm = () => {
    if (!formData.targetRole?.trim()) {
      alert('Please enter your target job title');
      return false;
    }
    if (!formData.yearsExperience) {
      alert('Please select your years of experience');
      return false;
    }
    if (!formData.educationLevel) {
      alert('Please select your education level');
      return false;
    }
    if (!formData.strengths?.trim()) {
      alert('Please describe your key strengths');
      return false;
    }
    return true;
  };

  const startInterview = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_live_questions', ...formData })
      });

      const data = await response.json();
      
      if (!data.success || !data.questions || data.questions.length === 0) {
        throw new Error('Failed to generate questions');
      }

      const fetchedQuestions = data.questions;
      setQuestions(fetchedQuestions);
      questionsRef.current = fetchedQuestions;
      console.log('✅ Questions generated:', fetchedQuestions.length);
      
      setStage('preparing');
      
      const cameraReady = await startCamera();
      if (!cameraReady) {
        setStage('form');
        setLoading(false);
        return;
      }
      
      setCountdown(3);
      let count = 3;
      const countdownInterval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(countdownInterval);
          setCountdown(null);
          setStage('interview');
          setTimeout(() => speakGreetingAndFirstQuestion(fetchedQuestions[0]), 500);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
      stopCamera();
      setStage('form');
    } finally {
      setLoading(false);
    }
  };

  const speakGreetingAndFirstQuestion = (firstQuestion) => {
    if ('speechSynthesis' in window && firstQuestion) {
      setInterviewerSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(interviewer.greeting);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      utterance.onend = () => {
        setInterviewerSpeaking(false);
        setTimeout(() => speakQuestion(firstQuestion.question), 2000);
      };
      window.speechSynthesis.speak(utterance);
    } else if (firstQuestion) {
      setTimeout(() => speakQuestion(firstQuestion.question), 3000);
    }
  };

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setInterviewerSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      utterance.onend = () => {
        setInterviewerSpeaking(false);
        console.log('✅ AI finished speaking question');
        startThinkingTimer();
      };
      console.log('🎤 AI will speak question now...');
      window.speechSynthesis.speak(utterance);
    } else {
      startThinkingTimer();
    }
  };

  const startThinkingTimer = () => {
    console.log('⏰ Starting thinking timer');
    setThinkingTime(30);
    thinkingTimerRef.current = setInterval(() => {
      setThinkingTime(prev => {
        if (prev <= 1) {
          clearInterval(thinkingTimerRef.current);
          thinkingTimerRef.current = null;
          console.log('✅ Thinking complete, starting recording');
          setTimeout(() => startRecording(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipThinkingTime = () => {
    console.log('⏭️ Skipping thinking time');
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    setThinkingTime(0);
    setTimeout(() => startRecording(), 300);
  };

  const startRecording = async () => {
    console.log('🎬 Starting recording...');
    console.log('Stream ref:', streamRef.current ? 'EXISTS' : 'NULL');
    
    if (timerRef.current) {
      console.log('⚠️ Clearing existing timer before starting new recording');
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (!streamRef.current) {
      console.error('❌ No stream available');
      alert('Camera stream lost. Please refresh and try again.');
      return;
    }

    setTranscript('');
    transcriptRef.current = '';
    setManualAnswer('');
    manualAnswerRef.current = '';
    setUseManualInput(false);
    useManualInputRef.current = false;
    setShowNextButton(false);

    try {
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder not supported');
      }

      let options = {};
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = { mimeType: 'video/webm;codecs=vp9' };
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options = { mimeType: 'video/webm;codecs=vp8' };
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options = { mimeType: 'video/webm' };
      }

      console.log('📹 MIME type:', options.mimeType || 'default');
      
      const recorder = new MediaRecorder(streamRef.current, options);
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log('📦 Chunk:', event.data.size, 'bytes');
        }
      };

      recorder.onstop = () => {
        console.log('⏹️ Recording stopped. Chunks:', chunks.length);
        
        const capturedTranscript = transcriptRef.current.trim();
        const capturedManualAnswer = manualAnswerRef.current.trim();
        const isManualMode = useManualInputRef.current;
        
        console.log('📸 CAPTURED AT STOP TIME:');
        console.log('Manual mode?', isManualMode);
        console.log('Manual answer:', capturedManualAnswer.substring(0, 100));
        console.log('Speech transcript:', capturedTranscript.substring(0, 100));
        
        const blob = new Blob(chunks, { type: options.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        console.log('✅ Blob created:', blob.size, 'bytes');
        
        if (recognitionRef.current && isTranscribing) {
          recognitionRef.current.stop();
        }
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        evaluateAnswer(url, blob, capturedManualAnswer, capturedTranscript, isManualMode);
      };

      recorder.onerror = (event) => {
        console.error('❌ Recorder error:', event.error);
        alert('Recording failed. Please try again.');
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log('✅ Video recording started!');
      console.log('⏸️ Speech recognition will start in 2 seconds (after AI stops speaking)...');
      
      setTimeout(() => {
        if (recognitionRef.current && !interviewerSpeaking) {
          try {
            recognitionRef.current.start();
            setIsTranscribing(true);
            console.log('🎤 Speech recognition started (for YOUR answer only)');
          } catch (error) {
            console.warn('⚠️ Could not start speech recognition:', error);
            if (error.message && error.message.includes('already started')) {
              setIsTranscribing(true);
            }
          }
        } else {
          console.log('⚠️ AI still speaking, will wait...');
        }
      }, 2000);
      
      setAnsweringTime(120);
      let timeRemaining = 120;
      let timerInterval = setInterval(() => {
        timeRemaining--;
        console.log('⏱️ Time remaining:', timeRemaining);
        
        if (timeRemaining <= 0) {
          console.log('⏰ Time reached 0, stopping timer and recording');
          clearInterval(timerInterval);
          timerRef.current = null;
          setAnsweringTime(0);
          
          if (recorder.state === 'recording') {
            console.log('🛑 Auto-stopping recorder at time limit');
            recorder.stop();
            setIsRecording(false);
          }
        } else {
          setAnsweringTime(timeRemaining);
        }
      }, 1000);
      
      timerRef.current = timerInterval;
      console.log('✅ Timer started with ID:', timerInterval);
      
    } catch (error) {
      console.error('❌ Recording error:', error);
      alert(`Recording failed: ${error.message}`);
    }
  };

const stopRecording = () => {
  console.log('⏹️ stopRecording called');
  console.log('MediaRecorder state:', mediaRecorder?.state);
  
  // Stop speech recognition FIRST and wait a bit
  if (recognitionRef.current && isTranscribing) {
    recognitionRef.current.stop();
    setIsTranscribing(false);
  }
  
  // Then stop recording after a brief delay
  setTimeout(() => {
    if (mediaRecorder && isRecording) {
      console.log('🛑 Stopping MediaRecorder...');
      mediaRecorder.stop();
      setIsRecording(false);
      setShowNextButton(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      console.log('✅ Recording stopped');
    }
  }, 500); // Give speech recognition time to process final words
};

const goToNextQuestion = () => {
    console.log('➡️ Manually moving to next question');
    setShowNextButton(false);
    setLoading(false);
    setTranscript('');
    transcriptRef.current = '';
    setIsRecording(false);
    setIsTranscribing(false);
    setAnsweringTime(120);
    
    // Stop speech recognition completely
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('🛑 Speech recognition stopped for next question');
      } catch (e) {
        console.warn('Could not stop recognition:', e);
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    
    const questionsToUse = questionsRef.current;
    if (currentQuestion < questionsToUse.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setThinkingTime(30);
      speakQuestion(questionsToUse[currentQuestion + 1].question);
    } else {
      console.log('🏁 Last question, finishing interview');
      finishInterview();
    }
  };

  const evaluateAnswer = async (videoUrl, videoBlob, capturedManualAnswer, capturedTranscript, isManualMode) => {
    setLoading(true);
    
    console.log('📊 ===== EVALUATION DEBUG =====');
    console.log('Question Number:', currentQuestion + 1);
    console.log('🎯 CAPTURED manual answer:', capturedManualAnswer?.substring(0, 100));
    console.log('🎯 CAPTURED transcript:', capturedTranscript?.substring(0, 100));
    console.log('🎯 CAPTURED manual mode:', isManualMode);
    console.log('📝 State transcript:', transcript);
    console.log('📝 Ref transcript:', transcriptRef.current);
    console.log('✍️ Manual answer state:', manualAnswer);
    console.log('✍️ Manual answer ref:', manualAnswerRef.current);
    console.log('🔧 Manual input enabled?', useManualInput);
    
    const questionsToUse = questionsRef.current;
    
    let userAnswer = '';
    let answerSource = '';
    
    if (isManualMode && capturedManualAnswer && capturedManualAnswer.trim()) {
      userAnswer = capturedManualAnswer.trim();
      answerSource = 'MANUAL INPUT (captured)';
      console.log('✅ Using CAPTURED manual typed answer');
    } else if (capturedTranscript && capturedTranscript.trim()) {
      userAnswer = capturedTranscript.trim();
      answerSource = 'SPEECH TRANSCRIPT (captured)';
      console.log('✅ Using CAPTURED speech transcript');
    } else if (useManualInput && manualAnswerRef.current.trim()) {
      userAnswer = manualAnswerRef.current.trim();
      answerSource = 'MANUAL INPUT (ref fallback)';
      console.log('⚠️ Using manual answer from ref (fallback)');
    } else if (manualAnswer.trim() && manualAnswer.length > 20) {
      userAnswer = manualAnswer.trim();
      answerSource = 'MANUAL INPUT (state fallback)';
      console.log('⚠️ Using manual answer from state (fallback)');
    } else if (transcriptRef.current.trim()) {
      userAnswer = transcriptRef.current.trim();
      answerSource = 'SPEECH TRANSCRIPT (ref fallback)';
      console.log('⚠️ Using speech from ref (fallback)');
    } else if (transcript.trim()) {
      userAnswer = transcript.trim();
      answerSource = 'SPEECH TRANSCRIPT (state fallback)';
      console.log('⚠️ Using speech from state (fallback)');
    }
    
    console.log('📤 Answer source:', answerSource);
    console.log('📤 Answer length:', userAnswer.length, 'chars');
    
    if (!userAnswer || userAnswer.length < 20) {
      console.warn('⚠️ ===== ANSWER TOO SHORT OR EMPTY =====');
      console.warn('Using fallback answer instead');
      userAnswer = `I have ${formData.yearsExperience} of experience in ${formData.targetRole}. One of my key strengths is ${formData.strengths.split(',')[0]}. I am excited about this opportunity and believe my experience makes me a good fit for this role.`;
      answerSource = 'FALLBACK';
      console.warn('Fallback answer:', userAnswer);
    }
    
    console.log('📤 FINAL ANSWER BEING SENT TO API:');
    console.log(userAnswer);
    console.log('================================');
    
    try {
      const requestBody = {
        action: 'evaluate_live_answer',
        ...formData,
        questionNumber: currentQuestion + 1,
        userAnswer: userAnswer,
        currentQuestion: questionsToUse[currentQuestion]
      };
      
      console.log('📤 Sending to API...');
      
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      console.log('📥 API Response:', data);
      
      if (data.success) {
        const currentQ = questionsToUse[currentQuestion];
        if (!currentQ) {
          console.error('❌ Question not found at index:', currentQuestion);
          throw new Error('Question data missing');
        }
        
        console.log('✅ EVALUATION RECEIVED:');
        console.log('Score:', data.evaluation.score);
        console.log('Feedback:', data.evaluation.detailedFeedback);
        
        const newAnswer = {
          question: currentQ.question,
          videoUrl: videoUrl,
          transcript: userAnswer,
          evaluation: data.evaluation,
          rawTranscriptLength: transcriptRef.current.length,
          wasRealTranscript: answerSource !== 'FALLBACK',
          answerSource: answerSource
        };
        
        console.log('💾 Answer object being saved:', newAnswer);
        
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        console.log('✅ Total answers saved:', updatedAnswers.length);

        setTimeout(() => {
          setLoading(false);
          setShowNextButton(false);
          
          console.log('🧹 Clearing all inputs for next question');
          setTranscript('');
          transcriptRef.current = '';
          setManualAnswer('');
          manualAnswerRef.current = '';
          setUseManualInput(false);
          useManualInputRef.current = false;
          
          setIsRecording(false);
          setAnsweringTime(120);
          
          if (timerRef.current) {
            console.log('🧹 Clearing answer timer');
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          if (thinkingTimerRef.current) {
            console.log('🧹 Clearing thinking timer');
            clearInterval(thinkingTimerRef.current);
            thinkingTimerRef.current = null;
          }
          
          if (currentQuestion < questionsToUse.length - 1) {
            console.log('➡️ AUTO-MOVING to question', currentQuestion + 2);
            setCurrentQuestion(currentQuestion + 1);
            setThinkingTime(30);
            speakQuestion(questionsToUse[currentQuestion + 1].question);
          } else {
            console.log('🏁 All questions done, showing results');
            finishInterview();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Evaluation error:', error);
      setLoading(false);
      
      const questionsToUse = questionsRef.current;
      if (currentQuestion < questionsToUse.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTranscript('');
        setManualAnswer('');
        transcriptRef.current = '';
        manualAnswerRef.current = '';
        speakQuestion(questionsToUse[currentQuestion + 1].question);
      } else {
        finishInterview();
      }
    }
  };

  const finishInterview = async () => {
    console.log('🏁 Finishing interview with', answers.length, 'answers');
    setLoading(true);
    stopCamera();
    window.speechSynthesis.cancel();
    
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'final_live_evaluation',
          ...formData,
          allAnswers: answers
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Final results received');
        setFinalResults(data);
        setStage('results');
      } else {
        throw new Error('Failed to get final evaluation');
      }
    } catch (error) {
      console.error('❌ Final evaluation error:', error);
      
      const avgScore = answers.length > 0 
        ? answers.reduce((sum, a) => sum + (a.evaluation?.score || 5), 0) / answers.length
        : 5;
      
      setFinalResults({
        overallScore: avgScore.toFixed(1),
        performanceLevel: avgScore >= 7.5 ? 'Strong Candidate' : avgScore >= 6 ? 'Good Candidate' : 'Needs Improvement',
        strengths: ['Completed all questions', 'Showed up prepared', 'Demonstrated communication skills'],
        areasForImprovement: ['Review feedback for each question', 'Practice more mock interviews', 'Work on specific examples']
      });
      setStage('results');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (stage === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-white hover:text-blue-200 font-medium mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">🎥</div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">AI Live Video Interview</h1>
              <p className="text-xl text-gray-600">Face-to-face practice with AI interviewer</p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-5xl border-4 border-white/30">
                  {interviewer.avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{interviewer.name}</h3>
                  <p className="text-blue-100">{interviewer.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Target Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Years of Experience *
                  </label>
                  <select
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="0-1 years">0-1 years (Entry Level)</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Education Level *
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Your Key Strengths *
                </label>
                <textarea
                  placeholder="e.g., Leadership, Problem-solving, Communication..."
                  value={formData.strengths}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              <button
                onClick={startInterview}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-lg font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    <Video className="w-6 h-6" />
                    Start Live Video Interview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'preparing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          {countdown !== null ? (
            <>
              <div className="text-9xl font-bold text-white mb-8 animate-pulse">{countdown}</div>
              <p className="text-3xl text-white font-semibold">Interview starting...</p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto mb-6"></div>
              <p className="text-2xl text-white">Generating questions...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'interview' && questionsRef.current.length > 0) {
    const currentQ = questionsRef.current[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-white mb-2">
              <span>Question {currentQuestion + 1} of {questionsRef.current.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questionsRef.current.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questionsRef.current.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${interviewer.color} flex items-center justify-center text-6xl ${interviewerSpeaking ? 'animate-pulse' : ''}`}>
                    {interviewer.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl">{interviewer.name}</h3>
                    <p className="text-gray-400">{interviewer.role}</p>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {currentQ?.type}
                    </span>
                  </div>
                  <p className="text-white text-lg">
                    {interviewerSpeaking ? '🎤 Speaking...' : currentQ?.question}
                  </p>
                </div>

                {thinkingTime > 0 && !isRecording && !interviewerSpeaking && (
                  <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-yellow-400 text-sm font-semibold">⏳ Thinking Time</p>
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-yellow-400 text-4xl font-bold mb-3">{formatTime(thinkingTime)}</p>
                    <p className="text-yellow-300 text-xs mb-3">Recording will start automatically</p>
                    <button
                      onClick={skipThinkingTime}
                      className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                    >
                      ⏭️ Skip & Start Recording Now
                    </button>
                  </div>
                )}

                {thinkingTime > 0 && !isRecording && !interviewerSpeaking && (
                  <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-300 text-sm font-semibold mb-2">💡 Quick Tips:</p>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• Use the STAR method (Situation, Task, Action, Result)</li>
                      <li>• Be specific with examples and metrics</li>
                      <li>• Maintain eye contact with the camera</li>
                      <li>• Speak clearly and at a steady pace</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-black rounded-lg overflow-hidden relative border-4 border-blue-500">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-96 object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {isRecording && (
                  <>
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      RECORDING
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-3 rounded-lg">
                      <p className="text-3xl font-bold">{formatTime(Math.max(0, answeringTime))}</p>
                    </div>

                    {!isTranscribing && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
                          <p className="text-gray-300">Starting speech capture...</p>
                        </div>
                      </div>
                    )}

                    {isTranscribing && transcript && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg max-h-32 overflow-y-auto">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex gap-1">
                            <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <p className="text-green-400 text-xs font-semibold">🎤 Listening to YOU...</p>
                        </div>
                        <p className="text-sm leading-relaxed">{transcript}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {transcript.trim().split(/\s+/).filter(w => w).length} words
                        </p>
                      </div>
                    )}

                    {isTranscribing && !transcript && (
                      <div className="absolute bottom-4 left-4 right-4 bg-yellow-500/90 backdrop-blur-sm text-gray-900 p-3 rounded-lg">
                        <p className="text-sm font-semibold">⚠️ No speech detected yet - START SPEAKING NOW!</p>
                      </div>
                    )}
                  </>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-2xl font-bold">AI is analyzing...</p>
                    </div>
                  </div>
                )}
              </div>

              {isRecording && !loading && (
                <div className="mt-4 space-y-3">

                  <button
                    onClick={stopRecording}
                    className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-3 transition-colors"
                  >
                    <Square className="w-6 h-6" />
                    Stop Recording
                  </button>
                  <p className="text-center text-gray-400 text-sm">
                    Recording will auto-stop at 2:00
                  </p>
                </div>
              )}

              {showNextButton && !loading && (
                <div className="mt-4 space-y-3">
                  <button
                    onClick={goToNextQuestion}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors text-lg"
                  >
                    {currentQuestion < questionsRef.current.length - 1 ? '➡️ Next Question' : '🏁 Finish Interview'}
                  </button>
                  <p className="text-center text-gray-400 text-sm">
                    Or wait for AI analysis (3 seconds)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'results' && finalResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">🎬</div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">Interview Complete!</h1>
              <p className="text-xl text-gray-600">Your performance report</p>
            </div>

            <div className={`${getScoreBg(parseFloat(finalResults.overallScore))} rounded-xl p-8 mb-8 border-4 text-center`}>
              <p className="text-lg font-semibold text-gray-700 mb-2">Overall Score</p>
              <p className={`text-8xl font-bold ${getScoreColor(parseFloat(finalResults.overallScore))}`}>
                {finalResults.overallScore}
              </p>
              <p className="text-2xl text-gray-600 mt-2">/ 10</p>
              <p className="text-2xl font-bold text-gray-900 mt-4">{finalResults.performanceLevel}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <h3 className="font-bold text-green-900 text-xl mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {finalResults.strengths?.map((s, i) => (
                    <li key={i} className="text-gray-700">✓ {s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                <h3 className="font-bold text-orange-900 text-xl mb-4">Improvements</h3>
                <ul className="space-y-2">
                  {finalResults.areasForImprovement?.map((a, i) => (
                    <li key={i} className="text-gray-700">→ {a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {answers.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 text-xl mb-4">📝 Your Captured Answers (Debug)</h3>
                {answers.map((ans, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg mb-4 border">
                    <p className="font-bold text-gray-900 mb-2">Question {idx + 1}:</p>
                    <p className="text-sm text-gray-600 mb-2">{ans.question}</p>
                    <p className="font-semibold text-gray-800 mb-1">Your Answer:</p>
                    <p className="text-gray-700 italic bg-gray-50 p-3 rounded">
                      "{ans.transcript}"
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs flex-wrap">
                      <span className="text-gray-600">
                        Length: {ans.transcript?.length || 0} chars
                      </span>
                      <span className="text-gray-600">
                        Words: {ans.transcript?.split(/\s+/).filter(w => w).length || 0}
                      </span>
                      <span className={`font-semibold px-2 py-1 rounded ${
                        ans.answerSource === 'MANUAL INPUT' || ans.answerSource?.includes('MANUAL') 
                          ? 'bg-blue-100 text-blue-700' 
                          : ans.answerSource?.includes('SPEECH')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {ans.answerSource || (ans.wasRealTranscript ? '✓ Real' : '✗ Fallback')}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        Score: {ans.evaluation?.score}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStage('form');
                  setFormData({ targetRole: '', yearsExperience: '', salaryExpectation: '', educationLevel: '', projectExperience: '', strengths: '', weaknesses: '' });
                  setQuestions([]);
                  questionsRef.current = [];
                  setCurrentQuestion(0);
                  setAnswers([]);
                  setFinalResults(null);
                }}
                className="flex-1 py-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 font-semibold text-blue-700"
              >
                Practice Again
              </button>
              <Link href="/analyze" className="flex-1 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-center font-semibold">
                Get Career Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}