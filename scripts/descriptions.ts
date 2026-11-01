const descriptions: Record<string, string> = {
  "BrowserOS-extended":
    "Extended architecture and workspace plugins for BrowserOS, an agent-first browser environment.",
  i3_config_backup:
    "Ultra-refined, highly customized i3wm desktop configuration with polybar, rofi, and custom keybindings.",
  "Hyprland-Dots-Backup":
    "Complete Wayland/Hyprland desktop environment backup featuring smooth animations, Waybar, and custom themes.",
  pdf_to_latex:
    "High-fidelity flow-based PDF-to-LaTeX resume converter with AST layout preservation and styling extraction.",
  Customer_Support_Chatbot:
    "Automated intelligent customer support chatbot with intent routing and real-time query resolution.",
  MultiPDF_Chatbot:
    "Production RAG document assistant supporting multi-PDF ingestion and conversational Q&A via Llama 3 and Qdrant.",
  local_ollama_api:
    "Local multimodal OCR & vision API server wrapping Qwen2.5-VL and Ollama models with a Flask UI.",
  upteky_backend:
    "Backend REST services and database persistence layer for the Upteky EdTech platform.",
  upteky_frontend:
    "User-facing responsive web interface for the Upteky platform built with modern React.",
  "ferris-folio":
    "Rust-powered personal portfolio website showcasing systems projects, benchmarks, and interactive demos.",
  "echo-chamber":
    "High-throughput real-time WebSocket chat and broadcast server with interactive client UI.",
  "LMS-Nexus":
    "Modern Learning Management System providing student registration, course tracking, and grading workflows.",
  "med-scheduler":
    "Angular single-page application for healthcare appointment booking and real-time practitioner schedule management.",
  "med-scheduler-app":
    "Full-stack clinic booking platform pairing Spring Boot backend services with Angular medical dashboard.",
  "ecommerce-platform":
    "Full-stack scalable multi-tenant e-commerce platform monorepo powered by Turborepo, Next.js, and Node.js.",
  College:
    "Collection of undergraduate computer science coursework, lab practicals, algorithms, and data structure implementations.",
  "todo-cli":
    "Lightweight interactive terminal Todo manager supporting priority tagging, deadlines, and task filtering.",
  "flask-vercel":
    "Starter template and deployment pipeline for serverless Python Flask applications on Vercel Edge/Serverless.",
  libmath:
    "Modular low-level C mathematical library implementing linear algebra operations, vectors, and matrix routines.",
  libcore:
    "Reusable low-level C utility library providing memory-safe data structures, strings, and logging utilities.",
  "breach-frontend":
    "Security monitoring and data breach notification frontend dashboard visualizing credential leaks.",
  Student_Personal_Manager:
    "Comprehensive student productivity dashboard for managing coursework deadlines, grades, and schedules.",
  Mood_Based_Playlist_Generator:
    "AI-driven music recommendation engine tailoring dynamic audio playlists based on user sentiment analysis.",
  ML_Model_Maker:
    "Interactive GUI tool for training, tuning, and evaluating classical machine learning models without coding.",
  "Machine_Learning_A-Z":
    "Comprehensive codebase covering end-to-end Machine Learning implementations across regression, classification, and clustering.",
  Webdev_Bootcamp_Udemy:
    "Full-stack web development projects spanning HTML5, CSS3, JavaScript, Node.js, Express, and EJS templating.",
  "100_Days_Python_Bootcamp":
    "Daily Python engineering challenges covering OOP, automation scripting, web scraping, GUI development, and APIs.",
  LabExams:
    "Practical laboratory examination solutions covering Compiler Design (Lex/Yacc), Systems Programming, and C++.",
  SIH_Deep_Learning_Models:
    "Deep learning neural network architectures developed for Smart India Hackathon problem statements.",
};

const extraStacks: Record<string, string[]> = {
  "BrowserOS-extended": ["TypeScript", "Rust"],
  pdf_to_latex: ["TypeScript", "LaTeX"],
  MultiPDF_Chatbot: ["Python", "LangChain", "Qdrant", "Llama 3"],
  local_ollama_api: ["Python", "Flask", "Ollama"],
  Insuria: ["Spring Boot", "Java", "Drools", "Weka ML", "PostgreSQL"],
  "Parallel-Log-Analyzer": ["C++20", "std::thread", "CMake"],
  document_SE: ["Java", "React", "BM25", "Vector Search", "Llama 3"],
  resume_parser: ["Next.js 16", "Ollama", "Llama 3.1", "PostgreSQL", "Zod"],
  CoreShell: ["C", "POSIX APIs", "Linux"],
  TermiGit: ["Rust", "Crossterm"],
  cppkg: ["Go", "Git Integration"],
  FinBro: ["Flutter", "Dart", "TypeScript"],
  InvestTrack: ["Flutter", "Node.js", "PostgreSQL"],
  "med-scheduler": ["Angular", "RxJS", "TypeScript"],
  "med-scheduler-app": ["Spring Boot", "Angular", "PostgreSQL"],
};

export function getFallbackDescription(name: string): string {
  return descriptions[name] ?? "Public engineering repository by Jimit Chavda.";
}

export function getExtraStack(name: string): string[] {
  return extraStacks[name] ?? [];
}
