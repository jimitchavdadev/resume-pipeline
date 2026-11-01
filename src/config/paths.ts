import { resolve } from "node:path";

export interface PipelinePaths {
  rootDir: string;
  resumeDir: string;
  sectionsDir: string;
  mainTex: string;
  preambleTex: string;
  rawTex: string;
  outputDir: string;
  outputPdf: string;
  binDir: string;
  tectonicBin: string;
  cacheDir: string;
}

const rootDir = resolve(import.meta.dir, "../..");

export const paths: PipelinePaths = {
  rootDir,
  resumeDir: resolve(rootDir, "resume"),
  sectionsDir: resolve(rootDir, "resume/sections"),
  mainTex: resolve(rootDir, "resume/main.tex"),
  preambleTex: resolve(rootDir, "resume/preamble.tex"),
  rawTex: resolve(rootDir, "resume/resume_raw.tex"),
  outputDir: resolve(rootDir, "dist"),
  outputPdf: resolve(rootDir, "dist/main.pdf"),
  binDir: resolve(rootDir, "bin"),
  tectonicBin: resolve(rootDir, "bin/tectonic"),
  cacheDir: resolve(rootDir, ".cache/tectonic"),
};
