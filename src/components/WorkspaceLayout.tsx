import React, { useState } from 'react';
import {
  BarChart3,
  Briefcase,
  CheckSquare,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  TrendingUp,
  X,
} from 'lucide-react';
import { BrandMark, SafeImage } from './BrandMark.tsx';
import type { PageId, StudentProfile } from '../types.ts';

interface WorkspaceLayoutProps {
  currentPage: PageId;
  student: StudentProfile;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'careers', label: 'Career Selection', icon: Briefcase },
  { id: 'assessment', label: 'Skill Assessment', icon: ClipboardList },
  { id: 'analysis', label: 'Skill Gap Analysis', icon: BarChart3 },
  { id: 'roadmap', label: 'Learning Roadmap', icon: Map },
  { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
];

const PAGE_TITLES: Record<PageId, string> = {
  landing: 'Home',
  auth: 'Account',
  dashboard: 'Student Dashboard',
  careers: 'Career Selection',
  assessment: 'Skill Assessment',
  analysis: 'AI Skill Gap Analysis',
  roadmap: 'Personalized Learning Roadmap',
  progress: 'Progress Tracking',
};

export function WorkspaceLayout({
  currentPage,
  student,
  onNavigate,
  onLogout,
  children,
}: WorkspaceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (id: PageId) => {
    setSidebarOpen(false);
    onNavigate(id);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BrandMark className="w-6 h-6" />
          <span className="font-display font-bold text-base text-white tracking-tight">
            SkillGap AI
          </span>
        </button>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Student Profile Summary */}
      <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3">
        <SafeImage
          src="/src/assets/images/avatar_student_profile_1794910146094.jpg"
          alt={student.fullName}
          className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
          fallbackTitle={student.fullName.slice(0, 2).toUpperCase()}
          fallbackSubtitle=""
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{student.fullName}</p>
          <p className="text-xs text-slate-400 truncate">
            {student.yearOfStudy} · {student.branch}
          </p>
        </div>
      </div>

      {/* Workspace Navigation */}
      <nav aria-label="Workspace Navigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-purple-700 text-white'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Public Homepage</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 hidden sm:inline">Workspace</span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">/</span>
              <span className="font-display font-semibold text-slate-900 truncate">
                {PAGE_TITLES[currentPage]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {currentPage !== 'assessment' && (
              <button
                type="button"
                onClick={() => onNavigate('assessment')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Analyze My Skills</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
