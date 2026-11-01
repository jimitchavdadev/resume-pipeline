import { ResumePipeline } from "./builder/resume-pipeline";
import { Logger } from "./utils/logger";

const args = process.argv.slice(2);
const command = args[0] || "build";
const pipeline = new ResumePipeline(200);

switch (command) {
  case "build": {
    const result = pipeline.build({ outputName: "resume.pdf" });
    if (!result.success) {
      process.exit(1);
    }
    break;
  }

  case "validate": {
    const isValid = pipeline.validate();
    if (!isValid) {
      process.exit(1);
    }
    break;
  }

  case "clean": {
    pipeline.clean();
    break;
  }

  case "--help":
  case "-h":
  case "help": {
    Logger.header("RESUME PIPELINE CLI");
    console.log("Usage: bun run src/index.ts [command]\n");
    console.log("Commands:");
    console.log("  build     (default) Validate modular files and compile to PDF");
    console.log("  validate  Validate modular LaTeX structure and 200-line limit");
    console.log("  clean     Remove dist/ artifacts\n");
    break;
  }

  default: {
    Logger.error(`Unknown command: ${command}`);
    console.log("Run 'bun run src/index.ts --help' for available commands.");
    process.exit(1);
  }
}
