import React, { useState } from 'react';
import type { SkillComparisonItem, WeeklyProgressPoint } from '../types.ts';

export function ReadinessRing({
  percentage,
  size = 136,
  strokeWidth = 10,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-label={`Skill readiness ${clamped}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#6D28D9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
          {clamped}%
        </span>
        <span className="text-xs font-medium text-slate-500">Readiness</span>
      </div>
    </div>
  );
}

export function SkillComparisonChart({
  comparisons,
}: {
  comparisons: SkillComparisonItem[];
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (comparisons.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Submit a skill assessment to view your industry skill comparison chart.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-purple-700 inline-block" aria-hidden="true" />
            <span>Your Current Proficiency</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-sky-200 border border-sky-500 inline-block" aria-hidden="true" />
            <span>Required Industry Benchmark</span>
          </span>
        </div>
        <span className="font-mono text-slate-500 tabular-nums">Scale 0 – 100</span>
      </div>

      <div className="space-y-3">
        {comparisons.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={item.skill}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2.5 rounded-lg transition-colors ${
                isHovered ? 'bg-slate-50' : 'bg-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-slate-900 truncate">
                    {item.skill}
                  </span>
                  <span className="text-xs text-slate-400" aria-hidden="true">·</span>
                  <span className="text-xs text-slate-500 shrink-0">{item.category}</span>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="font-mono text-slate-600 tabular-nums">
                    {item.currentScore} / {item.requiredScore}
                  </span>
                  <span
                    className={`font-medium ${
                      item.status === 'Matched'
                        ? 'text-emerald-700'
                        : item.status === 'Needs Depth'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="relative h-3 w-full bg-slate-100 rounded-md overflow-hidden">
                {/* Target Benchmark Bar */}
                <div
                  className="absolute inset-y-0 left-0 bg-sky-100 border-r-2 border-sky-600 transition-all duration-300"
                  style={{ width: `${item.requiredScore}%` }}
                  title={`Required: ${item.requiredLevel} (${item.requiredScore}/100)`}
                />
                {/* Current Skill Bar */}
                <div
                  className={`relative h-full rounded-l-md transition-all duration-500 ${
                    item.status === 'Matched'
                      ? 'bg-purple-700'
                      : item.status === 'Needs Depth'
                      ? 'bg-purple-500'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${item.currentScore}%` }}
                  title={`Current: ${item.currentLevel} (${item.currentScore}/100)`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeeklyProgressChart({
  data,
}: {
  data: WeeklyProgressPoint[];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(Math.max(0, data.length - 1));

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        No weekly activity recorded yet.
      </div>
    );
  }

  const maxHours = Math.max(12, ...data.map((d) => d.hours));
  const chartHeight = 180;
  const chartWidth = 540;
  const paddingX = 36;
  const paddingY = 24;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;
  const barWidth = Math.min(40, plotWidth / data.length - 18);

  const activePoint = data[activeIndex] ?? data[data.length - 1];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" aria-hidden="true" />
            <span>Study Hours</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-700 inline-block" aria-hidden="true" />
            <span>Readiness %</span>
          </span>
        </div>
        {activePoint && (
          <div className="text-xs font-mono text-slate-700 tabular-nums">
            {activePoint.week}: {activePoint.hours} hrs · {activePoint.readiness}% ready
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-48 min-w-[360px]"
          role="img"
          aria-label="Weekly learning hours and readiness progress chart"
        >
          {/* Horizontal reference gridlines */}
          {[0, 0.5, 1].map((fraction) => {
            const y = paddingY + plotHeight * (1 - fraction);
            return (
              <line
                key={fraction}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Bars for study hours */}
          {data.map((point, idx) => {
            const step = plotWidth / data.length;
            const centerX = paddingX + step * idx + step / 2;
            const barH = (point.hours / maxHours) * plotHeight;
            const barY = paddingY + plotHeight - barH;
            const isSelected = idx === activeIndex;

            return (
              <g
                key={point.week}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
              >
                <rect
                  x={centerX - barWidth / 2}
                  y={barY}
                  width={barWidth}
                  height={Math.max(4, barH)}
                  rx={5}
                  fill={isSelected ? '#0284C7' : '#BAE6FD'}
                  className="transition-colors duration-150"
                />
                <text
                  x={centerX}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isSelected ? '#0F172A' : '#64748B'}
                  fontWeight={isSelected ? 600 : 400}
                >
                  {point.week}
                </text>
              </g>
            );
          })}

          {/* Polyline for readiness percentage */}
          <polyline
            fill="none"
            stroke="#6D28D9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data
              .map((point, idx) => {
                const step = plotWidth / data.length;
                const x = paddingX + step * idx + step / 2;
                const y = paddingY + plotHeight - (point.readiness / 100) * plotHeight;
                return `${x},${y}`;
              })
              .join(' ')}
          />

          {/* Data nodes */}
          {data.map((point, idx) => {
            const step = plotWidth / data.length;
            const x = paddingX + step * idx + step / 2;
            const y = paddingY + plotHeight - (point.readiness / 100) * plotHeight;
            const isSelected = idx === activeIndex;
            return (
              <circle
                key={`dot-${point.week}`}
                cx={x}
                cy={y}
                r={isSelected ? 5 : 3.5}
                fill="#FFFFFF"
                stroke="#6D28D9"
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
