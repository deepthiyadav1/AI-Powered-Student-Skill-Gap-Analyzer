import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  buildCuratedRoadmap,
  computeBenchmarkComparison,
  createDemoWorkspace,
  getCareerById,
} from './server/skillEngine.ts';
import type {
  ActivityLogItem,
  RoadmapItem,
  SkillGapAnalysisResult,
  StudentProfile,
  StudentSkill,
  WorkspaceState,
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '.data');
const STORE_PATH = path.join(DATA_DIR, 'skillgap_store.json');

interface StoredUser {
  passwordHash: string;
  workspace: WorkspaceState;
}

interface StoreShape {
  usersByEmail: Record<string, StoredUser>;
  emailById: Record<string, string>;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function loadStore(): StoreShape {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as StoreShape;
      if (parsed && parsed.usersByEmail && parsed.emailById) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read store, initializing fresh seed:', err);
  }

  const demoWorkspace = createDemoWorkspace();
  const initialStore: StoreShape = {
    usersByEmail: {
      [demoWorkspace.student.email]: {
        passwordHash: hashPassword('demo1234'),
        workspace: demoWorkspace,
      },
    },
    emailById: {
      [demoWorkspace.student.id]: demoWorkspace.student.email,
    },
  };
  saveStore(initialStore);
  return initialStore;
}

function saveStore(store: StoreShape): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
}

let store = loadStore();

