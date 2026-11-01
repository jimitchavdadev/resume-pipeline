import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { paths } from "../config/paths";
import type { CompileOptions, CompileResult } from "../types/pipeline";
import { FileSystemUtils } from "../utils/file-system";
import { Logger } from "../utils/logger";

export class TectonicCompiler {
  private binaryPath: string;
  private cachePath: string;

  constructor(binaryPath?: string, cachePath = paths.cacheDir) {
    if (binaryPath) {
      this.binaryPath = binaryPath;
    } else if (existsSync(paths.tectonicBin)) {
      this.binaryPath = paths.tectonicBin;
    } else {
      this.binaryPath = "tectonic";
    }
    this.cachePath = cachePath;
  }

  isAvailable(): boolean {
    if (existsSync(this.binaryPath)) return true;
    const check = spawnSync("which", [this.binaryPath]);
    return check.status === 0;
  }

  compile(options: CompileOptions = {}): CompileResult {
    const startTime = performance.now();
    const inputTex = options.inputTex ?? paths.mainTex;
    const outputDir = options.outputDir ?? paths.outputDir;

    if (!existsSync(inputTex)) {
      return {
        success: false,
        durationMs: 0,
        error: `Input LaTeX file not found: ${inputTex}`,
      };
    }

    if (!this.isAvailable()) {
      return {
        success: false,
        durationMs: 0,
        error: `Tectonic binary not found at: ${this.binaryPath}`,
      };
    }

    FileSystemUtils.ensureDir(outputDir);
    FileSystemUtils.ensureDir(this.cachePath);

    const workingDir = dirname(inputTex);
    const fileName = basename(inputTex);
    const expectedPdfName = fileName.replace(/\.tex$/, ".pdf");
    const expectedPdfPath = resolve(outputDir, expectedPdfName);

    Logger.info(`Compiling ${fileName} to ${outputDir}...`);

    const result = spawnSync(
      this.binaryPath,
      [fileName, "-o", outputDir],
      {
        cwd: workingDir,
        env: {
          ...process.env,
          TECTONIC_CACHE_DIR: this.cachePath,
        },
        encoding: "utf-8",
      }
    );

    const durationMs = Math.round(performance.now() - startTime);

    if (result.status !== 0) {
      const errorMsg = result.stderr || result.stdout || "Unknown compiler error";
      return {
        success: false,
        durationMs,
        outputDetails: result.stdout,
        error: errorMsg,
      };
    }

    // Rename to custom name if requested
    let finalOutputPath = expectedPdfPath;
    if (options.outputName && options.outputName !== expectedPdfName) {
      const targetPath = resolve(outputDir, options.outputName);
      if (existsSync(expectedPdfPath)) {
        Bun.spawnSync(["mv", expectedPdfPath, targetPath]);
        finalOutputPath = targetPath;
      }
    }

    return {
      success: existsSync(finalOutputPath),
      outputPath: finalOutputPath,
      durationMs,
      outputDetails: result.stdout,
    };
  }
}
