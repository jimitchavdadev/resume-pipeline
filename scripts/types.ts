export interface LanguageNode {
  size: number;
  node: { name: string };
}

export interface RepoData {
  name: string;
  description: string;
  url: string;
  homepageUrl: string;
  primaryLanguage: { name: string } | null;
  languages: LanguageNode[];
  isFork: boolean;
  forkCount: number;
  stargazerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnrichedProject {
  name: string;
  url: string;
  category: string;
  purpose: string;
  techStack: string[];
  stars: number;
  forks: number;
  primaryLang: string;
  updated: string;
}
