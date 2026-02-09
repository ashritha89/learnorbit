// src/utils/logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');

// Ensure logs directory exists (Node will create on first write)
const logsDir = path.join(__dirname, '..', 'logs');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => {
      const requestId = info.requestId ? `[${info.requestId}] ` : '';
      return `${info.timestamp} ${info.level.toUpperCase()}: ${requestId}${info.message}`;
    })
  ),
  transports: [
    new transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logsDir, 'combined.log') }),
  ],
});

// In development also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  }));
}

module.exports = logger;
