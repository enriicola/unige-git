import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level:
        process.env.NODE_ENV === 'test'
          ? 'error'
          : process.env.NODE_ENV === 'development'
            ? 'debug'
            : 'info',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
  ],
});

if (process.env.NODE_ENV === 'test') {
  const originalError = logger.error.bind(logger);
  // Route logger errors through console.error so vitest.setup can fail fast.
  // (Winston may write directly to stderr, which vitest doesn't treat as a test failure.)
  logger.error = (...args) => {
    originalError(...args);
    console.error(...args);
  };
}

export default logger;

/*
	logger.debug('debug');
	logger.info('info');
	logger.warn('warn');
	logger.error('error');
*/
