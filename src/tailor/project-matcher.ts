import { ProjectsCatalog, type ProjectEntry } from "../data/projects-catalog";
import type { JobAnalysis, MatchedProject } from "../types/tailor";

export class ProjectMatcher {
  static match(analysis: JobAnalysis, maxProjects = 4): MatchedProject[] {
    const allProjects = ProjectsCatalog.load();
    const scored: Array<{ project: ProjectEntry; score: number; reasons: string[] }> = [];

    const reqLower = analysis.requiredSkills.map((s) => s.toLowerCase());
    const niceLower = analysis.niceToHaveSkills.map((s) => s.toLowerCase());

    for (const proj of allProjects) {
      let score = 0;
      const reasons: string[] = [];

      // Exclude or penalize non-portfolio repos
      const excluded = [
        "College",
        "LabExams",
        "testing",
        "dots",
        "i3_config_backup",
        "Hyprland-Dots-Backup",
        "Webdev_Bootcamp_Udemy",
        "100_Days_Python_Bootcamp",
      ];
      if (excluded.includes(proj.name)) {
        continue;
      }

      // Flagship boost for high-impact production repos
      const flagship = [
        "MultiPDF_Chatbot",
        "Parallel-Log-Analyzer",
        "Insuria",
        "med-scheduler",
        "document_SE",
        "resume_parser",
        "TermiGit",
        "CoreShell",
        "FinBro",
        "spring-boot-oms-api",
      ];
      if (flagship.includes(proj.name)) {
        score += 40;
      }

      // Match languages
      for (const lang of proj.languages) {
        const langLower = lang.toLowerCase();
        if (reqLower.some((r) => r.includes(langLower) || langLower.includes(r))) {
          score += 25;
          reasons.push(`Direct skill match: ${lang}`);
        } else if (niceLower.some((n) => n.includes(langLower) || langLower.includes(n))) {
          score += 10;
        }
      }

      // Match description keywords
      const descLower = (proj.description + " " + proj.name).toLowerCase();
      for (const req of reqLower) {
        if (descLower.includes(req)) {
          score += 20;
          reasons.push(`Matches requirement: ${req}`);
        }
      }

      for (const theme of analysis.keyThemes) {
        if (descLower.includes(theme.toLowerCase())) {
          score += 15;
          reasons.push(`Aligns with theme: ${theme}`);
        }
      }

      if (score > 0) {
        scored.push({ project: proj, score, reasons });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, maxProjects);

    return top.map((item) => this.formatMatchedProject(item.project, item.score, item.reasons));
  }

  private static formatMatchedProject(
    proj: ProjectEntry,
    score: number,
    reasons: string[]
  ): MatchedProject {
    // Curated high-impact bullet points adhering to resume best practices
    const bulletsMap: Record<string, { title: string; bullets: string[]; stack: string[] }> = {
      "MultiPDF_Chatbot": {
        title: "MultiPDF Chatbot: Production RAG Document Assistant",
        bullets: [
          "\\textbf{88\\%} answer relevance on internal test sets via a LangChain RAG pipeline over multi-document corpora using FAISS/Chroma and Llama 3.",
          "\\textbf{Multi-PDF} ingestion with real-time conversational Q\\&A. Stack: Python, LangChain, Vector DB, Streamlit.",
        ],
        stack: ["Python", "LangChain", "Vector DB", "Llama 3"],
      },
      "Parallel-Log-Analyzer": {
        title: "Parallel-Log-Analyzer: Multithreaded C++ SIEM Tool",
        bullets: [
          "\\textbf{4$\\times$} faster log analysis vs.\\ sequential processing by parsing multi-GB server log files using C++ \\texttt{std::thread} concurrency.",
          "\\textbf{Real-time} intrusion detection flagging across high-volume log streams with pattern-matched alert rules. Stack: C++, Standard Library.",
        ],
        stack: ["C++20", "std::thread", "CMake"],
      },
      "Insuria": {
        title: "Insuria: Real-Time Insurance Underwriting Microservice",
        bullets: [
          "\\textbf{1,000+} applications/min processed at sub-100ms latency combining Drools rules engine with Weka ML models for instant approvals.",
          "\\textbf{45\\%} reduction in manual underwriting review load in simulation benchmarks. Stack: Java, Spring Boot, PostgreSQL.",
        ],
        stack: ["Java", "Spring Boot", "PostgreSQL", "Drools"],
      },
      "med-scheduler": {
        title: "med-scheduler Suite: Full-Stack Clinic Booking Platform",
        bullets: [
          "\\textbf{2 integrated services} -- Angular/RxJS frontend and Spring Boot/Node.js backend with JWT auth and PostgreSQL, delivered as a single deployable platform.",
          "\\textbf{Real-time} doctor schedule sync and patient notification engine handling concurrent booking conflicts across multiple practitioners.",
        ],
        stack: ["Angular", "RxJS", "Spring Boot", "PostgreSQL"],
      },
      "document_SE": {
        title: "document\\_SE: Hybrid Neural \\& BM25 Document Search Engine",
        bullets: [
          "\\textbf{Reciprocal Rank Fusion (RRF)} engine marrying BM25 sparse keyword matching with dense vector embeddings for high precision retrieval.",
          "\\textbf{AI Insight Layer} generating grounded contextual explanations using local Llama 3 models. Stack: Java, React, Docker, Vector Search.",
        ],
        stack: ["Java", "React", "Docker", "BM25", "Llama 3"],
      },
      "resume_parser": {
        title: "resume\\_parser: Local AI ATS Candidate Screening Engine",
        bullets: [
          "\\textbf{Zero-cost, private} candidate evaluation engine extracting PDF resume entities and scoring fit against job descriptions using local Llama 3.1.",
          "\\textbf{Zod schema validation} ensuring 100\\% type-safe JSON output with structured rubrics and skill weightings. Stack: Next.js 16, Ollama, PostgreSQL.",
        ],
        stack: ["Next.js 16", "Ollama", "PostgreSQL", "Zod"],
      },
      "TermiGit": {
        title: "TermiGit: Blazingly Fast Terminal Git Client",
        bullets: [
          "\\textbf{Interactive TUI} engineered in Rust for staging, diff inspecting, and commit management without leaving the CLI.",
          "\\textbf{Sub-millisecond} UI response times leveraging zero-overhead Rust memory safety and terminal rendering primitives. Stack: Rust, Crossterm.",
        ],
        stack: ["Rust", "Crossterm", "Git"],
      },
      "CoreShell": {
        title: "CoreShell: Custom POSIX Linux Shell Implementation",
        bullets: [
          "\\textbf{Complete command interpreter} implementing process lifecycle (fork/exec), IPC pipelines (\\texttt{|}), and file redirection (\\texttt{<}, \\texttt{>}).",
          "\\textbf{Full job control} supporting background execution (\\texttt{\\&}) and foreground/background context switching. Stack: C, POSIX APIs.",
        ],
        stack: ["C", "POSIX APIs", "Linux"],
      },
    };

    const curated = bulletsMap[proj.name];
    if (curated) {
      return {
        name: proj.name,
        url: proj.url,
        relevanceScore: score,
        matchReasons: reasons,
        suggestedTitle: curated.title,
        suggestedBullets: curated.bullets,
        techStack: curated.stack,
      };
    }

    // Default clean bullet points
    return {
      name: proj.name,
      url: proj.url,
      relevanceScore: score,
      matchReasons: reasons,
      suggestedTitle: `${proj.name}: High-Performance Engineering Project`,
      suggestedBullets: [
        `\\textbf{Engineered} scalable architecture using ${proj.languages.slice(0, 3).join(", ")} for robust production performance.`,
        `\\textbf{Modular design} with automated testing and clean separation of concerns. Stack: ${proj.languages.slice(0, 4).join(", ")}.`,
      ],
      techStack: proj.languages,
    };
  }
}
