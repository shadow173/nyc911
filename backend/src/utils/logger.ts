// logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty', // For development, to pretty-print logs
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

export default logger;