function getWorkspaceForRequest(req: Request): WorkspaceState | null {
  const studentId = req.header('x-student-id')?.trim();
  if (!studentId) {
    const demoEmail = 'student@skillgap.edu';
    return store.usersByEmail[demoEmail]?.workspace ?? null;
  }
  const email = store.emailById[studentId];
  if (!email) return null;
  return store.usersByEmail[email]?.workspace ?? null;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatGeminiError(error: unknown): { status: number; message: string } {
  const rawMessage = error instanceof Error ? error.message : String(error);
  if (rawMessage.includes('403') || rawMessage.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      message: 'Gemini API permission denied. Please verify your API key in Settings > Secrets.',
    };
  }
  if (rawMessage.includes('400') || rawMessage.includes('API_KEY_INVALID')) {
    return {
      status: 400,
      message: 'Gemini API key is invalid. Please update GEMINI_API_KEY in Settings > Secrets.',
    };
  }
  if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Gemini API rate limit reached. Please wait a moment and try again.',
    };
  }
  if (rawMessage.includes('404') || rawMessage.includes('NOT_FOUND')) {
    return {
      status: 404,
      message: 'Requested Gemini model was not found. Please check model configuration.',
    };
  }
  return {
    status: 502,
    message: `Gemini AI service error: ${rawMessage}`,
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      aiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      collegeName,
      branch,
      yearOfStudy,
    } = req.body ?? {};

    const cleanName = String(fullName ?? '').trim();
    const cleanEmail = String(email ?? '').trim().toLowerCase();
    const cleanPassword = String(password ?? '');
    const cleanConfirm = String(confirmPassword ?? '');
    const cleanCollege = String(collegeName ?? '').trim();
    const cleanBranch = String(branch ?? '').trim();
    const cleanYear = String(yearOfStudy ?? '').trim();

    if (!cleanName || cleanName.length < 2) {
      res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (cleanPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }
    if (cleanPassword !== cleanConfirm) {
      res.status(400).json({ error: 'Password and Confirm Password do not match.' });
      return;
    }
    if (!cleanCollege || !cleanBranch || !cleanYear) {
      res.status(400).json({ error: 'Please complete College Name, Branch, and Year of Study.' });
      return;
    }
    if (store.usersByEmail[cleanEmail]) {
      res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      return;
    }

    const newId = `student-${crypto.randomUUID().slice(0, 8)}`;
    const student: StudentProfile = {
      id: newId,
      fullName: cleanName,
      email: cleanEmail,
      collegeName: cleanCollege,
      branch: cleanBranch,
      yearOfStudy: cleanYear,
      selectedCareerId: 'software-developer',
      streakDays: 1,
      weeklyActivity: [
        { week: 'Week 1', hours: 0, readiness: 0 },
        { week: 'Week 2', hours: 0, readiness: 0 },
        { week: 'Week 3', hours: 0, readiness: 0 },
        { week: 'Week 4', hours: 0, readiness: 0 },
        { week: 'Week 5', hours: 0, readiness: 0 },
        { week: 'Week 6', hours: 1, readiness: 0 },
      ],
      createdAt: new Date().toISOString(),
    };

    const workspace: WorkspaceState = {
      student,
      skills: [],
      latestAnalysis: null,
      roadmap: [],
      activityLog: [],
    };

    store.usersByEmail[cleanEmail] = {
      passwordHash: hashPassword(cleanPassword),
      workspace,
    };
    store.emailById[newId] = cleanEmail;
    saveStore(store);

    res.status(201).json({ workspace });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const cleanEmail = String(req.body?.email ?? '').trim().toLowerCase();
    const cleanPassword = String(req.body?.password ?? '');

    if (!cleanEmail || !cleanPassword) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = store.usersByEmail[cleanEmail];
    if (!user || user.passwordHash !== hashPassword(cleanPassword)) {
      res.status(401).json({ error: 'Invalid email or password. Try demo: student@skillgap.edu / demo1234.' });
      return;
    }

    res.json({ workspace: user.workspace });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const cleanEmail = String(req.body?.email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address to reset your password.' });
      return;
    }
    res.json({
      message: `If an account exists for ${cleanEmail}, a password reset link has been prepared.`,
    });
  });

  app.get('/api/workspace', (req: Request, res: Response) => {
    const workspace = getWorkspaceForRequest(req);
    if (!workspace) {
      res.status(404).json({ error: 'Student session not found. Please log in again.' });
      return;
    }
    res.json({ workspace });
  });

  app.patch('/api/workspace/career', (req: Request, res: Response) => {
    const workspace = getWorkspaceForRequest(req);
    if (!workspace) {
      res.status(404).json({ error: 'Student session not found.' });
      return;
    }
    const careerId = String(req.body?.careerId ?? '').trim();
    const career = getCareerById(careerId);
    workspace.student.selectedCareerId = career.id;
    saveStore(store);
    res.json({ workspace });
  });

  app.post('/api/analyze', async (req: Request, res: Response) => {
    const workspace = getWorkspaceForRequest(req);
    if (!workspace) {
      res.status(404).json({ error: 'Student session not found.' });
      return;
    }

    const careerId = String(req.body?.careerId ?? workspace.student.selectedCareerId);
    const rawSkills = Array.isArray(req.body?.skills) ? (req.body.skills as StudentSkill[]) : [];

    if (rawSkills.length === 0) {
      res.status(400).json({ error: 'Please select and rate at least one skill before running analysis.' });
      return;
    }

    const cleanSkills: StudentSkill[] = rawSkills
      .filter((s) => s && typeof s.name === 'string' && s.name.trim().length > 0)
      .map((s) => ({
        name: s.name.trim(),
        category: s.category === 'Soft' ? 'Soft' : 'Technical',
        proficiency:
          s.proficiency === 'Advanced' || s.proficiency === 'Intermediate'
            ? s.proficiency
            : 'Beginner',
      }));

    const career = getCareerById(careerId);
    workspace.student.selectedCareerId = career.id;
    workspace.skills = cleanSkills;

    const benchmark = computeBenchmarkComparison(career, cleanSkills);

    let aiSummary = '';
    let aiFocusRecommendations: string[] = [];
    let aiPowered = false;
    let aiNotice: string | undefined;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = [
          `Student Profile: ${workspace.student.fullName}, ${workspace.student.branch} (${workspace.student.yearOfStudy}) at ${workspace.student.collegeName}.`,
          `Target Career: ${career.title}.`,
          `Student Current Skills: ${cleanSkills.map((s) => `${s.name} (${s.proficiency})`).join(', ')}.`,
          `Matched Benchmarks: ${benchmark.matchedSkills.join(', ') || 'None yet'}.`,
          `Needs Depth: ${benchmark.needsDepthSkills.join(', ') || 'None'}.`,
          `Missing Skills: ${benchmark.missingSkills.join(', ') || 'None'}.`,
          `Calculated Readiness Score: ${benchmark.readinessPercentage}%.`,
          `Provide a concise, encouraging 2-3 sentence diagnostic summary tailored to this student and 3 specific, actionable focus recommendations to close the missing skill gaps.`,
        ].join('\n');

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            systemInstruction:
              'You are a career readiness advisor for university STEM students. Keep feedback grounded in the exact skills provided, concise, practical, and free of buzzwords.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'A crisp 2-3 sentence assessment of the student strengths and highest-priority gaps.',
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exactly 3 concrete, short action items for the student.',
                },
              },
              required: ['summary', 'recommendations'],
            },
          },
        });

        const parsed = JSON.parse((response.text ?? '{}').trim()) as {
          summary?: string;
          recommendations?: string[];
        };
        if (parsed.summary) {
          aiSummary = parsed.summary;
          aiFocusRecommendations = Array.isArray(parsed.recommendations)
            ? parsed.recommendations.slice(0, 3)
            : [];
          aiPowered = true;
        }
      } catch (err) {
        const formatted = formatGeminiError(err);
        aiNotice = formatted.message;
      }
    } else {
      aiNotice = 'GEMINI_API_KEY is not configured. Showing benchmark matrix analysis.';
    }

    if (!aiSummary) {
      aiSummary =
        benchmark.missingSkills.length > 0
          ? `You match ${benchmark.matchedSkills.length} of ${career.requiredSkills.length} core competencies for ${career.title}. Closing your gaps in ${benchmark.missingSkills.slice(0, 3).join(', ')} will raise your readiness above 80%.`
          : `You meet the core skill benchmarks for ${career.title}. Focus on portfolio projects and system interviews to solidify placement readiness.`;
    }

    if (aiFocusRecommendations.length === 0) {
      aiFocusRecommendations = [
        ...(benchmark.missingSkills.length > 0
          ? [`Prioritize learning ${benchmark.missingSkills.slice(0, 2).join(' and ')} first.`]
          : [`Build an end-to-end ${career.title} capstone repository.`]),
        ...(benchmark.needsDepthSkills.length > 0
          ? [`Elevate ${benchmark.needsDepthSkills[0]} to target industry depth through applied projects.`]
          : ['Document your architecture decisions and unit tests on GitHub.']),
        'Complete weekly learning milestones and track readiness updates in your dashboard.',
      ];
    }

    const analysis: SkillGapAnalysisResult = {
      id: `analysis-${Date.now()}`,
      careerId: career.id,
      careerTitle: career.title,
      readinessPercentage: benchmark.readinessPercentage,
      totalEntered: cleanSkills.length,
      matchedSkills: benchmark.matchedSkills,
      needsDepthSkills: benchmark.needsDepthSkills,
      missingSkills: benchmark.missingSkills,
      comparisons: benchmark.comparisons,
      aiSummary,
      aiFocusRecommendations,
      aiPowered,
      aiNotice,
      createdAt: new Date().toISOString(),
    };

    workspace.latestAnalysis = analysis;
    const latestWeek = workspace.student.weeklyActivity[workspace.student.weeklyActivity.length - 1];
    if (latestWeek) {
      latestWeek.readiness = benchmark.readinessPercentage;
    }

    saveStore(store);
    res.json({ workspace, analysis });
  });

  app.post('/api/roadmap/generate', async (req: Request, res: Response) => {
    const workspace = getWorkspaceForRequest(req);
    if (!workspace) {
      res.status(404).json({ error: 'Student session not found.' });
      return;
    }

    const mode = String(req.body?.mode ?? 'ai');
    const career = getCareerById(String(req.body?.careerId ?? workspace.student.selectedCareerId));
    const benchmark = computeBenchmarkComparison(career, workspace.skills);

    if (mode === 'curated') {
      const curated = buildCuratedRoadmap(career, benchmark.comparisons);
      workspace.roadmap = curated;
      saveStore(store);
      res.json({ workspace, roadmap: curated, aiPowered: false });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY is not configured in environment secrets. You can load the curated benchmark curriculum instead.',
        code: 'MISSING_API_KEY',
      });
      return;
    }

    const missingOrDepth = benchmark.comparisons.filter((c) => c.status !== 'Matched');
    const skillsToCover =
      missingOrDepth.length > 0
        ? missingOrDepth.map((g) => `${g.skill} (status: ${g.status}, target: ${g.requiredLevel})`)
        : [`${career.title} Capstone & System Architecture (Advanced)`];

    try {
      const prompt = [
        `Create a personalized 3-level learning roadmap (Beginner, Intermediate, Advanced) for a ${workspace.student.yearOfStudy} ${workspace.student.branch} student targeting ${career.title}.`,
        `Current matched skills: ${benchmark.matchedSkills.join(', ') || 'None yet'}.`,
        `Skills to learn or deepen: ${skillsToCover.join('; ')}.`,
        `Return between 4 and 8 structured learning modules distributed across Beginner, Intermediate, and Advanced levels. Include realistic estimated hours, duration (e.g. "2 weeks"), priority ("High", "Medium", or "Foundational"), and 2 real, well-known free or standard learning courses/tutorials/documentation URLs per module.`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a technical curriculum architect for university engineering students. Generate clear, practical, realistic course recommendations with accurate HTTPS documentation or MOOC URLs (Coursera, MIT OCW, freeCodeCamp, MDN, TensorFlow.org, HuggingFace, Scikit-Learn, roadmap.sh).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                level: { type: Type.STRING, description: 'One of: Beginner, Intermediate, Advanced' },
                priority: { type: Type.STRING, description: 'One of: High, Medium, Foundational' },
                estimatedHours: { type: Type.INTEGER },
                estimatedDuration: { type: Type.STRING },
                description: { type: Type.STRING },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      provider: { type: Type.STRING },
                      type: { type: Type.STRING, description: 'One of: Course, Tutorial, Documentation, Project' },
                      url: { type: Type.STRING },
                    },
                    required: ['title', 'provider', 'type', 'url'],
                  },
                },
              },
              required: [
                'skill',
                'level',
                'priority',
                'estimatedHours',
                'estimatedDuration',
                'description',
                'resources',
              ],
            },
          },
        },
      });

      const rawItems = JSON.parse((response.text ?? '[]').trim()) as Array<
        Omit<RoadmapItem, 'id' | 'completed'>
      >;

      if (!Array.isArray(rawItems) || rawItems.length === 0) {
        res.status(502).json({
          error: 'Gemini returned an empty roadmap. Please try again or load the curated curriculum.',
        });
        return;
      }

      const roadmap: RoadmapItem[] = rawItems.map((item, idx) => {
        const level: RoadmapItem['level'] =
          item.level === 'Beginner' || item.level === 'Advanced' ? item.level : 'Intermediate';
        const priority: RoadmapItem['priority'] =
          item.priority === 'High' || item.priority === 'Foundational' ? item.priority : 'Medium';

        return {
          id: `rm-ai-${Date.now()}-${idx}`,
          skill: String(item.skill ?? 'Core Competency'),
          level,
          priority,
          estimatedHours: Math.max(2, Number(item.estimatedHours) || 10),
          estimatedDuration: String(item.estimatedDuration || '1–2 weeks'),
          description: String(item.description || 'Structured hands-on skill progression module.'),
          resources: Array.isArray(item.resources)
            ? item.resources.slice(0, 3).map((r) => ({
                title: String(r.title || 'Learning Resource'),
                provider: String(r.provider || 'Online'),
                type:
                  r.type === 'Tutorial' || r.type === 'Documentation' || r.type === 'Project'
                    ? r.type
                    : 'Course',
                url: String(r.url || 'https://roadmap.sh/'),
              }))
            : [],
          completed: false,
        };
      });

      workspace.roadmap = roadmap;
      saveStore(store);
      res.json({ workspace, roadmap, aiPowered: true });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.patch('/api/roadmap/:itemId', (req: Request, res: Response) => {
    const workspace = getWorkspaceForRequest(req);
    if (!workspace) {
      res.status(404).json({ error: 'Student session not found.' });
      return;
    }

    const { itemId } = req.params;
    const completed = Boolean(req.body?.completed);

    const target = workspace.roadmap.find((item) => item.id === itemId);
    if (!target) {
      res.status(404).json({ error: 'Roadmap module not found.' });
      return;
    }

    target.completed = completed;
    target.completedAt = completed ? new Date().toISOString() : undefined;

    if (completed) {
      const exists = workspace.activityLog.some((a) => a.skill === target.skill && a.level === target.level);
      if (!exists) {
        const entry: ActivityLogItem = {
          id: `act-${Date.now()}`,
          title: `Completed ${target.skill} Module`,
          skill: target.skill,
          level: target.level,
          hours: target.estimatedHours,
          completedAt: new Date().toISOString(),
        };
        workspace.activityLog.unshift(entry);

        const latestWeek = workspace.student.weeklyActivity[workspace.student.weeklyActivity.length - 1];
        if (latestWeek) {
          latestWeek.hours = Number((latestWeek.hours + Math.min(4, target.estimatedHours * 0.25)).toFixed(1));
          latestWeek.readiness = Math.min(100, latestWeek.readiness + 4);
        }
      }
    } else {
      workspace.activityLog = workspace.activityLog.filter((a) => a.skill !== target.skill);
    }

    saveStore(store);
    res.json({ workspace });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`SkillGap AI server running on http://0.0.0.0:${port}`);
  });
}

createServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
