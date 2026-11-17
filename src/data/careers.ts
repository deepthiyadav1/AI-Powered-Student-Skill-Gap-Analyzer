import type { CareerTrack, Proficiency, StudentSkill } from '../types.ts';

export const DEFAULT_TECHNICAL_SKILLS: string[] = [
  'Python',
  'Java',
  'C Programming',
  'HTML',
  'CSS',
  'JavaScript',
  'SQL',
  'Machine Learning',
  'Data Structures',
];

export const DEFAULT_SOFT_SKILLS: string[] = [
  'Communication',
  'Problem Solving',
  'Teamwork',
  'Critical Thinking',
];

export const CAREER_SPECIFIC_SUGGESTIONS: Record<string, string[]> = {
  'software-developer': ['Git & GitHub', 'TypeScript', 'System Design', 'REST APIs', 'Docker'],
  'data-scientist': ['Statistics', 'Pandas & NumPy', 'Data Visualization', 'Scikit-Learn', 'R Programming'],
  'ai-ml-engineer': ['Deep Learning', 'TensorFlow', 'Natural Language Processing', 'Computer Vision', 'PyTorch'],
  'web-developer': ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
  'data-analyst': ['Excel & Spreadsheets', 'Tableau / Power BI', 'Statistics', 'Data Cleaning', 'Storytelling with Data'],
  'cybersecurity-analyst': ['Network Security', 'Linux Administration', 'Ethical Hacking', 'SIEM & Threat Detection', 'Cryptography'],
};

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'software-developer',
    title: 'Software Developer',
    shortDescription:
      'Design, build, test, and scale reliable backend services, desktop software, and full-stack applications.',
    demandLabel: 'High Demand · 10 Core Competencies',
    avgSalaryRange: '$85k – $135k',
    iconKey: 'code',
    requiredSkills: [
      { name: 'Data Structures', category: 'Technical', targetLevel: 'Advanced', weight: 15 },
      { name: 'Java', category: 'Technical', targetLevel: 'Intermediate', weight: 12 },
      { name: 'Python', category: 'Technical', targetLevel: 'Intermediate', weight: 12 },
      { name: 'SQL', category: 'Technical', targetLevel: 'Intermediate', weight: 11 },
      { name: 'Git & GitHub', category: 'Technical', targetLevel: 'Intermediate', weight: 10 },
      { name: 'REST APIs', category: 'Technical', targetLevel: 'Intermediate', weight: 10 },
      { name: 'System Design', category: 'Technical', targetLevel: 'Beginner', weight: 10 },
      { name: 'Problem Solving', category: 'Soft', targetLevel: 'Advanced', weight: 8 },
      { name: 'Teamwork', category: 'Soft', targetLevel: 'Intermediate', weight: 6 },
      { name: 'Communication', category: 'Soft', targetLevel: 'Intermediate', weight: 6 },
    ],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    shortDescription:
      'Turn complex raw datasets into predictive models, statistical experiments, and actionable business intelligence.',
    demandLabel: 'High Demand · 9 Core Competencies',
    avgSalaryRange: '$95k – $145k',
    iconKey: 'database',
    requiredSkills: [
      { name: 'Python', category: 'Technical', targetLevel: 'Advanced', weight: 16 },
      { name: 'SQL', category: 'Technical', targetLevel: 'Intermediate', weight: 14 },
      { name: 'Machine Learning', category: 'Technical', targetLevel: 'Intermediate', weight: 15 },
      { name: 'Statistics', category: 'Technical', targetLevel: 'Advanced', weight: 14 },
      { name: 'Pandas & NumPy', category: 'Technical', targetLevel: 'Intermediate', weight: 12 },
      { name: 'Data Visualization', category: 'Technical', targetLevel: 'Intermediate', weight: 10 },
      { name: 'Critical Thinking', category: 'Soft', targetLevel: 'Advanced', weight: 7 },
      { name: 'Problem Solving', category: 'Soft', targetLevel: 'Intermediate', weight: 6 },
      { name: 'Communication', category: 'Soft', targetLevel: 'Intermediate', weight: 6 },
    ],
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    shortDescription:
      'Architect, train, and deploy neural networks, NLP pipelines, and computer vision models into production.',
    demandLabel: 'Fastest Growing · 10 Core Competencies',
    avgSalaryRange: '$110k – $165k',
    iconKey: 'brain',
    requiredSkills: [
      { name: 'Python', category: 'Technical', targetLevel: 'Advanced', weight: 14 },
      { name: 'Machine Learning', category: 'Technical', targetLevel: 'Advanced', weight: 14 },
      { name: 'Deep Learning', category: 'Technical', targetLevel: 'Intermediate', weight: 14 },
      { name: 'TensorFlow', category: 'Technical', targetLevel: 'Intermediate', weight: 12 },
      { name: 'Natural Language Processing', category: 'Technical', targetLevel: 'Intermediate', weight: 11 },
      { name: 'Computer Vision', category: 'Technical', targetLevel: 'Beginner', weight: 10 },
      { name: 'SQL', category: 'Technical', targetLevel: 'Intermediate', weight: 8 },
      { name: 'Data Structures', category: 'Technical', targetLevel: 'Intermediate', weight: 7 },
      { name: 'Problem Solving', category: 'Soft', targetLevel: 'Advanced', weight: 5 },
      { name: 'Critical Thinking', category: 'Soft', targetLevel: 'Intermediate', weight: 5 },
    ],
  },
  {
    id: 'web-developer',
    title: 'Web Developer',
    shortDescription:
      'Craft accessible, responsive, high-performance web applications across modern frontend and backend stacks.',
    demandLabel: 'Steady Demand · 9 Core Competencies',
    avgSalaryRange: '$75k – $125k',
    iconKey: 'globe',
    requiredSkills: [
      { name: 'HTML', category: 'Technical', targetLevel: 'Advanced', weight: 13 },
      { name: 'CSS', category: 'Technical', targetLevel: 'Advanced', weight: 13 },
      { name: 'JavaScript', category: 'Technical', targetLevel: 'Advanced', weight: 16 },
      { name: 'React', category: 'Technical', targetLevel: 'Intermediate', weight: 14 },
      { name: 'Node.js', category: 'Technical', targetLevel: 'Intermediate', weight: 12 },
      { name: 'SQL', category: 'Technical', targetLevel: 'Intermediate', weight: 10 },
      { name: 'REST APIs', category: 'Technical', targetLevel: 'Intermediate', weight: 8 },
      { name: 'Communication', category: 'Soft', targetLevel: 'Intermediate', weight: 7 },
      { name: 'Teamwork', category: 'Soft', targetLevel: 'Intermediate', weight: 7 },
    ],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    shortDescription:
      'Query, clean, and visualize operational metrics to answer strategic questions and monitor KPIs.',
    demandLabel: 'High Entry Volume · 8 Core Competencies',
    avgSalaryRange: '$68k – $105k',
    iconKey: 'chart',
    requiredSkills: [
      { name: 'SQL', category: 'Technical', targetLevel: 'Advanced', weight: 20 },
      { name: 'Excel & Spreadsheets', category: 'Technical', targetLevel: 'Advanced', weight: 15 },
      { name: 'Python', category: 'Technical', targetLevel: 'Intermediate', weight: 14 },
      { name: 'Tableau / Power BI', category: 'Technical', targetLevel: 'Intermediate', weight: 15 },
      { name: 'Statistics', category: 'Technical', targetLevel: 'Intermediate', weight: 14 },
      { name: 'Critical Thinking', category: 'Soft', targetLevel: 'Advanced', weight: 8 },
      { name: 'Communication', category: 'Soft', targetLevel: 'Advanced', weight: 8 },
      { name: 'Problem Solving', category: 'Soft', targetLevel: 'Intermediate', weight: 6 },
    ],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    shortDescription:
      'Defend infrastructure, audit vulnerabilities, monitor security telemetry, and respond to active threats.',
    demandLabel: 'Critical Demand · 9 Core Competencies',
    avgSalaryRange: '$88k – $138k',
    iconKey: 'shield',
    requiredSkills: [
      { name: 'Network Security', category: 'Technical', targetLevel: 'Advanced', weight: 16 },
      { name: 'Linux Administration', category: 'Technical', targetLevel: 'Intermediate', weight: 14 },
      { name: 'Python', category: 'Technical', targetLevel: 'Intermediate', weight: 12 },
      { name: 'C Programming', category: 'Technical', targetLevel: 'Intermediate', weight: 11 },
      { name: 'Ethical Hacking', category: 'Technical', targetLevel: 'Intermediate', weight: 13 },
      { name: 'SIEM & Threat Detection', category: 'Technical', targetLevel: 'Beginner', weight: 12 },
      { name: 'Critical Thinking', category: 'Soft', targetLevel: 'Advanced', weight: 8 },
      { name: 'Problem Solving', category: 'Soft', targetLevel: 'Advanced', weight: 7 },
      { name: 'Communication', category: 'Soft', targetLevel: 'Intermediate', weight: 7 },
    ],
  },
];

export const PROFICIENCY_SCORE_MAP: Record<Proficiency, number> = {
  Beginner: 40,
  Intermediate: 72,
  Advanced: 96,
};

export const DEMO_INITIAL_SKILLS: StudentSkill[] = [
  { name: 'Python', category: 'Technical', proficiency: 'Intermediate' },
  { name: 'C Programming', category: 'Technical', proficiency: 'Intermediate' },
  { name: 'SQL', category: 'Technical', proficiency: 'Intermediate' },
  { name: 'Data Structures', category: 'Technical', proficiency: 'Intermediate' },
  { name: 'Machine Learning', category: 'Technical', proficiency: 'Beginner' },
  { name: 'Problem Solving', category: 'Soft', proficiency: 'Intermediate' },
  { name: 'Communication', category: 'Soft', proficiency: 'Intermediate' },
];
