# Resume Pipeline & Automated Tailoring Engine

A modular LaTeX resume architecture with automated validation, Groq LLM-driven job tailoring, and fast Tectonic compilation built on Bun.

## Core Features

- **Automated Resume Tailoring**: Accepts any raw Job Description, extracts core competencies, selects the highest-relevance projects from 75 analyzed GitHub repositories, and updates placeholder text while strictly preserving structure and layout.
- **Groq LLM Integration**: Uses Groq's high-speed inference engine (`openai/gpt-oss-120b` / `openai/gpt-oss-20b`) for rapid analysis with built-in heuristic NLP fallbacks.
- **Strict 1-Page Guarantee**: All bullet points and section templates are budgeted and escaped to guarantee fitting on a single page.
- **Modular & Clean Architecture**: Every file in the entire repository strictly adheres to **under 200 lines**.

## Architecture Overview

```
resume-pipeline/
├── bin/
│   └── tectonic                   # Self-contained LaTeX compiler binary
├── dist/
│   ├── resume.pdf                 # Base master PDF
│   └── tailored_resume.pdf        # Job-tailored application-ready PDF
├── resume/
│   ├── main.tex                   # Entry document (< 20 lines)
│   ├── preamble.tex               # Packages & styling macros (< 30 lines)
│   └── sections/
│       ├── header.tex             # Contact info & links
│       ├── experience.tex         # Professional work experience
│       ├── achievements.tex       # Quantified achievements
│       ├── skills.tex             # Dynamic prioritized competencies
│       ├── education.tex          # Degree & institution
│       └── projects.tex           # Tailored flagship projects
└── src/
    ├── config/                    # Paths & Groq LLM settings
    ├── data/                      # Master profile & 75 GitHub project catalog
    ├── tailor/                    # JD analyzer, project matcher, Groq client & placeholders
    ├── builder/                   # Pipeline orchestrator & 200-line validator
    ├── compiler/                  # Tectonic LaTeX runner wrapper
    ├── utils/                     # LaTeX escaper, file-system & terminal logger
    ├── tailor-cli.ts              # Tailor CLI entry point
    └── index.ts                   # Base build CLI entry point
```

## Quick Start

### 1. Tailor Resume from Raw Job Description
Pass a job description file or raw text to generate an application-ready PDF:
```bash
# Using a file
bun run tailor --file examples/sample_jd_ai_systems.txt --output tailored_resume.pdf

# Or passing raw string directly
bun run tailor --jd "Looking for a Senior Backend Engineer proficient in Python, C++, Docker, and RAG..."
```

### 2. Standard Build
Builds the base master resume:
```bash
bun run build
```

### 3. Validate Structure & Line Limits
```bash
bun run validate
```

### 4. Type Check
```bash
bun run typecheck
```
