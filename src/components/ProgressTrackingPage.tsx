import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Flame,
  Printer,
  X,
} from 'lucide-react';
import { CAREER_TRACKS } from '../data/careers.ts';
import { WeeklyProgressChart } from './Charts.tsx';
import type { PageId, WorkspaceState } from '../types.ts';

interface ProgressTrackingPageProps {
  workspace: WorkspaceState;
  onNavigate: (page: PageId) => void;
}

export function ProgressTrackingPage({
  workspace,
  onNavigate,
}: ProgressTrackingPageProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const { student, roadmap, activityLog, latestAnalysis } = workspace;
  const career =
    CAREER_TRACKS.find((c) => c.id === student.selectedCareerId) ?? CAREER_TRACKS[0];

  const skillsCompleted = roadmap.filter((r) => r.completed).length;
  const skillsRemaining = roadmap.filter((r) => !r.completed).length;
  const totalModules = roadmap.length;
  const learningProgressPct =
    totalModules > 0 ? Math.round((skillsCompleted / totalModules) * 100) : 0;

  const totalHoursCompleted = activityLog.reduce((sum, a) => sum + a.hours, 0);

  const buildReportText = () => {
    const lines = [
      'SKILLGAP AI — STUDENT SKILL GAP & READINESS REPORT',
      '===================================================',
      `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      '',
      'STUDENT PROFILE',
      `Name: ${student.fullName}`,
      `Email: ${student.email}`,
      `College: ${student.collegeName}`,
      `Branch: ${student.branch}`,
      `Year of Study: ${student.yearOfStudy}`,
      '',
      'CAREER READINESS SUMMARY',
      `Target Career: ${career.title}`,
      `Skill Readiness Score: ${latestAnalysis?.readinessPercentage ?? 0}%`,
      `Skills Entered: ${workspace.skills.length}`,
      `Matched Benchmarks: ${latestAnalysis?.matchedSkills.join(', ') || 'None'}`,
      `Needs Depth: ${latestAnalysis?.needsDepthSkills.join(', ') || 'None'}`,
      `Missing Skills: ${latestAnalysis?.missingSkills.join(', ') || 'None'}`,
      '',
      'DIAGNOSTIC SUMMARY',
      latestAnalysis?.aiSummary ?? 'No analysis submitted yet.',
      '',
      'LEARNING ROADMAP PROGRESS',
      `Modules Completed: ${skillsCompleted} / ${totalModules} (${learningProgressPct}%)`,
      `Current Learning Streak: ${student.streakDays} Days`,
      `Estimated Study Hours Completed: ${totalHoursCompleted} hrs`,
      '',
      'ROADMAP MODULES',
      ...roadmap.map(
        (m, i) =>
          `${i + 1}. [${m.completed ? 'COMPLETED' : 'PENDING'}] ${m.skill} (${m.level} Level · ${m.priority} Priority · ${m.estimatedDuration})`
      ),
    ];
    return lines.join('\n');
  };

  const handleDownloadReport = () => {
    const content = buildReportText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = student.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    link.href = url;
    link.download = `SkillGap_AI_Report_${safeName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadNotice(`Downloaded SkillGap_AI_Report_${safeName}.txt`);
  };

  const streakDaysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      {/* Header & Download Report CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-semibold text-purple-700 mb-1">
            Learning Analytics · {career.title}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Progress Tracking
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Monitor completed skills, weekly study momentum, and export your official skill gap report.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Preview Report</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Skill Gap Report</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-sm text-emerald-800"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadNotice}</span>
          </span>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">Skills Completed</p>
          <p className="mt-2 font-mono text-3xl font-bold text-emerald-700 tabular-nums">
            {skillsCompleted}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {totalHoursCompleted} study hrs completed
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">Skills Remaining</p>
          <p className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {skillsRemaining}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Scheduled in roadmap
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500">Learning Progress</p>
          <p className="mt-2 font-mono text-3xl font-bold text-purple-700 tabular-nums">
            {learningProgressPct}%
          </p>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-700 transition-all duration-300"
              style={{ width: `${learningProgressPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 text-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-300">Current Learning Streak</p>
            <Flame className="w-4 h-4 text-sky-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-sky-300 tabular-nums">
            {student.streakDays} Days
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            {streakDaysLabels.map((day, idx) => {
              const active = idx < Math.min(7, student.streakDays);
              return (
                <span
                  key={day}
                  title={`${day}: ${active ? 'Active' : 'Upcoming'}`}
                  className={`flex-1 h-1.5 rounded-full ${
                    active ? 'bg-sky-400' : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Weekly Chart & Completed Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-slate-950">
              Weekly Progress Chart
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hover or tap any week to inspect hours studied and readiness progression
            </p>
          </div>
          <WeeklyProgressChart data={student.weeklyActivity} />
        </section>

        <section className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h2 className="font-display text-lg font-bold text-slate-950">
              Completed Learning Activities
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 cursor-pointer"
            >
              Open Roadmap
            </button>
          </div>

          {activityLog.length > 0 ? (
            <ul className="divide-y divide-slate-100 mt-2">
              {activityLog.map((act) => (
                <li key={act.id} className="py-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {act.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {act.level} Level · {new Date(act.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums shrink-0">
                    +{act.hours} hrs
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-slate-600">
                No roadmap modules have been marked completed yet.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-2 rounded-lg bg-slate-950 text-white text-xs font-semibold cursor-pointer"
              >
                Start First Module
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Report Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 id="report-modal-title" className="font-display font-bold text-lg text-slate-950">
                Skill Gap Report Preview
              </h2>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close report preview"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {buildReportText()}
              </pre>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Report (.txt)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
