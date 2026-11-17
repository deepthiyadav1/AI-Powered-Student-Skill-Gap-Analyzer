import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart2,
  BrainCircuit,
  Check,
  Code2,
  Database,
  Globe,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { CAREER_TRACKS } from '../data/careers.ts';
import type { CareerTrack, PageId } from '../types.ts';

interface CareerSelectionPageProps {
  selectedCareerId: string;
  onSelectCareer: (careerId: string) => Promise<void>;
  onNavigate: (page: PageId) => void;
}

function CareerIcon({ iconKey, active }: { iconKey: CareerTrack['iconKey']; active: boolean }) {
  const cls = `w-5 h-5 ${active ? 'text-white' : 'text-purple-700'}`;
  switch (iconKey) {
    case 'code':
      return <Code2 className={cls} />;
    case 'database':
      return <Database className={cls} />;
    case 'brain':
      return <BrainCircuit className={cls} />;
    case 'globe':
      return <Globe className={cls} />;
    case 'chart':
      return <BarChart2 className={cls} />;
    case 'shield':
      return <ShieldCheck className={cls} />;
  }
}

export function CareerSelectionPage({
  selectedCareerId,
  onSelectCareer,
  onNavigate,
}: CareerSelectionPageProps) {
  const [query, setQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredTracks = CAREER_TRACKS.filter((track) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      track.title.toLowerCase().includes(q) ||
      track.shortDescription.toLowerCase().includes(q) ||
      track.requiredSkills.some((s) => s.name.toLowerCase().includes(q))
    );
  });

  const handleChoose = async (id: string) => {
    setSavingId(id);
    try {
      await onSelectCareer(id);
    } finally {
      setSavingId(null);
    }
  };

  const activeCareer =
    CAREER_TRACKS.find((c) => c.id === selectedCareerId) ?? CAREER_TRACKS[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-semibold text-purple-700 mb-1">Step 01 · Career Target</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Select Your Desired Career
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Choose the target role you are preparing for. Each track loads verified industry skill benchmarks for your gap analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('assessment')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Continue with {activeCareer.title}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Live Filter Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by role title or skill (e.g. Python, SQL, TensorFlow)"
          aria-label="Filter career tracks"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {filteredTracks.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-600">No career tracks match &ldquo;{query}&rdquo;.</p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-3 text-xs font-semibold text-purple-700 hover:underline cursor-pointer"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((career) => {
            const isSelected = career.id === selectedCareerId;
            const isSaving = savingId === career.id;

            return (
              <article
                key={career.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-colors border ${
                  isSelected
                    ? 'bg-sky-50/60 border-purple-600 ring-1 ring-purple-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                        isSelected
                          ? 'bg-purple-700 border-purple-700'
                          : 'bg-purple-50 border-purple-100'
                      }`}
                    >
                      <CareerIcon iconKey={career.iconKey} active={isSelected} />
                    </div>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {career.avgSalaryRange}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-bold text-slate-950">
                    {career.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{career.demandLabel}</p>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {career.shortDescription}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-200/80">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">
                      Required Skills
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {career.requiredSkills.map((s) => s.name).join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleChoose(career.id)}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-purple-700 text-white hover:bg-purple-800'
                        : 'bg-slate-950 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    <span>{isSelected ? 'Selected Career' : 'Select Career'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
