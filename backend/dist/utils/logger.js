"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const colors = {
    info: '\x1b[36m', // cyan
    warn: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
    debug: '\x1b[90m', // gray
};
const reset = '\x1b[0m';
const formatTimestamp = () => new Date().toISOString();
const log = (level, message, meta) => {
    const color = colors[level];
    const prefix = `${color}[${level.toUpperCase()}]${reset} ${formatTimestamp()} —`;
    if (meta !== undefined) {
        console.log(`${prefix} ${message}`, meta);
    }
    else {
        console.log(`${prefix} ${message}`);
    }
};
exports.logger = {
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
    /** Logs an incoming HTTP request */
    request: (req, res, durationMs) => {
        const color = res.statusCode >= 500 ? colors.error
            : res.statusCode >= 400 ? colors.warn
                : colors.info;
        console.log(`${color}[HTTP]${reset} ${formatTimestamp()} — ${req.method} ${req.originalUrl} ${color}${res.statusCode}${reset} (${durationMs}ms)`);
    },
};
