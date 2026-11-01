import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { paths } from "../config/paths";

export interface ProjectEntry {
  name: string;
  url: string;
  description: string;
  languages: string[];
  primaryLanguage: string;
  stars: number;
}

export class ProjectsCatalog {
  private static cachedProjects: ProjectEntry[] | null = null;

  static load(): ProjectEntry[] {
    if (this.cachedProjects) return this.cachedProjects;

    const reposFile = resolve(paths.rootDir, "repos.json");
    const readmesFile = resolve(paths.rootDir, "readmes.json");

    if (!existsSync(reposFile)) return [];

    const repos = JSON.parse(readFileSync(reposFile, "utf-8"));
    const readmes = existsSync(readmesFile)
      ? JSON.parse(readFileSync(readmesFile, "utf-8"))
      : {};

    this.cachedProjects = repos.map((r: any) => ({
      name: r.name,
      url: r.url,
      description: r.description || (readmes[r.name] ? readmes[r.name].slice(0, 200) : ""),
      languages: (r.languages || []).map((l: any) => l.node?.name).filter(Boolean),
      primaryLanguage: r.primaryLanguage?.name || "Unknown",
      stars: r.stargazerCount || 0,
    }));

    return this.cachedProjects || [];
  }

  static getByName(name: string): ProjectEntry | undefined {
    return this.load().find((p) => p.name.toLowerCase() === name.toLowerCase());
  }
}
