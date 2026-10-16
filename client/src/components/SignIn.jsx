import { SignIn as ClerkSignIn, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function SignIn() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-40" />
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              MockAI
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1">
            Sign in to continue your interview practice
          </p>
        </div>

        {/* Clerk Sign In */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <ClerkSignIn 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-0 p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'rounded-lg border border-input hover:bg-accent transition-colors',
                formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25',
                footerActionLink: 'text-primary',
                formFieldInput: 'rounded-lg border border-input bg-background',
                identityPreviewEditButton: 'text-primary',
              },
            }}
            routing="path"
            path="/login"
            signUpUrl="/login"
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

