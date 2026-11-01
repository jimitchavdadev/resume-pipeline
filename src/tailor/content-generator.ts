import { masterExperiences, masterAchievements } from "../data/master-profile";
import type { JobAnalysis, MatchedProject, TailoredResumeContent } from "../types/tailor";
import { GroqClient } from "./groq-client";

export class ContentGenerator {
  private groqClient: GroqClient;

  constructor(groqClient = new GroqClient()) {
    this.groqClient = groqClient;
  }

  async generate(
    analysis: JobAnalysis,
    matchedProjects: MatchedProject[],
    useLlm = true
  ): Promise<TailoredResumeContent> {
    const tailoredSkills = this.tailorSkills(analysis);
    const expBullets: Record<string, string[]> = {};

    for (const exp of masterExperiences) {
      expBullets[exp.company] = [...exp.baseBullets];
    }

    if (useLlm) {
      const llmTailored = await this.llmEnhance(analysis, matchedProjects);
      if (llmTailored) {
        return llmTailored;
      }
    }

    return {
      skills: tailoredSkills,
      experienceBullets: expBullets,
      achievementsBullets: [...masterAchievements],
      selectedProjects: matchedProjects.slice(0, 4),
    };
  }

  private tailorSkills(analysis: JobAnalysis) {
    const baseLanguages = ["Java", "Spring Boot", "Rust", "C++", "Python", "Dart", "Flutter", "React", "React Native", "TypeScript", "Node.js", "Express"];
    const baseDatabases = ["PostgreSQL", "MongoDB", "Redis", "RocksDB", "Docker", "JWT", "Prisma"];
    const baseAi = ["LangChain", "RAG Pipelines", "Vector Databases (FAISS/Chroma)", "Ollama (Llama 3)", "BM25", "Weka ML", "Multi-Agent Systems"];
    const baseTools = ["REST APIs", "Microservices", "Multithreading", "Async Programming (Tokio)", "DID/Cryptography", "SDL2"];

    const prioritize = (list: string[]) => {
      const matched: string[] = [];
      const rest: string[] = [];
      const reqLower = analysis.requiredSkills.map((s) => s.toLowerCase());

      for (const item of list) {
        const itemLower = item.toLowerCase();
        if (reqLower.some((r) => itemLower.includes(r) || r.includes(itemLower))) {
          matched.push(item);
        } else {
          rest.push(item);
        }
      }
      return [...matched, ...rest].join(", ");
    };

    return {
      languagesFrameworks: prioritize(baseLanguages),
      databasesInfrastructure: prioritize(baseDatabases),
      aiMl: prioritize(baseAi),
      toolsPractices: prioritize(baseTools),
    };
  }

  private async llmEnhance(
    analysis: JobAnalysis,
    matchedProjects: MatchedProject[]
  ): Promise<TailoredResumeContent | null> {
    const prompt = `You are an elite LaTeX resume tailoring engine. 
Analyze the target job and candidate facts below.
Return a JSON object tailoring the resume content. CRITICAL: Do NOT invent fake experiences. Follow proven practices:
1. Front-load bullets with bold quantitative metrics (e.g. \\textbf{40\\%} faster, \\textbf{0 to production}).
2. Use active verbs: architected, owned, shipped, engineered, streamlined.
3. Keep bullets telegraphic and concise to guarantee fitting on 1 single page.
4. Escape special LaTeX characters: % must be \\%, & must be \\&.

Target Role: ${analysis.roleTitle}
Target Domain: ${analysis.targetDomain}
Key Skills: ${analysis.requiredSkills.join(", ")}

Top Matched Projects:
${matchedProjects.map((p) => `- ${p.name}: ${p.suggestedBullets.join(" | ")}`).join("\n")}

Return JSON with structure:
{
  "skills": {
    "languagesFrameworks": "comma-separated list prioritized for this role",
    "databasesInfrastructure": "comma-separated list prioritized for this role",
    "aiMl": "comma-separated list prioritized for this role",
    "toolsPractices": "comma-separated list prioritized for this role"
  },
  "projectBullets": {
    "projectName": ["bullet 1 with \\\\textbf{...}", "bullet 2 with \\\\textbf{...}"]
  }
}`;

    const response = await this.groqClient.complete(
      [
        { role: "system", content: "You are a professional JSON-only resume compiler." },
        { role: "user", content: prompt },
      ],
      true
    );

    if (!response) return null;

    try {
      const parsed = JSON.parse(response);
      const tailoredSkills = parsed.skills || this.tailorSkills(analysis);
      const selected = matchedProjects.slice(0, 4).map((p) => {
        if (parsed.projectBullets && parsed.projectBullets[p.name]) {
          return {
            ...p,
            suggestedBullets: parsed.projectBullets[p.name],
          };
        }
        return p;
      });

      const expBullets: Record<string, string[]> = {};
      for (const exp of masterExperiences) {
        expBullets[exp.company] = [...exp.baseBullets];
      }

      return {
        skills: tailoredSkills,
        experienceBullets: expBullets,
        achievementsBullets: [...masterAchievements],
        selectedProjects: selected,
      };
    } catch {
      return null;
    }
  }
}
