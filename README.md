# 🎯 AI Mock Interview Platform

A professional AI-powered mock interview platform built with React, Node.js, MongoDB, and Google's Gemini AI. Practice interviews tailored to your role, get real-time feedback, and track your progress.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![Node](https://img.shields.io/badge/Node-18.x-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248)

## ✨ Features

- **🤖 AI-Powered Questions** - Smart question generation based on your role, experience, and job description
- **🎤 Voice Recognition** - Practice speaking answers with real-time transcription
- **📊 Detailed Analytics** - Performance tracking with charts and metrics
- **💡 Instant Feedback** - AI analyzes your answers and provides actionable suggestions
- **🔐 Secure Auth** - Authentication powered by Clerk
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🎨 Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Clerk account (for authentication)
- Google Gemini API key

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-mock-interview

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Variables

#### Client (`client/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_KEY
```

#### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-mock-interview
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET
```

### 3. Run the Application

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

The app will be available at:
- Client: http://localhost:5173
- Server: http://localhost:5000

## 🏗️ Project Structure

```
ai-mock-interview/
├── client/                     # React + Vite frontend
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components (shadcn-style)
│   │   │   ├── Navbar.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateInterview.jsx
│   │   │   ├── InterviewScreen.jsx
│   │   │   ├── Feedback.jsx
│   │   │   └── SignIn.jsx
│   │   ├── lib/
│   │   │   ├── api.js         # Axios API client
│   │   │   ├── utils.js       # Utility functions
│   │   │   └── constants.js   # App constants
│   │   ├── App.jsx            # Router & layout
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                     # Express + MongoDB backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   └── Interview.js       # MongoDB schema
│   ├── routes/
│   │   └── interviews.js      # API routes
│   ├── services/
│   │   └── gemini.js          # AI question & feedback generation
│   ├── index.js               # Express server entry
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Charts & analytics
- **React Router** - Navigation
- **Clerk** - Authentication
- **Axios** - HTTP client
- **Lucide Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB + Mongoose** - Database
- **Google Gemini AI** - Question & feedback generation
- **Clerk API** - User management

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interviews` | Get all user interviews |
| POST | `/api/interviews` | Create new interview |
| GET | `/api/interviews/:id` | Get single interview |
| GET | `/api/interviews/:id/questions` | Get interview questions |
| POST | `/api/interviews/:id/generate` | Generate AI questions |
| POST | `/api/interviews/:id/submit` | Submit answers & get feedback |
| GET | `/api/interviews/:id/feedback` | Get interview feedback |
| DELETE | `/api/interviews/:id` | Delete interview |
| GET | `/api/health` | Health check |

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Build: `cd client && npm run build`
2. Set environment variables in deployment platform
3. Deploy the `dist` folder

### Backend (Railway/Render)
1. Set environment variables in deployment platform
2. Build command: `npm install`
3. Start command: `npm start`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

