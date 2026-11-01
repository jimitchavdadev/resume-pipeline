export class Logger {
  static info(message: string, ...args: unknown[]): void {
    console.log(`[INFO]  ${message}`, ...args);
  }

  static success(message: string, ...args: unknown[]): void {
    console.log(`[OK]    \x1b[32m${message}\x1b[0m`, ...args);
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN]  \x1b[33m${message}\x1b[0m`, ...args);
  }

  static error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] \x1b[31m${message}\x1b[0m`, ...args);
  }

  static header(title: string): void {
    const divider = "=".repeat(60);
    console.log(`\n\x1b[36m${divider}\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m ${title}\x1b[0m`);
    console.log(`\x1b[36m${divider}\x1b[0m\n`);
  }
}
