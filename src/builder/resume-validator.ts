import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { paths } from "../config/paths";
import type { ValidationResult } from "../types/pipeline";
import { FileSystemUtils } from "../utils/file-system";
import { Logger } from "../utils/logger";

export class ResumeValidator {
  private maxLineLimit: number;

  constructor(maxLineLimit = 200) {
    this.maxLineLimit = maxLineLimit;
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    const filesToValidate = [
      paths.mainTex,
      paths.preambleTex,
      resolve(paths.sectionsDir, "header.tex"),
      resolve(paths.sectionsDir, "experience.tex"),
      resolve(paths.sectionsDir, "achievements.tex"),
      resolve(paths.sectionsDir, "skills.tex"),
      resolve(paths.sectionsDir, "education.tex"),
      resolve(paths.sectionsDir, "projects.tex"),
    ];

    const inspectedFiles = filesToValidate.map((file) =>
      FileSystemUtils.inspectFile(file, this.maxLineLimit)
    );

    for (const item of inspectedFiles) {
      if (!item.exists) {
        errors.push(`Missing required file: ${item.relativePath}`);
      } else if (!item.isWithinLineLimit) {
        errors.push(
          `File ${item.relativePath} exceeds ${this.maxLineLimit} lines (current: ${item.lineCount})`
        );
      }
    }

    // Verify main.tex includes all expected sections
    if (existsSync(paths.mainTex)) {
      const mainContent = readFileSync(paths.mainTex, "utf-8");
      const expectedInputs = [
        "preamble",
        "sections/header",
        "sections/experience",
        "sections/achievements",
        "sections/skills",
        "sections/education",
        "sections/projects",
      ];

      for (const input of expectedInputs) {
        if (!mainContent.includes(`\\input{${input}}`)) {
          errors.push(`main.tex is missing input reference: \\input{${input}}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      maxLineLimit: this.maxLineLimit,
      files: inspectedFiles,
      errors,
    };
  }

  printReport(result: ValidationResult): void {
    Logger.header("RESUME MODULAR STRUCTURE VALIDATION");
    Logger.info(`Maximum allowed lines per file: ${result.maxLineLimit}`);

    for (const file of result.files) {
      if (file.exists && file.isWithinLineLimit) {
        Logger.success(`${file.relativePath.padEnd(35)} (${file.lineCount} lines)`);
      } else if (file.exists && !file.isWithinLineLimit) {
        Logger.error(`${file.relativePath.padEnd(35)} (${file.lineCount} lines - EXCEEDS LIMIT)`);
      } else {
        Logger.error(`${file.relativePath.padEnd(35)} (FILE NOT FOUND)`);
      }
    }

    if (result.errors.length > 0) {
      Logger.error(`Validation failed with ${result.errors.length} error(s):`);
      for (const err of result.errors) {
        Logger.error(`  - ${err}`);
      }
    } else {
      Logger.success("All modular files are valid and within line limits!");
    }
  }
}
