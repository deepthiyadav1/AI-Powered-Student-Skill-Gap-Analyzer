import React, { useCallback, useEffect, useState } from 'react';
import { CAREER_TRACKS } from './data/careers.ts';
import { AuthPage } from './components/AuthPage.tsx';
import { CareerSelectionPage } from './components/CareerSelectionPage.tsx';
import { DashboardPage } from './components/DashboardPage.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { LearningRoadmapPage } from './components/LearningRoadmapPage.tsx';
import { ProgressTrackingPage } from './components/ProgressTrackingPage.tsx';
import { SkillAssessmentPage } from './components/SkillAssessmentPage.tsx';
import { SkillGapAnalysisPage } from './components/SkillGapAnalysisPage.tsx';
import { WorkspaceLayout } from './components/WorkspaceLayout.tsx';
import type { PageId, StudentSkill, WorkspaceState } from './types.ts';

const STORAGE_KEY = 'skillgap_student_id';

const VALID_PAGES: PageId[] = [
  'landing',
  'auth',
  'dashboard',
  'careers',
  'assessment',
  'analysis',
  'roadmap',
  'progress',
];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace(/^#\/?/, '') as PageId;
  if (VALID_PAGES.includes(hash)) {
    return hash;
  }
  return 'landing';
}

export default function App() {
  const [page, setPage] = useState<PageId>(getInitialPage);
  const [studentId, setStudentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);

  const navigate = useCallback((nextPage: PageId) => {
    setPage(nextPage);
    window.location.hash = nextPage === 'landing' ? '' : `#${nextPage}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') as PageId;
      if (VALID_PAGES.includes(hash)) {
        setPage(hash);
      } else if (!hash) {
        setPage('landing');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const fetchWorkspace = useCallback(async (id: string) => {
    setLoadingWorkspace(true);
    try {
      const res = await fetch('/api/workspace', {
        headers: { 'x-student-id': id },
      });
      if (!res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        setStudentId(null);
        setWorkspace(null);
        return;
      }
      const data = await res.json();
      setWorkspace(data.workspace as WorkspaceState);
    } catch {
      // keep existing state on transient error
    } finally {
      setLoadingWorkspace(false);
    }
  }, []);

  useEffect(() => {
    if (studentId && !workspace) {
      void fetchWorkspace(studentId);
    }
  }, [studentId, workspace, fetchWorkspace]);

  const handleAuthSuccess = (nextWorkspace: WorkspaceState) => {
    try {
      localStorage.setItem(STORAGE_KEY, nextWorkspace.student.id);
    } catch {
      // ignore storage quota errors
    }
    setStudentId(nextWorkspace.student.id);
    setWorkspace(nextWorkspace);
    navigate('dashboard');
  };

  const handleDemoLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@skillgap.edu',
          password: 'demo1234',
        }),
      });
      const data = await res.json();
      if (res.ok && data.workspace) {
        handleAuthSuccess(data.workspace as WorkspaceState);
      } else {
        navigate('auth');
      }
    } catch {
      navigate('auth');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStudentId(null);
    setWorkspace(null);
    navigate('landing');
  };

  const handleSelectCareer = async (careerId: string) => {
    if (!workspace) return;
    const res = await fetch('/api/workspace/career', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': workspace.student.id,
      },
      body: JSON.stringify({ careerId }),
    });
    const data = await res.json();
    if (res.ok && data.workspace) {
      setWorkspace(data.workspace as WorkspaceState);
    }
  };

  const handleSubmitSkills = async (careerId: string, skills: StudentSkill[]) => {
    if (!workspace) return;
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': workspace.student.id,
      },
      body: JSON.stringify({ careerId, skills }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? 'Failed to analyze skills.');
    }
    setWorkspace(data.workspace as WorkspaceState);
    navigate('analysis');
  };

  const handleGenerateRoadmap = async (
    mode: 'ai' | 'curated'
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!workspace) return { ok: false, error: 'Not signed in.' };
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': workspace.student.id,
        },
        body: JSON.stringify({
          careerId: workspace.student.selectedCareerId,
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error ?? 'Failed to generate learning roadmap.' };
      }
      setWorkspace(data.workspace as WorkspaceState);
      navigate('roadmap');
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while generating roadmap.' };
    }
  };

  const handleToggleRoadmapItem = async (itemId: string, completed: boolean) => {
    if (!workspace) return;
    const res = await fetch(`/api/roadmap/${encodeURIComponent(itemId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': workspace.student.id,
      },
      body: JSON.stringify({ completed }),
    });
    const data = await res.json();
    if (res.ok && data.workspace) {
      setWorkspace(data.workspace as WorkspaceState);
    }
  };

  if (page === 'landing') {
    return (
      <LandingPage
        isAuthenticated={Boolean(workspace)}
        onNavigate={navigate}
        onDemoLogin={handleDemoLogin}
      />
    );
  }

  if (page === 'auth' || (!workspace && !loadingWorkspace)) {
    return <AuthPage onSuccess={handleAuthSuccess} onBack={navigate} />;
  }

  if (loadingWorkspace || !workspace) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-2xl bg-white border border-slate-200 px-8 py-6 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-700">Loading student workspace...</p>
        </div>
      </div>
    );
  }

  const selectedCareer =
    CAREER_TRACKS.find((c) => c.id === workspace.student.selectedCareerId) ??
    CAREER_TRACKS[2];

  return (
    <WorkspaceLayout
      currentPage={page}
      student={workspace.student}
      onNavigate={navigate}
      onLogout={handleLogout}
    >
      {page === 'dashboard' && (
        <DashboardPage workspace={workspace} onNavigate={navigate} />
      )}

      {page === 'careers' && (
        <CareerSelectionPage
          selectedCareerId={workspace.student.selectedCareerId}
          onSelectCareer={handleSelectCareer}
          onNavigate={navigate}
        />
      )}

      {page === 'assessment' && (
        <SkillAssessmentPage
          selectedCareerId={workspace.student.selectedCareerId}
          initialSkills={workspace.skills}
          onSubmitSkills={handleSubmitSkills}
          onNavigate={navigate}
        />
      )}

      {page === 'analysis' && (
        <SkillGapAnalysisPage
          analysis={workspace.latestAnalysis}
          currentSkills={workspace.skills}
          onGenerateRoadmap={handleGenerateRoadmap}
          onNavigate={navigate}
        />
      )}

      {page === 'roadmap' && (
        <LearningRoadmapPage
          careerTitle={selectedCareer.title}
          roadmap={workspace.roadmap}
          onToggleComplete={handleToggleRoadmapItem}
          onRegenerateRoadmap={handleGenerateRoadmap}
          onNavigate={navigate}
        />
      )}

      {page === 'progress' && (
        <ProgressTrackingPage workspace={workspace} onNavigate={navigate} />
      )}
    </WorkspaceLayout>
  );
}
