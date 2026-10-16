import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

import Navbar from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import CreateInterview from '@/components/CreateInterview';
import InterviewScreen from '@/components/InterviewScreen';
import Feedback from '@/components/Feedback';
import SignIn from '@/components/SignIn';
import SignUpPage from '@/components/SignUp';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        {/* Sign Up */}
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />

        {/* Create Interview */}
        <Route
          path="/create-interview"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CreateInterview />
              </>
            </ProtectedRoute>
          }
        />

        {/* Interview */}
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <InterviewScreen />
              </>
            </ProtectedRoute>
          }
        />

        {/* Feedback */}
        <Route
          path="/feedback/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Feedback />
              </>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}