export interface CompileOptions {
  inputTex?: string;
  outputDir?: string;
  outputName?: string;
  verbose?: boolean;
}

export interface CompileResult {
  success: boolean;
  outputPath?: string;
  durationMs: number;
  outputDetails?: string;
  error?: string;
}

export interface FileValidationItem {
  filePath: string;
  relativePath: string;
  exists: boolean;
  lineCount: number;
  isWithinLineLimit: boolean;
}

export interface ValidationResult {
  valid: boolean;
  maxLineLimit: number;
  files: FileValidationItem[];
  errors: string[];
}

export interface ResumeSectionInfo {
  name: string;
  fileName: string;
  title: string;
  description: string;
}
