import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Compass,
  Menu,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { BrandMark, SafeImage } from './BrandMark.tsx';
import type { PageId } from '../types.ts';

interface LandingPageProps {
  isAuthenticated: boolean;
  onNavigate: (page: PageId) => void;
  onDemoLogin: () => void;
}

export function LandingPage({
  isAuthenticated,
  onNavigate,
  onDemoLogin,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top Bar: Strict 3-zone contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 rounded-md"
          >
            <BrandMark className="w-7 h-7" />
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              SkillGap AI
            </span>
          </button>

          {/* Zone 2: Single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </button>
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(isAuthenticated ? 'dashboard' : 'auth');
              }}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(isAuthenticated ? 'dashboard' : 'auth');
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-purple-700 text-white text-sm font-semibold text-center"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sky-50/70 via-white to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-wide text-purple-700 mb-4">
                Career Intelligence for Engineering & Tech Students
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-[1.12] [text-wrap:balance]">
                Discover Your Skill Gaps. Build Your Future.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Analyze your skills, identify what&apos;s missing, and get a personalized roadmap to your dream career.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Explore Features</span>
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                <span>6 Industry Career Benchmarks</span>
                <span aria-hidden="true">·</span>
                <span>Technical & Soft Skill Matrix</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onDemoLogin}
                  className="text-purple-700 hover:text-purple-900 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Preview Live Student Workspace
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm flex">
                <SafeImage
                  src="/src/assets/images/hero_career_ai_1794910144101.jpg"
                  alt="Isometric illustration of AI-powered career skill mapping and student competency paths"
                  className="w-full h-full min-h-[300px] lg:min-h-[400px] object-cover"
                  fallbackTitle="AI Career Path Mapping"
                  fallbackSubtitle="Visualizing student skills against industry benchmarks"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Proof Strip (4-column KPI strip below hero split) */}
        <section className="border-b border-slate-200 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="font-mono text-2xl font-bold text-sky-300 tabular-nums">6 Roles</p>
              <p className="text-sm text-slate-300 mt-1">Software, Data, AI/ML & Security tracks</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-sky-300 tabular-nums">13+ Skills</p>
              <p className="text-sm text-slate-300 mt-1">Technical & soft competency rubrics</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-sky-300 tabular-nums">3 Tiers</p>
              <p className="text-sm text-slate-300 mt-1">Beginner, Intermediate & Advanced paths</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-sky-300 tabular-nums">100%</p>
              <p className="text-sm text-slate-300 mt-1">Exportable readiness gap reports</p>
            </div>
          </div>
        </section>

        {/* Features Section: Asymmetric Bento Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-purple-700 mb-2">Platform Capabilities</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 [text-wrap:balance]">
              Built to turn coursework into industry readiness
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Every module translates self-assessed college skills into measurable career requirements and structured study plans.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Marquee Wide Card 1 */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 mb-5">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950">
                  01. Skill Analysis
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Rate your proficiency across core programming languages, algorithms, frameworks, and workplace soft skills. Our weighted engine benchmarks every competency against target industry expectations to calculate an exact readiness score.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                <span>Proficiency Weighting</span>
                <span aria-hidden="true">·</span>
                <span>Matched vs. Missing Breakdown</span>
                <span aria-hidden="true">·</span>
                <span>Visual Gap Charts</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 mb-5">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950">
                  02. Career Guidance
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  Compare requirements across Software Developer, Data Scientist, AI/ML Engineer, Web Developer, Data Analyst, and Cybersecurity Analyst roles before committing your semester study time.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200/80 text-xs font-medium text-slate-500">
                Role-Specific Competency Matrix
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 mb-5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950">
                  03. AI Recommendations
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  Generate a tailored three-stage learning roadmap organized into Beginner, Intermediate, and Advanced milestones with estimated hours, priorities, and vetted courses.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200/80 text-xs font-medium text-slate-500">
                Gemini-Powered Curriculum Planning
              </div>
            </div>

            {/* Marquee Wide Card 4 */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 mb-5">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950">
                  04. Progress Tracking
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Check off completed modules, maintain your weekly study streak, monitor readiness gains over time, and download a structured Skill Gap Report for academic advisors or placement mentors.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                <span>Weekly Study Velocity</span>
                <span aria-hidden="true">·</span>
                <span>Activity Log</span>
                <span aria-hidden="true">·</span>
                <span>Downloadable Report</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-slate-50 border-y border-slate-200 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold text-purple-700 mb-2">Three-Step Workflow</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 [text-wrap:balance]">
                How SkillGap AI works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl bg-white border border-slate-200 p-7">
                <span className="font-mono text-xs font-semibold text-purple-700">Step 01</span>
                <h3 className="font-display text-lg font-bold text-slate-950 mt-2">
                  Choose Your Target Career
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Register with your college branch and year of study, then select from six industry engineering and analytics career paths.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-7">
                <span className="font-mono text-xs font-semibold text-purple-700">Step 02</span>
                <h3 className="font-display text-lg font-bold text-slate-950 mt-2">
                  Assess Current Proficiency
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Select your technical and soft skills and rate each as Beginner, Intermediate, or Advanced to run the gap analyzer.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-7">
                <span className="font-mono text-xs font-semibold text-purple-700">Step 03</span>
                <h3 className="font-display text-lg font-bold text-slate-950 mt-2">
                  Execute Your Roadmap
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Inspect missing competencies on visual charts, generate a 3-level study roadmap, and track completed modules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex">
              <SafeImage
                src="/src/assets/images/about_campus_study_1794910145881.jpg"
                alt="University engineering students collaborating on laptops in a bright campus library"
                className="w-full h-full min-h-[280px] object-cover"
                fallbackTitle="Built for University Students"
                fallbackSubtitle="Bridging academic fundamentals and practical job readiness"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold text-purple-700 mb-2">About SkillGap AI</p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 [text-wrap:balance]">
                Bridging the gap between college syllabi and hiring benchmarks
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Students often master foundational coursework like C Programming, Python, and SQL without knowing which specialized frameworks, deployment tools, or domain competencies recruiters expect for roles like AI/ML Engineer or Cybersecurity Analyst.
              </p>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                SkillGap AI makes those hidden expectations transparent and gives every student an organized, realistic study plan they can measure week by week.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Target className="w-4 h-4" />
                  <span>{isAuthenticated ? 'Open Student Dashboard' : 'Create Student Account'}</span>
                </button>
                <button
                  type="button"
                  onClick={onDemoLogin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Try Instant Demo</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2.5">
            <BrandMark className="w-5 h-5" />
            <span className="font-display font-semibold text-slate-900">SkillGap AI</span>
            <span aria-hidden="true">·</span>
            <span>Student Skill Gap & Career Readiness Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => onNavigate('auth')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Student Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
