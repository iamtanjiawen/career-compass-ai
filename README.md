# 🎯 Career Compass AI

> **AI-powered career guidance platform with live video interview practice**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://career-compass-ai-chi.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue)](https://github.com/iamtanjiawen/career-compass-ai)
[![Built For](https://img.shields.io/badge/Built%20For-LuminHacks%202025-purple)](https://luminhacks.devpost.com)

---

## 🌟 What It Does

Career Compass AI is an intelligent career guidance system that helps job seekers:

- 📋 **Take Career Assessments** - Personalized quiz to discover your ideal career path
- 🎥 **Practice Live Video Interviews** - Face-to-face AI interviewer with real-time speech recognition
- 📊 **Get Instant Feedback** - Detailed performance analysis with scores and improvement tips
- 📄 **Analyze Your Resume** - AI-powered resume review and suggestions
- 🗺️ **Receive Career Roadmaps** - Customized learning paths based on your goals
- 💬 **Chat with AI Career Coach** - 24/7 career advice and guidance

---

## ✨ Key Features

### 🎤 Live Video Interview with AI
- **Real-time speech recognition** - Your answers are captured automatically as you speak
- **AI Interviewer (Dr. Sarah Chen)** - Natural voice responses and dynamic questioning
- **Smart evaluation** - Get scored on communication, content, and professionalism
- **Instant feedback** - Know your strengths and areas for improvement

### 🧠 Intelligent Career Matching
- Personality-based career recommendations
- Skills assessment and gap analysis
- Industry trends and salary insights
- University and course suggestions

### 📈 Comprehensive Analysis
- Resume parsing and optimization
- Interview performance tracking
- Progress monitoring across sessions
- Personalized improvement strategies

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework for production
- **React** - UI component library
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### AI & APIs
- **Google Gemini Pro** - Advanced AI for question generation and evaluation
- **Web Speech API** - Real-time speech-to-text transcription
- **Speech Synthesis API** - Natural AI interviewer voice
- **MediaRecorder API** - Video recording capabilities

### Backend
- **Next.js API Routes** - Serverless functions
- **Node.js** - Runtime environment

---

## 🎥 Demo Video

[Watch Demo](YOUR_YOUTUBE_LINK_HERE)

*3-minute video showcasing all features*

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Google Gemini API Key
- Chrome or Edge browser (for speech recognition)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/iamtanjiawen/career-compass-ai.git
cd career-compass-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyCr96wx__RlyICbrB9uIgz5JR1cyoIhT-8
```

Get your API key from: [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

---

## 📱 How to Use

### 1. Career Assessment
- Take a 10-question personality quiz
- Discover careers that match your interests
- View detailed career information

### 2. Live Video Interview
- Enter your job details and experience
- Allow camera and microphone access
- Answer questions spoken by AI interviewer
- Get real-time speech transcription
- Receive instant AI feedback

### 3. Resume Analysis
- Upload your resume (PDF or DOCX)
- Get AI-powered suggestions
- See strengths and improvement areas

### 4. Career Roadmap
- Enter your current skills and goals
- Receive personalized learning paths
- Get resource recommendations

### 5. Mock Interview
- Enter your target role
- Receive personalized interview questions
- Answer questions by using manual typing or voice input
---

## 🎯 Project Structure
```
career-compass-ai/
├── app/
│   ├── analyze/          # Career analysis page
│   ├── api/              # API routes
│   │   ├── analyze/      # Career analysis API
│   │   ├── chat/         # Chatbot API
│   │   └── interview/    # Interview API
│   ├── components/       # Reusable components
│   ├── interview/
│   │   └── video/        # Live video interview
│   ├── lib/              # Data and utilities
│   ├── quiz/             # Career quiz
│   └── results/          # Quiz results
├── public/               # Static assets
├── .env.local           # Environment variables (not in repo)
├── package.json         # Dependencies
└── README.md           # This file
```

---

## 🌐 Browser Compatibility

**Recommended:** Chrome or Edge for full experience

---

## 🏆 Built For

**LuminHacks 2025** - AI Hackathon

This project demonstrates practical AI integration for real-world career development challenges.

---

## 💡 Key Innovations

1. **Real-time Speech Recognition** - Seamless voice-to-text during interviews
2. **Dynamic Question Generation** - AI adapts questions based on your profile
3. **Instant Evaluation** - Get feedback within seconds
4. **Natural Conversation** - AI speaks questions with realistic voice
5. **Privacy-First** - All processing happens securely, no data stored

---

## 🚧 Future Enhancements

- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Interview recording playback
- [ ] Peer-to-peer mock interviews
- [ ] Company-specific interview prep
- [ ] Integration with job boards

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👨‍💻 Developer

**Tan Jia Wen**
- GitHub: [@iamtanjiawen](https://github.com/iamtanjiawen)
- Project: [Career Compass AI](https://github.com/iamtanjiawen/career-compass-ai)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- LuminHacks for the opportunity to build this project

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation in `/docs`

---

**⭐ If you find this project helpful, please give it a star!**
