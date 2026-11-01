import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getFallbackDescription, getExtraStack } from "./descriptions";
import { getRepoCategory } from "./repo-categorizer";
import type { EnrichedProject, RepoData } from "./types";

const repos: RepoData[] = JSON.parse(await Bun.file("repos.json").text());

function enrichRepo(repo: RepoData): EnrichedProject {
  const name = repo.name;
  const primaryLang =
    repo.primaryLanguage?.name || repo.languages[0]?.node.name || "Unknown";
  const purpose = repo.description || getFallbackDescription(name);

  const stackSet = new Set<string>();
  for (const lang of repo.languages.slice(0, 4)) {
    stackSet.add(lang.node.name);
  }
  for (const extra of getExtraStack(name)) {
    stackSet.add(extra);
  }

  return {
    name,
    url: repo.url,
    category: getRepoCategory(name),
    purpose,
    techStack: Array.from(stackSet),
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    primaryLang,
    updated: (repo.updatedAt ?? "").split("T")[0] ?? "",
  };
}

const enriched = repos.map(enrichRepo);

const categories: Record<string, EnrichedProject[]> = {};
for (const proj of enriched) {
  if (!categories[proj.category]) categories[proj.category] = [];
  categories[proj.category]!.push(proj);
}

// Generate Comprehensive Root Markdown
let mainMd = `# Jimit Chavda (@jimitchavdadev) - Public GitHub Repositories Catalog\n\n`;
mainMd += `A comprehensive directory of all **${enriched.length} public repositories** published on GitHub by [Jimit Chavda](https://github.com/jimitchavdadev).\n\n`;
mainMd += `## Table of Contents\n\n- [Overview & Quick Stats](#overview--quick-stats)\n`;

for (const catName of Object.keys(categories)) {
  const projs = categories[catName]!;
  const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  mainMd += `- [${catName} (${projs.length})](#${slug})\n`;
}

mainMd += `\n---\n\n## Overview & Quick Stats\n\n`;
mainMd += `- **GitHub Profile**: [github.com/jimitchavdadev](https://github.com/jimitchavdadev)\n`;
mainMd += `- **Total Public Repositories**: ${enriched.length}\n`;
mainMd += `- **Primary Domains**: AI/ML & RAG Systems, Systems & Infrastructure (C++/Rust/Go), Full-Stack Web (Spring Boot, Next.js, Angular), Mobile Apps (Flutter/React Native)\n\n`;

for (const [catName, projs] of Object.entries(categories)) {
  mainMd += `## ${catName}\n\n`;
  mainMd += `| Repository | Purpose | Tech Stack | Primary Lang | Stars |\n`;
  mainMd += `| :--- | :--- | :--- | :--- | :--- |\n`;

  for (const p of projs) {
    const link = `[\`${p.name}\`](${p.url})`;
    const stackStr = p.techStack.join(", ");
    mainMd += `| ${link} | ${p.purpose.replace(/\|/g, "\\|")} | ${stackStr} | \`${p.primaryLang}\` | ${p.stars} |\n`;
  }
  mainMd += `\n`;
}

writeFileSync("GITHUB_REPOSITORIES.md", mainMd);

// Generate Categorized Modular Documents under docs/projects/
mkdirSync("docs/projects", { recursive: true });
let indexDocs = `# Public GitHub Repositories Directory\n\nCategorized breakdown of all 75 public repositories by @jimitchavdadev:\n\n`;

for (const [catName, projs] of Object.entries(categories)) {
  const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fileName = `${slug}.md`;
  indexDocs += `- [${catName} (${projs.length} projects)](./${fileName})\n`;

  let catMd = `# ${catName}\n\nTotal Projects: **${projs.length}**\n\n`;
  catMd += `| Project | Purpose | Tech Stack | Link |\n| :--- | :--- | :--- | :--- |\n`;
  for (const p of projs) {
    catMd += `| **${p.name}** | ${p.purpose.replace(/\|/g, "\\|")} | ${p.techStack.join(", ")} | [GitHub](${p.url}) |\n`;
  }
  writeFileSync(resolve("docs/projects", fileName), catMd);
}

writeFileSync("docs/projects/README.md", indexDocs);
console.log("Successfully generated GITHUB_REPOSITORIES.md and docs/projects/");
