const pino = require('pino');

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:yyyy-mm-dd HH:MM:ss' } }
    : undefined,  // In prod: raw JSON to stdout -> PM2 captures it
  redact: ['req.headers.authorization', 'req.headers.cookie'],  // Protect sensitive data
});

module.exports = logger;