import { injectable } from "tsyringe";

export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

@injectable()
export class Logger {
  private log(level: string, message: string, color: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      `\x1b[37m[${timestamp}]\x1b[0m \x1b[${color}m[${level.toUpperCase()}]\x1b[0m ${message}`
    );
  }

  /**
   * Logs an informational message.
   * @param message The message to log
   */
  public info(message: string): void {
    this.log(LogLevel.INFO, message, "32"); // Green color for info
  }

  /**
   * Logs a warning message.
   * @param message The message to log.
   */
  public warn(message: string): void {
    this.log(LogLevel.WARN, message, "33"); // Yellow color for warn
  }

  /**
   * Logs an error message.
   * @param message The message to log.
   */
  public error(message: string): void {
    this.log(LogLevel.ERROR, message, "31"); // Red color for error
  }
}
