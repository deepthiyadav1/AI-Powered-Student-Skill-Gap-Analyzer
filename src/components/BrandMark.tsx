import React, { useState } from 'react';
import { Compass } from 'lucide-react';

export function BrandMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#0F172A" />
      <path
        d="M16 5L19.2 12.8L27 16L19.2 19.2L16 27L12.8 19.2L5 16L12.8 12.8L16 5Z"
        fill="#6D28D9"
      />
      <circle cx="16" cy="16" r="3" fill="#38BDF8" />
    </svg>
  );
}

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'SkillGap AI',
  fallbackSubtitle = 'Career & Skill Intelligence',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950 text-white p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Compass className="w-10 h-10 text-sky-400 mb-3" />
        <p className="font-display font-semibold text-base text-center">{fallbackTitle}</p>
        <p className="text-xs text-slate-300 mt-1 text-center">{fallbackSubtitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
