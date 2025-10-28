'use client';
import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Briefcase, Zap, Globe, Award, Brain, Mic, Video, FileText} from 'lucide-react';
import AIChatbot from './components/AIChatbot'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header - LIGHT NAVY BLUE */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧭</span>
            <h1 className="text-2xl font-bold">CareerCompass AI</h1>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/quiz"
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Career Quiz
            </Link>
            <Link 
              href="/analyze"
              className="bg-white text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            ✨ AI-Powered • 100% Free • No Sign-up Required
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Career Planning<br />
            <span className="text-blue-700">Built for Students</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get a personalized roadmap to your dream job in seconds. 
            Discover skills gaps, learning paths, and portfolio projects—all tailored to YOUR profile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/analyze"
              className="inline-flex items-center bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2" />
            </Link>
            
            <Link 
              href="/quiz"
              className="inline-flex items-center bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Brain className="mr-2" />
              Take Career Quiz
            </Link>
            
            <Link 
              href="/interview"
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              <Mic className="mr-2" />
              Practice Mock Interview
            </Link>

            <Link 
              href="/interview/video"
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-colors shadow-lg"
            >
              <Video className="mr-2" />
              Live Video Interview
            </Link>
            
            {/* Updated Upload Resume button */}
            <Link 
              href="/resume-analyzer" 
              className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg"
            >
              <FileText className="mr-2" />
              Upload Resume
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-700" />
              <span>Built for LuminHacks 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-700" />
              <span>Instant AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-700" />
              <span>40+ Countries Supported</span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mt-32 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              The Problem We're Solving
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Traditional career guidance is expensive, slow, and generic. Students need personalized, 
              actionable guidance that fits their unique situation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
              <div className="text-4xl font-bold text-red-500 mb-2">68%</div>
              <p className="text-gray-700">of students don't know what skills employers need</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500">
              <div className="text-4xl font-bold text-orange-500 mb-2">500:1</div>
              <p className="text-gray-700">student-to-counselor ratio at most universities</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="text-4xl font-bold text-yellow-500 mb-2">$300/hr</div>
              <p className="text-gray-700">average cost of professional career coaching</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
              <div className="text-4xl font-bold text-green-500 mb-2">2-4 weeks</div>
              <p className="text-gray-700">wait time for career counseling appointments</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How CareerCompass Works
            </h3>
            <p className="text-lg text-gray-600">
              Three simple steps to your personalized career roadmap
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
                  1
                </div>
                <h4 className="text-xl font-bold mb-3">Tell Us About You</h4>
                <p className="text-gray-600">
                  Share your education, current skills, target role, and timeline. 
                  Takes less than 2 minutes to complete.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
                  2
                </div>
                <h4 className="text-xl font-bold mb-3">AI Analyzes Your Profile</h4>
                <p className="text-gray-600">
                  Our AI compares your skills with real job market data, 
                  identifies gaps, and creates a personalized learning path.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
                  3
                </div>
                <h4 className="text-xl font-bold mb-3">Get Your Roadmap</h4>
                <p className="text-gray-600">
                  Receive month-by-month learning plans, portfolio projects, 
                  and real job opportunities. Save as PDF to track your progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h3>
            <p className="text-lg text-gray-600">
              More than just generic career advice
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Brain className="w-8 h-8" />}
              title="Career Personality Test"
              description="5-minute quiz to discover your ideal career path based on your personality traits"
              color="purple"
            />
            <FeatureCard 
              icon={<Target className="w-8 h-8" />}
              title="Skills Gap Analysis"
              description="AI compares your current skills with job requirements and shows exactly what you need"
              color="blue"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8" />}
              title="Live Market Data"
              description="Real job listings from LinkedIn, Indeed, and Glassdoor with direct apply links"
              color="green"
            />
            <FeatureCard 
              icon={<Briefcase className="w-8 h-8" />}
              title="Portfolio Projects"
              description="Specific project ideas with detailed descriptions to showcase your skills"
              color="red"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">
            Ready to Take Control of Your Career?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who are using AI to plan their career journey. 
            Get started in less than 2 minutes—completely free.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/analyze"
              className="inline-flex items-center bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Generate Your Free Roadmap
              <ArrowRight className="ml-2" />
            </Link>
            <Link 
              href="/quiz"
              className="inline-flex items-center bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg border-2 border-white/20"
            >
              <Brain className="mr-2" />
              Take Career Quiz
            </Link>

            <Link 
              href="/interview"
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              <Mic className="mr-2" />
              Practice Mock Interview
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 text-gray-600 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm">
            Empowering students with AI-powered career guidance • 
            Made with ❤️ by students, for students
          </p>
        </div>
      </footer>

      <AIChatbot roadmapData={null} />
    </div>
  );
}

function FeatureCard({ icon, title, description, color = 'blue' }) {
  const colorMap = {
    purple: { text: 'text-purple-600', border: 'border-purple-500' },
    blue: { text: 'text-blue-700', border: 'border-blue-500' },
    green: { text: 'text-green-600', border: 'border-green-500' },
    red: { text: 'text-red-600', border: 'border-red-500' }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 ${colors.border}`}>
      <div className={`${colors.text} mb-4`}>{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}