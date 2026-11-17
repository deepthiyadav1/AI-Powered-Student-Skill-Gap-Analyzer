import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  Plus,
} from 'lucide-react';
import {
  CAREER_SPECIFIC_SUGGESTIONS,
  CAREER_TRACKS,
  DEFAULT_SOFT_SKILLS,
  DEFAULT_TECHNICAL_SKILLS,
} from '../data/careers.ts';
import type { PageId, Proficiency, StudentSkill } from '../types.ts';

interface SkillAssessmentPageProps {
  selectedCareerId: string;
  initialSkills: StudentSkill[];
  onSubmitSkills: (careerId: string, skills: StudentSkill[]) => Promise<void>;
  onNavigate: (page: PageId) => void;
}

const PROFICIENCY_OPTIONS: Proficiency[] = ['Beginner', 'Intermediate', 'Advanced'];

export function SkillAssessmentPage({
  selectedCareerId,
  initialSkills,
  onSubmitSkills,
  onNavigate,
}: SkillAssessmentPageProps) {
  const career =
    CAREER_TRACKS.find((c) => c.id === selectedCareerId) ?? CAREER_TRACKS[2];

  // Build initial map of skillName -> StudentSkill
  const [selectedMap, setSelectedMap] = useState<Record<string, StudentSkill>>(() => {
    const map: Record<string, StudentSkill> = {};
    for (const s of initialSkills) {
      map[s.name] = s;
    }
    return map;
  });

  const [customTechnical, setCustomTechnical] = useState<string[]>(() => {
    const defaults = new Set([
      ...DEFAULT_TECHNICAL_SKILLS,
      ...(CAREER_SPECIFIC_SUGGESTIONS[career.id] ?? []),
    ]);
    return initialSkills
      .filter((s) => s.category === 'Technical' && !defaults.has(s.name))
      .map((s) => s.name);
  });

  const [customSoft, setCustomSoft] = useState<string[]>(() => {
    const defaults = new Set(DEFAULT_SOFT_SKILLS);
    return initialSkills
      .filter((s) => s.category === 'Soft' && !defaults.has(s.name))
      .map((s) => s.name);
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'Technical' | 'Soft'>('Technical');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const technicalList = useMemo(() => {
    const suggestions = CAREER_SPECIFIC_SUGGESTIONS[career.id] ?? [];
    return Array.from(new Set([...DEFAULT_TECHNICAL_SKILLS, ...suggestions, ...customTechnical]));
  }, [career.id, customTechnical]);

  const softList = useMemo(() => {
    return Array.from(new Set([...DEFAULT_SOFT_SKILLS, ...customSoft]));
  }, [customSoft]);

  const toggleSkill = (name: string, category: 'Technical' | 'Soft') => {
    setErrorMsg(null);
    setSelectedMap((prev) => {
      const next = { ...prev };
      if (next[name]) {
        delete next[name];
      } else {
        next[name] = { name, category, proficiency: 'Intermediate' };
      }
      return next;
    });
  };

  const setProficiency = (name: string, category: 'Technical' | 'Soft', proficiency: Proficiency) => {
    setErrorMsg(null);
    setSelectedMap((prev) => ({
      ...prev,
      [name]: { name, category, proficiency },
    }));
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSkillName.trim();
    if (!clean) return;
    setErrorMsg(null);

    if (newSkillCategory === 'Technical') {
      if (!technicalList.includes(clean)) {
        setCustomTechnical((prev) => [...prev, clean]);
      }
    } else {
      if (!softList.includes(clean)) {
        setCustomSoft((prev) => [...prev, clean]);
      }
    }

    setSelectedMap((prev) => ({
      ...prev,
      [clean]: { name: clean, category: newSkillCategory, proficiency: 'Intermediate' },
    }));
    setNewSkillName('');
  };

  const selectedSkillsArray = Object.values(selectedMap);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedSkillsArray.length === 0) {
      setErrorMsg('Please select at least one technical or soft skill to evaluate.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitSkills(career.id, selectedSkillsArray);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to submit skills.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-semibold text-purple-700 mb-1">
            Step 02 · Self-Assessment · Target: {career.title}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Skill Assessment
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Check the skills you currently practice and rate your confidence as Beginner, Intermediate, or Advanced.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('careers')}
          className="text-xs font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Switch Career Track
        </button>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-sm text-rose-800"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Technical Skills Section */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-950">Technical Skills</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Core programming languages, databases, and specialized tools for {career.title}
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {selectedSkillsArray.filter((s) => s.category === 'Technical').length} selected
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {technicalList.map((skillName) => {
            const entry = selectedMap[skillName];
            const isSelected = Boolean(entry);
            const isCareerCore = career.requiredSkills.some(
              (r) => r.name.toLowerCase() === skillName.toLowerCase()
            );

            return (
              <div
                key={skillName}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => toggleSkill(skillName, 'Technical')}
                  className="flex items-center gap-3 text-left cursor-pointer"
                >
                  <span
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-purple-700 border-purple-700 text-white'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{skillName}</span>
                  {isCareerCore && (
                    <span className="text-xs text-sky-700 font-medium">
                      · Role Benchmark
                    </span>
                  )}
                </button>

                <div
                  className={`flex items-center gap-1 p-1 rounded-lg bg-slate-100 w-fit ${
                    !isSelected ? 'opacity-60' : ''
                  }`}
                  role="group"
                  aria-label={`${skillName} proficiency`}
                >
                  {PROFICIENCY_OPTIONS.map((level) => {
                    const active = entry?.proficiency === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setProficiency(skillName, 'Technical', level)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-white text-purple-800 shadow-sm font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Soft Skills Section */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-950">Soft Skills</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Workplace collaboration, analytical reasoning, and communication skills
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {selectedSkillsArray.filter((s) => s.category === 'Soft').length} selected
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {softList.map((skillName) => {
            const entry = selectedMap[skillName];
            const isSelected = Boolean(entry);

            return (
              <div
                key={skillName}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => toggleSkill(skillName, 'Soft')}
                  className="flex items-center gap-3 text-left cursor-pointer"
                >
                  <span
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-purple-700 border-purple-700 text-white'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{skillName}</span>
                </button>

                <div
                  className={`flex items-center gap-1 p-1 rounded-lg bg-slate-100 w-fit ${
                    !isSelected ? 'opacity-60' : ''
                  }`}
                  role="group"
                  aria-label={`${skillName} proficiency`}
                >
                  {PROFICIENCY_OPTIONS.map((level) => {
                    const active = entry?.proficiency === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setProficiency(skillName, 'Soft', level)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-white text-purple-800 shadow-sm font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Additional Skill */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
        <h3 className="font-display text-sm font-bold text-slate-900 mb-3">
          Add Another Skill
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="e.g. Docker, PyTorch, TypeScript, Leadership"
            aria-label="Custom skill name"
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <select
            value={newSkillCategory}
            onChange={(e) =>
              setNewSkillCategory(e.target.value === 'Soft' ? 'Soft' : 'Technical')
            }
            aria-label="Custom skill category"
            className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="Technical">Technical</option>
            <option value="Soft">Soft</option>
          </select>
          <button
            type="button"
            onClick={handleAddCustomSkill}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </section>

      {/* Submit Bar */}
      <div className="sticky bottom-4 z-10 rounded-2xl bg-slate-950 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
        <div className="text-sm">
          <span className="font-mono font-bold text-sky-300 tabular-nums">
            {selectedSkillsArray.length}
          </span>{' '}
          <span className="text-slate-300">
            skills selected for <strong className="text-white">{career.title}</strong> analysis
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Skill Gaps...</span>
            </>
          ) : (
            <>
              <span>Submit Skills</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
