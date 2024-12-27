export class Logger {
  static error(message: string, error?: Error): void {
    console.error(`[Sound System] ${message}`, error);
  }

  static warn(message: string): void {
    console.warn(`[Sound System] ${message}`);
  }

  static info(message: string): void {
    console.info(`[Sound System] ${message}`);
  }
} 