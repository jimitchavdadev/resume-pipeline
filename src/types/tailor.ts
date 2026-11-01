export interface JobAnalysis {
  roleTitle: string;
  companyName?: string;
  targetDomain: string; // e.g. "Systems", "AI/ML", "Full-Stack", "Backend"
  requiredSkills: string[];
  niceToHaveSkills: string[];
  keyThemes: string[]; // e.g. "high concurrency", "microservices", "RAG"
  seniorityLevel: string;
}

export interface MatchedProject {
  name: string;
  url: string;
  relevanceScore: number;
  matchReasons: string[];
  suggestedTitle: string;
  suggestedBullets: string[];
  techStack: string[];
}

export interface TailoredResumeContent {
  headlineSummary?: string;
  skills: {
    languagesFrameworks: string;
    databasesInfrastructure: string;
    aiMl: string;
    toolsPractices: string;
  };
  experienceBullets: Record<string, string[]>; // company -> bullets
  achievementsBullets: string[];
  selectedProjects: MatchedProject[];
}

export interface TailorPipelineOptions {
  rawJobDescription: string;
  outputName?: string;
  useLlm?: boolean;
  verbose?: boolean;
}
