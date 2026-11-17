import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { PageId, RoadmapItem } from '../types.ts';

interface LearningRoadmapPageProps {
  careerTitle: string;
  roadmap: RoadmapItem[];
  onToggleComplete: (itemId: string, completed: boolean) => Promise<void>;
  onRegenerateRoadmap: (mode: 'ai' | 'curated') => Promise<{ ok: boolean; error?: string }>;
  onNavigate: (page: PageId) => void;
}

type LevelFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

const LEVELS: { key: LevelFilter; label: string }[] = [
  { key: 'All', label: 'All Levels' },
  { key: 'Beginner', label: '1. Beginner Level' },
  { key: 'Intermediate', label: '2. Intermediate Level' },
  { key: 'Advanced', label: '3. Advanced Level' },
];

export function LearningRoadmapPage({
  careerTitle,
  roadmap,
  onToggleComplete,
  onRegenerateRoadmap,
  onNavigate,
}: LearningRoadmapPageProps) {
  const [filter, setFilter] = useState<LevelFilter>('All');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const completedCount = roadmap.filter((r) => r.completed).length;
  const totalCount = roadmap.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = async (item: RoadmapItem) => {
    setTogglingId(item.id);
    try {
      await onToggleComplete(item.id, !item.completed);
    } finally {
      setTogglingId(null);
    }
  };

  const handleRegenerate = async (mode: 'ai' | 'curated') => {
    setErrorMsg(null);
    setRegenerating(true);
    try {
      const res = await onRegenerateRoadmap(mode);
      if (!res.ok && res.error) {
        setErrorMsg(res.error);
      }
    } finally {
      setRegenerating(false);
    }
  };

  if (roadmap.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">
          Your Learning Roadmap Is Ready to Generate
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Run a skill assessment or generate an AI roadmap tailored to your {careerTitle} skill gaps.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={regenerating}
            onClick={() => handleRegenerate('ai')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold cursor-pointer"
          >
            {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate AI Roadmap</span>
          </button>
          <button
            type="button"
            disabled={regenerating}
            onClick={() => handleRegenerate('curated')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold cursor-pointer"
          >
            <span>Load Curated Curriculum</span>
          </button>
        </div>
        {errorMsg && (
          <p className="text-sm text-rose-700 pt-2">{errorMsg}</p>
        )}
      </div>
    );
  }

  const visibleLevels: Array<'Beginner' | 'Intermediate' | 'Advanced'> =
    filter === 'All' ? ['Beginner', 'Intermediate', 'Advanced'] : [filter];

  return (
    <div className="space-y-8">
      {/* Header & Summary Progress */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-purple-700">
            Personalized Curriculum · {careerTitle}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Structured across Beginner, Intermediate, and Advanced tiers to close your missing skill gaps efficiently.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500">Roadmap Completion</p>
              <p className="font-mono text-2xl font-bold text-slate-950 tabular-nums">
                {completedCount} / {totalCount} ({progressPct}%)
              </p>
            </div>
            <button
              type="button"
              disabled={regenerating}
              onClick={() => handleRegenerate('ai')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              {regenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              )}
              <span>Refresh with AI</span>
            </button>
          </div>
          <div className="w-full sm:w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-700 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-950"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            disabled={regenerating}
            onClick={() => handleRegenerate('curated')}
            className="px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            Load Curated Curriculum
          </button>
        </div>
      )}

      {/* Level Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {LEVELS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filter === tab.key
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('progress')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap cursor-pointer"
        >
          <span>View Progress Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grouped Sections: 1. Beginner Level, 2. Intermediate Level, 3. Advanced Level */}
      <div className="space-y-8">
        {visibleLevels.map((levelName, idx) => {
          const items = roadmap.filter((r) => r.level === levelName);
          const sectionNumber =
            levelName === 'Beginner' ? '1' : levelName === 'Intermediate' ? '2' : '3';

          return (
            <section key={levelName} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h2 className="font-display text-xl font-bold text-slate-950">
                  {sectionNumber}. {levelName} Level
                </h2>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {items.filter((i) => i.completed).length} / {items.length} completed
                </span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl bg-white border border-slate-200 p-6 text-sm text-slate-500">
                  No gaps assigned to {levelName} Level for your current profile.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const isBusy = togglingId === item.id;
                    return (
                      <article
                        key={item.id}
                        className={`rounded-2xl border p-6 transition-colors ${
                          item.completed
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex items-start gap-3.5 min-w-0">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggle(item)}
                              aria-label={
                                item.completed
                                  ? `Mark ${item.skill} incomplete`
                                  : `Mark ${item.skill} completed`
                              }
                              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                item.completed
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-white border-slate-300 hover:border-purple-600'
                              }`}
                            >
                              {item.completed && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span
                                  className={`font-semibold ${
                                    item.priority === 'High'
                                      ? 'text-rose-700'
                                      : item.priority === 'Medium'
                                      ? 'text-purple-700'
                                      : 'text-sky-700'
                                  }`}
                                >
                                  {item.priority} Priority
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-600">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>
                                    {item.estimatedDuration} ({item.estimatedHours} hrs)
                                  </span>
                                </span>
                                {item.completed && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Completed</span>
                                    </span>
                                  </>
                                )}
                              </div>

                              <h3
                                className={`font-display text-lg font-bold ${
                                  item.completed
                                    ? 'text-slate-600 line-through'
                                    : 'text-slate-950'
                                }`}
                              >
                                {item.skill}
                              </h3>

                              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggle(item)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              item.completed
                                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                : 'bg-slate-950 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>{item.completed ? 'Completed' : 'Mark as Completed'}</span>
                          </button>
                        </div>

                        {/* Recommended Courses & Tutorials */}
                        {item.resources.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-slate-100 pl-0 sm:pl-8">
                            <p className="text-xs font-semibold text-slate-700 mb-2">
                              Recommended Courses &amp; Tutorials
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {item.resources.map((res, rIdx) => (
                                <a
                                  key={`${item.id}-res-${rIdx}`}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-sky-50/60 hover:border-sky-300 transition-colors"
                                >
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900 truncate">
                                      {res.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {res.provider} · {res.type}
                                    </p>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
