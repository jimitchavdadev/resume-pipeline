import { ResumeTailorOrchestrator } from "./tailor/tailor-orchestrator";
import { Logger } from "./utils/logger";

const args = process.argv.slice(2);

let jdText = "";
let outputName = "tailored_resume.pdf";

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--jd" && args[i + 1]) {
    jdText = args[++i]!;
  } else if ((arg === "--file" || arg === "-f") && args[i + 1]) {
    jdText = args[++i]!;
  } else if ((arg === "--output" || arg === "-o") && args[i + 1]) {
    outputName = args[++i]!;
  } else if (arg && !arg.startsWith("-") && !jdText) {
    jdText = arg;
  }
}

if (!jdText) {
  Logger.header("RESUME TAILORING CLI");
  console.log("Usage: bun run tailor [path-to-jd.txt | --jd \"raw job description\"] [options]\n");
  console.log("Options:");
  console.log("  --jd <text>       Provide raw job description directly as string");
  console.log("  --file, -f <path> Path to text file containing job description");
  console.log("  --output, -o <name> Target PDF name (default: tailored_resume.pdf)\n");
  console.log("Example:");
  console.log("  bun run tailor --file sample_jd.txt\n");
  process.exit(1);
}

const orchestrator = new ResumeTailorOrchestrator();
const result = await orchestrator.run({
  rawJobDescription: jdText,
  outputName,
  useLlm: true,
});

if (!result.success) {
  Logger.error(`Tailoring failed: ${result.error}`);
  process.exit(1);
}

process.exit(0);
