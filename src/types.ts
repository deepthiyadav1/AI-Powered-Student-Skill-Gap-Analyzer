export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export type PageId =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'careers'
  | 'assessment'
  | 'analysis'
  | 'roadmap'
  | 'progress';

export interface WeeklyProgressPoint {
  week: string;
  hours: number;
  readiness: number;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  branch: string;
  yearOfStudy: string;
  selectedCareerId: string;
  streakDays: number;
  weeklyActivity: WeeklyProgressPoint[];
  createdAt: string;
}

export interface StudentSkill {
  name: string;
  category: 'Technical' | 'Soft';
  proficiency: Proficiency;
}

export interface RequiredSkillSpec {
  name: string;
  category: 'Technical' | 'Soft';
  targetLevel: Proficiency;
  weight: number;
}

export interface CareerTrack {
  id: string;
  title: string;
  shortDescription: string;
  demandLabel: string;
  avgSalaryRange: string;
  iconKey: 'code' | 'database' | 'brain' | 'globe' | 'chart' | 'shield';
  requiredSkills: RequiredSkillSpec[];
}

export interface SkillComparisonItem {
  skill: string;
  category: 'Technical' | 'Soft';
  requiredLevel: Proficiency;
  requiredScore: number;
  currentLevel: Proficiency | 'None';
  currentScore: number;
  status: 'Matched' | 'Needs Depth' | 'Missing';
}

export interface SkillGapAnalysisResult {
  id: string;
  careerId: string;
  careerTitle: string;
  readinessPercentage: number;
  totalEntered: number;
  matchedSkills: string[];
  needsDepthSkills: string[];
  missingSkills: string[];
  comparisons: SkillComparisonItem[];
  aiSummary: string;
  aiFocusRecommendations: string[];
  aiPowered: boolean;
  aiNotice?: string;
  createdAt: string;
}

export interface RoadmapResource {
  title: string;
  provider: string;
  type: 'Course' | 'Tutorial' | 'Documentation' | 'Project';
  url: string;
}

export interface RoadmapItem {
  id: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  priority: 'High' | 'Medium' | 'Foundational';
  estimatedHours: number;
  estimatedDuration: string;
  description: string;
  resources: RoadmapResource[];
  completed: boolean;
  completedAt?: string;
}

export interface ActivityLogItem {
  id: string;
  title: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  hours: number;
  completedAt: string;
}

export interface WorkspaceState {
  student: StudentProfile;
  skills: StudentSkill[];
  latestAnalysis: SkillGapAnalysisResult | null;
  roadmap: RoadmapItem[];
  activityLog: ActivityLogItem[];
}
