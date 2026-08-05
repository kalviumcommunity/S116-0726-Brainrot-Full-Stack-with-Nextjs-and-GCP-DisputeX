import { Request, Response } from 'express';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const colors: Record<LogLevel, string> = {
  info: '\x1b[36m',  // cyan
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
  debug: '\x1b[90m', // gray
};
const reset = '\x1b[0m';

const formatTimestamp = () => new Date().toISOString();

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const color = colors[level];
  const prefix = `${color}[${level.toUpperCase()}]${reset} ${formatTimestamp()} —`;
  if (meta !== undefined) {
    console.log(`${prefix} ${message}`, meta);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

export const logger = {
  info: (msg: string, meta?: unknown) => log('info', msg, meta),
  warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
  error: (msg: string, meta?: unknown) => log('error', msg, meta),
  debug: (msg: string, meta?: unknown) => log('debug', msg, meta),

  /** Logs an incoming HTTP request */
  request: (req: Request, res: Response, durationMs: number) => {
    const color = res.statusCode >= 500 ? colors.error
      : res.statusCode >= 400 ? colors.warn
      : colors.info;
    console.log(
      `${color}[HTTP]${reset} ${formatTimestamp()} — ${req.method} ${req.originalUrl} ${color}${res.statusCode}${reset} (${durationMs}ms)`
    );
  },
};
