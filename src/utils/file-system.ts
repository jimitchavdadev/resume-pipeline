import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { relative } from "node:path";
import { paths } from "../config/paths";
import type { FileValidationItem } from "../types/pipeline";

export class FileSystemUtils {
  static ensureDir(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  static countLines(filePath: string): number {
    if (!existsSync(filePath)) return 0;
    const content = readFileSync(filePath, "utf-8");
    if (!content) return 0;
    return content.split(/\r?\n/).length;
  }

  static inspectFile(filePath: string, maxLineLimit = 200): FileValidationItem {
    const exists = existsSync(filePath);
    const lineCount = exists ? this.countLines(filePath) : 0;
    const relativePath = relative(paths.rootDir, filePath);

    return {
      filePath,
      relativePath,
      exists,
      lineCount,
      isWithinLineLimit: lineCount <= maxLineLimit,
    };
  }

  static listTexFiles(dirPath: string): string[] {
    if (!existsSync(dirPath)) return [];
    return readdirSync(dirPath)
      .filter((file) => file.endsWith(".tex"))
      .map((file) => `${dirPath}/${file}`);
  }

  static getFileSizeKb(filePath: string): number {
    if (!existsSync(filePath)) return 0;
    const stat = statSync(filePath);
    return Math.round((stat.size / 1024) * 10) / 10;
  }
}
