import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';
import AuthProvider from "./components/AuthProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function MissingConfiguration() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-300">MockAI setup required</p>
        <h1 className="text-3xl font-bold">Add your Clerk key to start the app</h1>
        <p className="mt-4 leading-7 text-slate-300">
          Create <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-white">client/.env</code> and add your Clerk publishable key:
        </p>
        <pre className="mt-5 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-emerald-300">VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key</pre>
        <p className="mt-5 text-sm leading-6 text-slate-400">
          Restart the Vite server after saving the file. Configure the server environment variables as well to use interviews and AI feedback.
        </p>
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
      </ClerkProvider>
    ) : (
      <MissingConfiguration />
    )}
  </React.StrictMode>
);

