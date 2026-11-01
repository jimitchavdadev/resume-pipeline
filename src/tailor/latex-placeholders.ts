import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { paths } from "../config/paths";
import { masterExperiences } from "../data/master-profile";
import type { TailoredResumeContent } from "../types/tailor";
import { LatexEscaper } from "../utils/latex-escaper";

export class LatexPlaceholderUpdater {
  static updateAll(content: TailoredResumeContent, targetSectionsDir = paths.sectionsDir): void {
    this.updateSkills(content, targetSectionsDir);
    this.updateProjects(content, targetSectionsDir);
    this.updateExperience(content, targetSectionsDir);
    this.updateAchievements(content, targetSectionsDir);
  }

  private static updateSkills(content: TailoredResumeContent, dir: string): void {
    const s = content.skills;
    const tex = `\\resumesection{SKILLS}

\\noindent\\textbf{Languages \\& Frameworks:} ${LatexEscaper.escape(s.languagesFrameworks)}\\par
\\noindent\\textbf{Databases \\& Infrastructure:} ${LatexEscaper.escape(s.databasesInfrastructure)}\\par
\\noindent\\textbf{AI \\& ML:} ${LatexEscaper.escape(s.aiMl)}\\par
\\noindent\\textbf{Tools \\& Practices:} ${LatexEscaper.escape(s.toolsPractices)}\\par
`;
    writeFileSync(resolve(dir, "skills.tex"), tex);
  }

  private static updateProjects(content: TailoredResumeContent, dir: string): void {
    let tex = `\\resumesection{PROJECTS}\n\n`;

    for (let i = 0; i < content.selectedProjects.length; i++) {
      const proj = content.selectedProjects[i]!;
      const spacing = i > 0 ? "\\vspace{2pt}\n" : "";
      const escapedTitle = LatexEscaper.escape(proj.suggestedTitle);

      tex += `${spacing}\\noindent \\textbf{${escapedTitle}} \\hfill \\href{${proj.url}}{GitHub}\\par\n`;
      tex += `\\begin{itemize}\n`;
      for (const bullet of proj.suggestedBullets) {
        tex += `  \\item ${LatexEscaper.escape(bullet)}\n`;
      }
      tex += `\\end{itemize}\n\n`;
    }

    writeFileSync(resolve(dir, "projects.tex"), tex.trim() + "\n");
  }

  private static updateExperience(content: TailoredResumeContent, dir: string): void {
    let tex = `\\resumesection{WORK EXPERIENCE}\n\n`;

    for (let i = 0; i < masterExperiences.length; i++) {
      const exp = masterExperiences[i]!;
      const spacing = i > 0 ? "\\vspace{4pt}\n\n" : "";
      const bullets = content.experienceBullets[exp.company] || exp.baseBullets;

      tex += `${spacing}\\noindent \\textbf{${exp.company}} \\hfill \\textbf{${exp.location}}\\par\n`;
      tex += `\\noindent \\textit{${exp.role}} \\hfill \\textit{${exp.period}}\\par\n`;
      tex += `\\begin{itemize}\n`;
      for (const bullet of bullets) {
        tex += `  \\item ${bullet}\n`;
      }
      tex += `\\end{itemize}\n`;
    }

    writeFileSync(resolve(dir, "experience.tex"), tex);
  }

  private static updateAchievements(content: TailoredResumeContent, dir: string): void {
    let tex = `\\resumesection{ACHIEVEMENTS}\n\n\\begin{itemize}\n`;
    for (const ach of content.achievementsBullets) {
      tex += `  \\item ${ach}\n`;
    }
    tex += `\\end{itemize}\n`;
    writeFileSync(resolve(dir, "achievements.tex"), tex);
  }
}
