export interface ExperienceRecord {
  company: string;
  role: string;
  location: string;
  period: string;
  baseBullets: string[];
  keywords: string[];
}

export const masterExperiences: ExperienceRecord[] = [
  {
    company: "Tatvic",
    role: "Technical Trainee",
    location: "Ahmedabad, Gujarat, India",
    period: "Jan 2026 -- Present",
    baseBullets: [
      "Developed \\textbf{5+ Google Workspace automations} as automation developer, streamlining cross-team analytical workflows end-to-end.",
    ],
    keywords: ["automations", "Google Workspace", "workflows", "analytics", "Python"],
  },
  {
    company: "HisabOK",
    role: "Founding Full Stack Intern",
    location: "Remote",
    period: "Nov 2024 -- Nov 2025",
    baseBullets: [
      "\\textbf{0 to production} -- sole founding engineer architecting the entire mobile app and backend across a 13-month engagement.",
      "\\textbf{40\\%} faster API response times and \\textbf{35\\%} app load time reduction via backend query optimisation and phone-side performance tuning.",
      "\\textbf{4+} technologies owned end-to-end across React Native, Node.js, Java with zero handoff dependency.",
    ],
    keywords: ["React Native", "Node.js", "Java", "Mobile", "Backend", "Full Stack", "Founding"],
  },
  {
    company: "White Carbon Motors Private Limited",
    role: "Mobile Application Developer Intern",
    location: "Gandhinagar, Gujarat, India",
    period: "May 2025 -- Jul 2025",
    baseBullets: [
      "\\textbf{2 production apps} built and shipped in parallel as the sole React Native developer within a 3-month timeline.",
      "\\textbf{0 additional engineers} -- independently owned full feature lifecycle from UI architecture to Redux state management across both apps.",
    ],
    keywords: ["React Native", "Mobile", "Redux", "UI Architecture", "State Management"],
  },
];

export const masterAchievements: string[] = [
  "\\textbf{80\\%} processing time reduction and \\textbf{99\\%} cost cut via internal automations built within first months at Tatvic.",
  "\\textbf{100\\%} of marketing team's manual workflow replaced by a multi-agentic AI automation system built independently.",
];
