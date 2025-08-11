import { config } from "../config/env.config";

interface LogData {
  [key: string]: any;
}

class Logger {
  private log(level: string, message: string, data?: LogData) {
    const logEntry = {
      timestamp: new Date().toLocaleString(),
      level,
      message,
      ...data
    }

    console.log(JSON.stringify(logEntry));
  }

  info(message: string, data?: LogData) {
    this.log('info', message, data);
  }

  error(message: string, data?: LogData) {
    this.log('error', message, data);
  }

  warn(message: string, data?: LogData) {
    this.log('warn', message, data);
  }

  debug(message: string, data?: LogData) {
    // only log debug logs in dev environment
    if (config.APP_ENV === "development") {
      this.log("debug", message, data);
    }
  }
}

export const logger = new Logger();