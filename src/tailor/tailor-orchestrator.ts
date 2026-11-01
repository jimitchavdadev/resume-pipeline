import { existsSync, readFileSync } from "node:fs";
import { paths } from "../config/paths";
import { ResumePipeline } from "../builder/resume-pipeline";
import type { TailorPipelineOptions } from "../types/tailor";
import { Logger } from "../utils/logger";
import { ContentGenerator } from "./content-generator";
import { GroqClient } from "./groq-client";
import { JobDescriptionAnalyzer } from "./jd-analyzer";
import { LatexPlaceholderUpdater } from "./latex-placeholders";
import { ProjectMatcher } from "./project-matcher";

export class ResumeTailorOrchestrator {
  private analyzer: JobDescriptionAnalyzer;
  private generator: ContentGenerator;
  private pipeline: ResumePipeline;

  constructor() {
    const groq = new GroqClient();
    this.analyzer = new JobDescriptionAnalyzer(groq);
    this.generator = new ContentGenerator(groq);
    this.pipeline = new ResumePipeline(200);
  }

  async run(options: TailorPipelineOptions): Promise<{ success: boolean; pdfPath?: string; error?: string }> {
    Logger.header("STARTING AUTOMATED RESUME TAILORING PIPELINE");

    let rawJd = options.rawJobDescription;
    if (existsSync(rawJd)) {
      Logger.info(`Reading raw Job Description from file: ${rawJd}`);
      rawJd = readFileSync(rawJd, "utf-8");
    }

    if (!rawJd || rawJd.trim().length === 0) {
      return { success: false, error: "Empty job description provided." };
    }

    // Step 1: Analyze Job Description
    Logger.info("1/5 Analyzing Job Description with Groq LLM / NLP...");
    const analysis = await this.analyzer.analyze(rawJd);
    Logger.success(`Target Role:   ${analysis.roleTitle}`);
    Logger.info(`Target Domain: ${analysis.targetDomain}`);
    Logger.info(`Core Skills:   ${analysis.requiredSkills.join(", ") || "General SWE"}`);

    // Step 2: Match top projects from 75 GitHub repositories
    Logger.info("2/5 Matching best projects from 75 GitHub repositories...");
    const matchedProjects = ProjectMatcher.match(analysis, 4);
    for (const proj of matchedProjects) {
      Logger.success(`  Matched [${proj.name}] (score: ${proj.relevanceScore})`);
    }

    // Step 3: Generate tailored content
    Logger.info("3/5 Generating tailored section content following resume practices...");
    const tailoredContent = await this.generator.generate(
      analysis,
      matchedProjects,
      options.useLlm ?? true
    );

    // Step 4: Update LaTeX placeholders preserving structure
    Logger.info("4/5 Updating LaTeX section placeholders (preserving structure)...");
    LatexPlaceholderUpdater.updateAll(tailoredContent, paths.sectionsDir);
    Logger.success("Updated sections: skills.tex, projects.tex, experience.tex, achievements.tex");

    // Step 5: Validate and Compile into 1-page PDF
    Logger.info("5/5 Validating line limits and compiling application-ready PDF...");
    const outputPdfName = options.outputName ?? "tailored_resume.pdf";
    const compileResult = this.pipeline.build({ outputName: outputPdfName });

    if (!compileResult.success) {
      return { success: false, error: compileResult.error };
    }

    Logger.header("TAILORING COMPLETE - RESUME IS APPLICATION READY");
    Logger.success(`Ready PDF: ${compileResult.outputPath}`);

    return {
      success: true,
      pdfPath: compileResult.outputPath,
    };
  }
}
