import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { BrandMark } from './BrandMark.tsx';
import type { PageId, WorkspaceState } from '../types.ts';

interface AuthPageProps {
  onSuccess: (workspace: WorkspaceState) => void;
  onBack: (page: PageId) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

const BRANCH_OPTIONS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Data Science & Analytics',
];

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

export function AuthPage({ onSuccess, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('register');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState(BRANCH_OPTIONS[0]);
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');

  // Forgot password field
  const [resetEmail, setResetEmail] = useState('');

  const clearFeedback = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Unable to sign in.');
        return;
      }
      onSuccess(data.workspace as WorkspaceState);
    } catch {
      setErrorMsg('Network error while signing in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    clearFeedback();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@skillgap.edu',
          password: 'demo1234',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Demo login failed.');
        return;
      }
      onSuccess(data.workspace as WorkspaceState);
    } catch {
      setErrorMsg('Unable to load demo account.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setErrorMsg('Please enter a valid college or personal email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password must match.');
      return;
    }
    if (!collegeName.trim()) {
      setErrorMsg('Please enter your college or university name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: regEmail.trim(),
          password,
          confirmPassword,
          collegeName: collegeName.trim(),
          branch,
          yearOfStudy,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Registration failed.');
        return;
      }
      onSuccess(data.workspace as WorkspaceState);
    } catch {
      setErrorMsg('Network error while creating account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Failed to request password reset.');
        return;
      }
      setSuccessMsg(data.message);
    } catch {
      setErrorMsg('Network error while processing password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onBack('landing')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <BrandMark className="w-6 h-6" />
          <span className="font-display font-bold text-base text-slate-900">SkillGap AI</span>
        </div>

        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className="text-sm font-semibold text-purple-700 hover:text-purple-800 cursor-pointer whitespace-nowrap"
        >
          Demo Student Login
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-4xl grid lg:grid-cols-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Left Navy Guidance Panel */}
          <div className="lg:col-span-5 bg-slate-950 text-white p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-sky-300 mb-3">Student Portal</p>
              <h1 className="font-display text-2xl font-bold leading-snug">
                Map your college skills to industry careers.
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Create your student profile to benchmark technical & soft skills, uncover gaps, and save your personalized learning roadmap.
              </p>

              <div className="mt-8 space-y-4 border-t border-slate-800 pt-6 text-sm text-slate-300">
                <div>
                  <p className="font-semibold text-white">01. Career Benchmarks</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    6 curated tech career tracks with weighted skills.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">02. AI Gap Diagnostics</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clear visual breakdown of matched vs. missing skills.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">03. Progress Reports</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track completed courses and export readiness reports.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400 mb-2">
                Want to explore immediately with sample data?
              </p>
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In as Demo Student (Aarav Sharma)</span>
              </button>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-8">
            {/* Mode Switcher */}
            {mode !== 'forgot' && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => {
                    clearFeedback();
                    setMode('register');
                  }}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearFeedback();
                    setMode('login');
                  }}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Login
                </button>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm text-rose-800"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                role="status"
                className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-sm text-emerald-800"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div className="mb-2">
                  <h2 className="font-display text-xl font-bold text-slate-950">
                    Student Registration
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your academic details to personalize career benchmarks.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="reg-fullname"
                      type="text"
                      required
                      placeholder="e.g. Priya Nair"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="priya@college.edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-confirm" className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="reg-confirm"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-college" className="block text-xs font-semibold text-slate-700 mb-1">
                    College Name
                  </label>
                  <input
                    id="reg-college"
                    type="text"
                    required
                    placeholder="e.g. National Institute of Technology"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-branch" className="block text-xs font-semibold text-slate-700 mb-1">
                      Branch / Department
                    </label>
                    <select
                      id="reg-branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    >
                      {BRANCH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reg-year" className="block text-xs font-semibold text-slate-700 mb-1">
                      Year of Study
                    </label>
                    <select
                      id="reg-year"
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    >
                      {YEAR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create Account</span>
                </button>

                <p className="text-center text-xs text-slate-500 pt-1">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      clearFeedback();
                      setMode('login');
                    }}
                    className="text-purple-700 font-semibold hover:underline cursor-pointer"
                  >
                    Log in to your account
                  </button>
                </p>
              </form>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div className="mb-2">
                  <h2 className="font-display text-xl font-bold text-slate-950">
                    Student Login
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign in to access your skill gap dashboard and learning roadmap.
                  </p>
                </div>

                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="student@skillgap.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        clearFeedback();
                        setResetEmail(loginEmail);
                        setMode('forgot');
                      }}
                      className="text-xs font-medium text-purple-700 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Sign In</span>
                </button>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Demo credentials: student@skillgap.edu / demo1234</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('student@skillgap.edu');
                      setLoginPassword('demo1234');
                    }}
                    className="text-purple-700 font-semibold hover:underline cursor-pointer"
                  >
                    Fill Demo
                  </button>
                </div>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-950">
                    Reset Password
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered email address to receive password reset instructions.
                  </p>
                </div>

                <div>
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send Reset Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    clearFeedback();
                    setMode('login');
                  }}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
