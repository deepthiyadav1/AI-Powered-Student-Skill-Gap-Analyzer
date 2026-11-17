import {
  CAREER_TRACKS,
  DEMO_INITIAL_SKILLS,
  PROFICIENCY_SCORE_MAP,
} from '../src/data/careers.ts';
import type {
  ActivityLogItem,
  CareerTrack,
  Proficiency,
  RoadmapItem,
  SkillComparisonItem,
  SkillGapAnalysisResult,
  StudentProfile,
  StudentSkill,
  WorkspaceState,
} from '../src/types.ts';

export function getCareerById(careerId: string): CareerTrack {
  return CAREER_TRACKS.find((c) => c.id === careerId) ?? CAREER_TRACKS[2]; // default AI/ML Engineer
}

export function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase();
}

export function computeBenchmarkComparison(
  career: CareerTrack,
  skills: StudentSkill[]
): {
  readinessPercentage: number;
  matchedSkills: string[];
  needsDepthSkills: string[];
  missingSkills: string[];
  comparisons: SkillComparisonItem[];
} {
  const skillLookup = new Map<string, StudentSkill>();
  for (const s of skills) {
    skillLookup.set(normalizeSkillName(s.name), s);
  }

  let totalWeight = 0;
  let earnedWeight = 0;

  const matchedSkills: string[] = [];
  const needsDepthSkills: string[] = [];
  const missingSkills: string[] = [];
  const comparisons: SkillComparisonItem[] = [];

  for (const req of career.requiredSkills) {
    totalWeight += req.weight;
    const reqScore = PROFICIENCY_SCORE_MAP[req.targetLevel];
    const studentSkill = skillLookup.get(normalizeSkillName(req.name));

    let currentLevel: Proficiency | 'None' = 'None';
    let currentScore = 0;
    let status: 'Matched' | 'Needs Depth' | 'Missing' = 'Missing';

    if (studentSkill) {
      currentLevel = studentSkill.proficiency;
      currentScore = PROFICIENCY_SCORE_MAP[studentSkill.proficiency];

      if (currentScore >= reqScore) {
        status = 'Matched';
        matchedSkills.push(req.name);
        earnedWeight += req.weight;
      } else {
        status = 'Needs Depth';
        needsDepthSkills.push(req.name);
        earnedWeight += req.weight * (currentScore / reqScore);
      }
    } else {
      missingSkills.push(req.name);
    }

    comparisons.push({
      skill: req.name,
      category: req.category,
      requiredLevel: req.targetLevel,
      requiredScore: reqScore,
      currentLevel,
      currentScore,
      status,
    });
  }

  const readinessPercentage =
    totalWeight > 0 ? Math.min(100, Math.round((earnedWeight / totalWeight) * 100)) : 0;

  return {
    readinessPercentage,
    matchedSkills,
    needsDepthSkills,
    missingSkills,
    comparisons,
  };
}

const CURATED_RESOURCE_LIBRARY: Record<
  string,
  {
    duration: string;
    hours: number;
    description: string;
    resources: RoadmapItem['resources'];
  }
