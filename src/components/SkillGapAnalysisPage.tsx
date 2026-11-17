import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ReadinessRing, SkillComparisonChart } from './Charts.tsx';
import type { PageId, SkillGapAnalysisResult, StudentSkill } from '../types.ts';

interface SkillGapAnalysisPageProps {
  analysis: SkillGapAnalysisResult | null;
  currentSkills: StudentSkill[];
  onGenerateRoadmap: (mode: 'ai' | 'curated') => Promise<{ ok: boolean; error?: string }>;
  onNavigate: (page: PageId) => void;
}

export function SkillGapAnalysisPage({
  analysis,
  currentSkills,
  onGenerateRoadmap,
  onNavigate,
}: SkillGapAnalysisPageProps) {
  const [generating, setGenerating] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">
          No Skill Gap Analysis Yet
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Select your target career and submit your current skills to generate a visual gap analysis.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('assessment')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-700 text-white text-sm font-semibold cursor-pointer"
        >
          <span>Go to Skill Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleGenerate = async (mode: 'ai' | 'curated') => {
    setRoadmapError(null);
    setGenerating(true);
    try {
      const result = await onGenerateRoadmap(mode);
      if (!result.ok && result.error) {
        setRoadmapError(result.error);
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <ReadinessRing percentage={analysis.readinessPercentage} size={132} strokeWidth={11} />
          <div className="space-y-2">
            <p className="text-xs font-semibold text-purple-700">
              AI Skill Gap Analysis · {analysis.aiPowered ? 'Gemini AI Diagnostic' : 'Benchmark Matrix'}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              {analysis.careerTitle}
            </h1>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              {analysis.aiSummary}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 shrink-0">
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerate('ai')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Building Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Learning Roadmap</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('assessment')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 text-center cursor-pointer"
          >
            Update Skill Ratings
          </button>
        </div>
      </section>

      {analysis.aiNotice && (
        <div
          role="status"
          className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3 text-sm text-slate-800"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-sky-700" />
          <span>{analysis.aiNotice}</span>
        </div>
      )}

      {roadmapError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-950"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <span>{roadmapError}</span>
          </div>
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerate('curated')}
            className="px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            Load Curated Benchmark Curriculum
          </button>
        </div>
      )}

      {/* Three Summary Columns: Matched / Needs Depth / Missing */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matched Skills */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <h2 className="font-display font-bold text-base text-slate-950">Matched Skills</h2>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
              {analysis.matchedSkills.length}
            </span>
          </div>
          {analysis.matchedSkills.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {analysis.matchedSkills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center justify-between text-sm text-slate-800"
                >
                  <span className="font-medium">{skill}</span>
                  <span className="text-xs font-medium text-emerald-700">Benchmark Met</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-slate-500">
              No skills meet full target proficiency yet.
            </p>
          )}
        </div>

        {/* Needs Depth */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-amber-700">
              <TrendingUp className="w-4 h-4" />
              <h2 className="font-display font-bold text-base text-slate-950">Needs Depth</h2>
            </div>
            <span className="font-mono text-sm font-bold text-amber-700 tabular-nums">
              {analysis.needsDepthSkills.length}
            </span>
          </div>
          {analysis.needsDepthSkills.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {analysis.comparisons
                .filter((c) => c.status === 'Needs Depth')
                .map((item) => (
                  <li
                    key={item.skill}
                    className="flex items-center justify-between text-sm text-slate-800"
                  >
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-xs text-amber-700">
                      {item.currentLevel} → {item.requiredLevel}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-slate-500">
              All entered benchmark skills already meet target depth.
            </p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="rounded-2xl bg-rose-50/40 border border-rose-200 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="font-display font-bold text-base text-slate-950">Missing Skills</h2>
            </div>
            <span className="font-mono text-sm font-bold text-rose-700 tabular-nums">
              {analysis.missingSkills.length}
            </span>
          </div>
          {analysis.missingSkills.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {analysis.missingSkills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center justify-between text-sm text-slate-900"
                >
                  <span className="font-semibold">{skill}</span>
                  <span className="text-xs font-semibold text-rose-700">Gap Identified</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-emerald-700 font-medium">
              Zero missing core competencies!
            </p>
          )}
        </div>
      </section>

      {/* Visual Chart & Current vs Required Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-slate-950">
              Current Skills vs. Required Industry Benchmarks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Purple bars represent your rated proficiency; shaded sky regions mark industry target expectations.
            </p>
          </div>
          <SkillComparisonChart comparisons={analysis.comparisons} />
        </section>

        <section className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-950">
              Priority Focus Actions
            </h2>
            <ol className="mt-3 space-y-3 text-sm text-slate-700">
              {analysis.aiFocusRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-purple-700 mt-0.5">
                    0{i + 1}.
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <h3 className="font-display text-sm font-bold text-slate-900 mb-2">
              Your Entered Skills ({currentSkills.length})
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentSkills.length > 0
                ? currentSkills.map((s) => `${s.name} (${s.proficiency})`).join(' · ')
                : 'No skills entered yet.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
