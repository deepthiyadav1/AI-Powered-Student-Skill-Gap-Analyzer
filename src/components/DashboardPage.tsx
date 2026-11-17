import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { CAREER_TRACKS } from '../data/careers.ts';
import { ReadinessRing, WeeklyProgressChart } from './Charts.tsx';
import type { PageId, WorkspaceState } from '../types.ts';

interface DashboardPageProps {
  workspace: WorkspaceState;
  onNavigate: (page: PageId) => void;
}

export function DashboardPage({ workspace, onNavigate }: DashboardPageProps) {
  const { student, skills, latestAnalysis, roadmap } = workspace;
  const targetCareer =
    CAREER_TRACKS.find((c) => c.id === student.selectedCareerId) ?? CAREER_TRACKS[0];

  const readinessScore = latestAnalysis?.readinessPercentage ?? 0;
  const totalSkillsEntered = skills.length;
  const skillsMatched = latestAnalysis?.matchedSkills.length ?? 0;
  const skillsMissing = latestAnalysis?.missingSkills.length ?? 0;

  const recommendedNextItems = roadmap.filter((item) => !item.completed).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Header & Profile Summary */}
      <section className="rounded-2xl bg-slate-950 text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-sky-300">
            {student.collegeName} · {student.branch} · {student.yearOfStudy}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, Student!
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Signed in as <span className="font-semibold text-white">{student.fullName}</span> ({student.email}). Your current target career benchmark is{' '}
            <span className="font-semibold text-sky-300">{targetCareer.title}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('assessment')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Analyze My Skills</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('careers')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-900 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Change Career</span>
          </button>
        </div>
      </section>

      {/* 4-Column KPI Strip */}
      <section aria-label="Readiness Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">Overall Skill Readiness Score</p>
          <p className="mt-2 font-mono text-3xl font-bold text-purple-700 tabular-nums">
            {readinessScore}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Target: {targetCareer.title}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">Total Skills Entered</p>
          <p className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {totalSkillsEntered}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Technical & soft competencies
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">Skills Matched</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-mono text-3xl font-bold text-emerald-700 tabular-nums">
              {skillsMatched}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>On Benchmark</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Meets industry level
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">Skills Missing</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-mono text-3xl font-bold text-rose-700 tabular-nums">
              {skillsMissing}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Action Needed</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Priority gaps identified
          </p>
        </div>
      </section>

      {/* Main Two-Column Section: Progress Chart + Recent Skill Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-950">
                Weekly Progress Chart
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Study hours logged and readiness percentage trend
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap cursor-pointer"
            >
              Full Progress Report
            </button>
          </div>
          <WeeklyProgressChart data={student.weeklyActivity} />
        </section>

        <section className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="font-display text-lg font-bold text-slate-950">
                Recent Skill Analysis
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('analysis')}
                className="text-xs font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap cursor-pointer"
              >
                Inspect Details
              </button>
            </div>

            {latestAnalysis ? (
              <div className="space-y-5">
                <div className="flex items-center gap-5">
                  <ReadinessRing percentage={latestAnalysis.readinessPercentage} size={104} strokeWidth={9} />
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs text-slate-500">Evaluated Career</p>
                    <p className="font-display font-bold text-base text-slate-950 truncate">
                      {latestAnalysis.careerTitle}
                    </p>
                    <p className="text-xs text-slate-500">
                      {latestAnalysis.matchedSkills.length} matched · {latestAnalysis.missingSkills.length} missing
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {latestAnalysis.aiSummary}
                </p>

                {latestAnalysis.missingSkills.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">
                      Top Missing Skills
                    </p>
                    <p className="text-xs text-rose-700 font-medium">
                      {latestAnalysis.missingSkills.join(' · ')}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm text-slate-600">
                  You haven&apos;t run a skill gap analysis yet.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('assessment')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <span>Start Skill Assessment</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recommended Learning Activities */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-950">
              Recommended Learning Activities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Next priority modules from your personalized learning roadmap
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('roadmap')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 cursor-pointer"
          >
            <span>Open Full Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recommendedNextItems.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recommendedNextItems.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-purple-700">{item.level} Level</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.priority} Priority</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.estimatedHours} hrs</span>
                  </div>
                  <h3 className="font-display font-semibold text-base text-slate-950">
                    {item.skill}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-1">{item.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('roadmap')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                  <span>View Module</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-slate-600">
              {roadmap.length > 0
                ? 'All modules in your current roadmap are completed!'
                : 'Generate a personalized learning roadmap after running your skill gap analysis.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate(latestAnalysis ? 'analysis' : 'assessment')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold cursor-pointer"
            >
              <span>{latestAnalysis ? 'Generate Learning Roadmap' : 'Assess My Skills'}</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