> = {
  'Deep Learning': {
    duration: '2 weeks',
    hours: 18,
    description:
      'Build neural networks from backpropagation fundamentals to CNNs, regularization, and optimization.',
    resources: [
      {
        title: 'Neural Networks and Deep Learning (DeepLearning.AI)',
        provider: 'Coursera',
        type: 'Course',
        url: 'https://www.coursera.org/learn/neural-networks-deep-learning',
      },
      {
        title: 'MIT 6.S191 Introduction to Deep Learning',
        provider: 'MIT OpenCourseWare',
        type: 'Tutorial',
        url: 'https://introtodeeplearning.com/',
      },
    ],
  },
  TensorFlow: {
    duration: '2 weeks',
    hours: 14,
    description:
      'Implement production training loops, Keras functional models, tf.data pipelines, and SavedModel exports.',
    resources: [
      {
        title: 'TensorFlow 2 Official Core Tutorials',
        provider: 'TensorFlow.org',
        type: 'Documentation',
        url: 'https://www.tensorflow.org/tutorials',
      },
      {
        title: 'TensorFlow Developer Certificate Prep',
        provider: 'DeepLearning.AI',
        type: 'Course',
        url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice',
      },
    ],
  },
  'Natural Language Processing': {
    duration: '2 weeks',
    hours: 16,
    description:
      'Master tokenization, word embeddings, attention mechanisms, and fine-tuning transformer architectures.',
    resources: [
      {
        title: 'Hugging Face NLP Course',
        provider: 'Hugging Face',
        type: 'Course',
        url: 'https://huggingface.co/learn/nlp-course',
      },
      {
        title: 'Stanford CS224N: NLP with Deep Learning',
        provider: 'Stanford Online',
        type: 'Tutorial',
        url: 'https://web.stanford.edu/class/cs224n/',
      },
    ],
  },
  'Computer Vision': {
    duration: '2 weeks',
    hours: 15,
    description:
      'Train image classifiers, object detectors, and segmentation pipelines using OpenCV and convolutional models.',
    resources: [
      {
        title: 'Stanford CS231n Deep Learning for Computer Vision',
        provider: 'Stanford',
        type: 'Course',
        url: 'https://cs231n.stanford.edu/',
      },
      {
        title: 'OpenCV Python Official Guide',
        provider: 'OpenCV',
        type: 'Documentation',
        url: 'https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html',
      },
    ],
  },
  'Machine Learning': {
    duration: '2 weeks',
    hours: 16,
    description:
      'Strengthen supervised and unsupervised workflows, cross-validation, feature engineering, and model evaluation.',
    resources: [
      {
        title: 'Machine Learning Specialization',
        provider: 'Stanford / DeepLearning.AI',
        type: 'Course',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      },
      {
        title: 'Scikit-Learn User Guide & Examples',
        provider: 'Scikit-Learn',
        type: 'Documentation',
        url: 'https://scikit-learn.org/stable/user_guide.html',
      },
    ],
  },
  Python: {
    duration: '1.5 weeks',
    hours: 12,
    description:
      'Advance into idiomatic Python, decorators, generators, typing, virtual environments, and vectorized computing.',
    resources: [
      {
        title: 'Python Official Tutorial & Typing Docs',
        provider: 'Python.org',
        type: 'Documentation',
        url: 'https://docs.python.org/3/tutorial/',
      },
      {
        title: 'CS50P: Introduction to Programming with Python',
        provider: 'HarvardX',
        type: 'Course',
        url: 'https://cs50.harvard.edu/python/',
      },
    ],
  },
};

