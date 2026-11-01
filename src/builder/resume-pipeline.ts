import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { paths } from "../config/paths";
import { TectonicCompiler } from "../compiler/tectonic";
import type { CompileOptions, CompileResult } from "../types/pipeline";
import { FileSystemUtils } from "../utils/file-system";
import { Logger } from "../utils/logger";
import { ResumeValidator } from "./resume-validator";

export class ResumePipeline {
  private compiler: TectonicCompiler;
  private validator: ResumeValidator;

  constructor(maxLineLimit = 200) {
    this.compiler = new TectonicCompiler();
    this.validator = new ResumeValidator(maxLineLimit);
  }

  validate(): boolean {
    const report = this.validator.validate();
    this.validator.printReport(report);
    return report.valid;
  }

  clean(): void {
    if (existsSync(paths.outputDir)) {
      rmSync(paths.outputDir, { recursive: true, force: true });
      Logger.success(`Cleaned output directory: ${paths.outputDir}`);
    }
  }

  build(options: CompileOptions = {}): CompileResult {
    Logger.header("STARTING RESUME BUILD PIPELINE");

    // Step 1: Validate modular structure and line limits
    const validationResult = this.validator.validate();
    this.validator.printReport(validationResult);

    if (!validationResult.valid) {
      Logger.error("Build aborted due to validation errors.");
      return {
        success: false,
        durationMs: 0,
        error: "Validation failed: " + validationResult.errors.join("; "),
      };
    }

    // Step 2: Ensure directories exist
    FileSystemUtils.ensureDir(paths.outputDir);

    // Step 3: Run Compiler
    Logger.info("Starting LaTeX compilation...");
    const targetPdfName = options.outputName ?? "resume.pdf";
    const compileResult = this.compiler.compile({
      inputTex: options.inputTex ?? paths.mainTex,
      outputDir: options.outputDir ?? paths.outputDir,
      outputName: targetPdfName,
      verbose: options.verbose,
    });

    if (!compileResult.success) {
      Logger.error(`Compilation failed in ${compileResult.durationMs}ms`);
      if (compileResult.error) {
        Logger.error(compileResult.error);
      }
      return compileResult;
    }

    const finalPdf = resolve(options.outputDir ?? paths.outputDir, targetPdfName);
    const sizeKb = FileSystemUtils.getFileSizeKb(finalPdf);

    Logger.header("BUILD COMPLETED SUCCESSFULLY");
    Logger.success(`Output PDF: ${finalPdf}`);
    Logger.info(`File Size:  ${sizeKb} KB`);
    Logger.info(`Duration:   ${compileResult.durationMs} ms`);

    return {
      success: true,
      outputPath: finalPdf,
      durationMs: compileResult.durationMs,
    };
  }
}
