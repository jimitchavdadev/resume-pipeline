import type { JobAnalysis } from "../types/tailor";
import { GroqClient } from "./groq-client";

export class JobDescriptionAnalyzer {
  private groqClient: GroqClient;

  constructor(groqClient = new GroqClient()) {
    this.groqClient = groqClient;
  }

  async analyze(rawJd: string): Promise<JobAnalysis> {
    // Attempt LLM analysis first
    const prompt = `You are an expert technical recruiter and resume strategist. Analyze this raw job description and return a JSON object with:
- "roleTitle": string (e.g. "Senior Backend Engineer", "AI/ML Systems Engineer")
- "targetDomain": string (one of: "AI/ML & RAG Systems", "Systems Programming & Infrastructure", "Backend Services & Microservices", "Full-Stack Web Applications", "Mobile Applications")
- "requiredSkills": string[] (extracted core technologies, e.g. ["Python", "C++", "PostgreSQL", "Docker", "RAG"])
- "niceToHaveSkills": string[]
- "keyThemes": string[] (architectural themes, e.g. ["high concurrency", "distributed systems", "sub-100ms latency", "local inference"])
- "seniorityLevel": string (e.g. "Entry-Level", "Mid-Level", "Senior")

Job Description:
"""${rawJd.slice(0, 3000)}"""`;

    const llmResponse = await this.groqClient.complete(
      [
        { role: "system", content: "You are a precise JSON-only resume tailoring analyzer." },
        { role: "user", content: prompt },
      ],
      true
    );

    if (llmResponse) {
      try {
        const parsed = JSON.parse(llmResponse);
        return {
          roleTitle: parsed.roleTitle || "Software Engineer",
          targetDomain: parsed.targetDomain || "Backend Services & Microservices",
          requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
          niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
          keyThemes: Array.isArray(parsed.keyThemes) ? parsed.keyThemes : [],
          seniorityLevel: parsed.seniorityLevel || "Mid-Level",
        };
      } catch {
        // Fallback to heuristic
      }
    }

    return this.heuristicAnalyze(rawJd);
  }

  private heuristicAnalyze(rawJd: string): JobAnalysis {
    const text = rawJd.toLowerCase();
    const skills: string[] = [];

    const candidates = [
      "python", "c++", "rust", "go", "java", "spring boot", "react", "react native",
      "flutter", "angular", "node.js", "typescript", "docker", "postgresql", "redis",
      "langchain", "llama", "rag", "ollama", "qdrant", "faiss", "aws", "gcp", "weka",
      "kafka", "microservices", "multithreading", "tokio", "graphql", "rest api"
    ];

    for (const tech of candidates) {
      if (text.includes(tech)) skills.push(tech);
    }

    let targetDomain = "Full-Stack Web Applications";
    if (text.includes("rag") || text.includes("llm") || text.includes("ai") || text.includes("machine learning")) {
      targetDomain = "AI, Machine Learning & RAG Systems";
    } else if (text.includes("c++") || text.includes("systems") || text.includes("kernel") || text.includes("concurrency")) {
      targetDomain = "Systems Programming & Infrastructure";
    } else if (text.includes("backend") || text.includes("microservice") || text.includes("spring")) {
      targetDomain = "Backend Services & Microservices";
    } else if (text.includes("mobile") || text.includes("react native") || text.includes("flutter")) {
      targetDomain = "Mobile Applications";
    }

    return {
      roleTitle: "Software Engineer",
      targetDomain,
      requiredSkills: skills.slice(0, 8),
      niceToHaveSkills: skills.slice(8, 12),
      keyThemes: ["high performance", "clean architecture", "reliable deployment"],
      seniorityLevel: "Software Engineer",
    };
  }
}