export function buildCuratedRoadmap(
  career: CareerTrack,
  comparisons: SkillComparisonItem[]
): RoadmapItem[] {
  const gaps = comparisons.filter((c) => c.status !== 'Matched');
  if (gaps.length === 0) {
    return [
      {
        id: 'rm-capstone-1',
        skill: `${career.title} Capstone Project`,
        level: 'Advanced',
        priority: 'Medium',
        estimatedHours: 20,
        estimatedDuration: '2 weeks',
        description: `All core benchmarks for ${career.title} are matched. Build an end-to-end production portfolio project with automated tests and deployment.`,
        resources: [
          {
            title: 'Full Stack System Architecture & Portfolio Guide',
            provider: 'roadmap.sh',
            type: 'Project',
            url: 'https://roadmap.sh/',
          },
        ],
        completed: false,
      },
    ];
  }

  return gaps.map((gap, index) => {
    const library = CURATED_RESOURCE_LIBRARY[gap.skill];
    let level: RoadmapItem['level'] = 'Intermediate';
    if (gap.requiredLevel === 'Beginner' || (gap.status === 'Missing' && gap.category === 'Soft')) {
      level = 'Beginner';
    } else if (gap.requiredLevel === 'Advanced' && gap.status === 'Missing') {
      level = 'Advanced';
    } else if (gap.status === 'Needs Depth' && gap.requiredLevel === 'Intermediate') {
      level = 'Beginner';
    } else if (gap.skill === 'Computer Vision' || gap.skill === 'Natural Language Processing') {
      level = 'Advanced';
    }

    const priority: RoadmapItem['priority'] =
      gap.status === 'Missing' ? 'High' : gap.requiredLevel === 'Advanced' ? 'High' : 'Medium';

    return {
      id: `rm-${index + 1}-${gap.skill.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      skill: gap.skill,
      level,
      priority,
      estimatedHours: library?.hours ?? (gap.status === 'Missing' ? 14 : 8),
      estimatedDuration: library?.duration ?? (gap.status === 'Missing' ? '2 weeks' : '1 week'),
      description:
        library?.description ??
        (gap.status === 'Missing'
          ? `Close your foundational gap in ${gap.skill} to reach the ${gap.requiredLevel} standard expected for ${career.title} roles.`
          : `Upgrade ${gap.skill} from ${gap.currentLevel} to ${gap.requiredLevel} through applied exercises and portfolio projects.`),
      resources: library?.resources ?? [
        {
          title: `${gap.skill} Guided Path & Practical Exercises`,
          provider: 'roadmap.sh',
          type: 'Course',
          url: 'https://roadmap.sh/',
        },
        {
          title: `Applied ${gap.skill} Mini-Project Specification`,
          provider: 'freeCodeCamp',
          type: 'Project',
          url: 'https://www.freecodecamp.org/learn',
        },
      ],
      completed: false,
    };
  });
}

export function createDemoWorkspace(): WorkspaceState {
  const career = getCareerById('ai-ml-engineer');
  const benchmark = computeBenchmarkComparison(career, DEMO_INITIAL_SKILLS);
  const roadmap = buildCuratedRoadmap(career, benchmark.comparisons);

  // Mark one foundational item completed so Dashboard & Progress Tracking look realistic on first login
  const completedItem = roadmap.find((item) => item.skill === 'Problem Solving');
  const activityLog: ActivityLogItem[] = [];
  if (completedItem) {
    completedItem.completed = true;
    completedItem.completedAt = '2026-11-15T14:30:00Z';
    activityLog.push({
      id: 'act-seed-1',
      title: `Completed ${completedItem.skill} Benchmark Module`,
      skill: completedItem.skill,
      level: completedItem.level,
      hours: completedItem.estimatedHours,
      completedAt: '2026-11-15T14:30:00Z',
    });
  }

  const student: StudentProfile = {
    id: 'demo-student-1',
    fullName: 'Aarav Sharma',
    email: 'student@skillgap.edu',
    collegeName: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    yearOfStudy: '3rd Year',
    selectedCareerId: career.id,
    streakDays: 7,
    weeklyActivity: [
      { week: 'Week 1', hours: 4.5, readiness: 34 },
      { week: 'Week 2', hours: 6.0, readiness: 41 },
      { week: 'Week 3', hours: 7.5, readiness: 46 },
      { week: 'Week 4', hours: 6.5, readiness: 50 },
      { week: 'Week 5', hours: 9.0, readiness: 54 },
      { week: 'Week 6', hours: 10.5, readiness: benchmark.readinessPercentage },
    ],
    createdAt: '2026-10-01T09:00:00Z',
  };

  const latestAnalysis: SkillGapAnalysisResult = {
    id: 'analysis-seed-1',
    careerId: career.id,
    careerTitle: career.title,
    readinessPercentage: benchmark.readinessPercentage,
    totalEntered: DEMO_INITIAL_SKILLS.length,
    matchedSkills: benchmark.matchedSkills,
    needsDepthSkills: benchmark.needsDepthSkills,
    missingSkills: benchmark.missingSkills,
    comparisons: benchmark.comparisons,
    aiSummary:
      'Strong core programming foundation in Python, C Programming, SQL, and Data Structures. To qualify for AI/ML Engineer internships, prioritize Neural Network theory (Deep Learning), production framework fluency (TensorFlow), and applied NLP/Computer Vision projects.',
    aiFocusRecommendations: [
      'Deepen Machine Learning foundations into Deep Learning architectures.',
      'Build two end-to-end TensorFlow projects with clean evaluation metrics.',
      'Complete an NLP transformer fine-tuning lab before interview season.',
    ],
    aiPowered: false,
    createdAt: '2026-11-16T10:15:00Z',
  };

  return {
    student,
    skills: DEMO_INITIAL_SKILLS,
    latestAnalysis,
    roadmap,
    activityLog,
  };
}
